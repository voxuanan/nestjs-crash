import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { HelperArrayService } from 'src/common/helper/services/helper.array.service';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { MailConsumer } from 'src/common/mail/processors/mail.processor';
import { checkCondition } from 'src/common/microservice/constants/openresync.function.constant';
import { LastRunService } from 'src/common/microservice/services/microservice.last-run.service';
import { FindPropertiesDTO } from 'src/modules/property/dtos/property.find.dto';
import { PropertyService } from 'src/modules/property/services/property.service';
import { UserService } from 'src/modules/user/services/user.service';
import { DataSource } from 'typeorm';
import {
    ENUM_MAPPING_RULES_CONDITION,
    MAPPING_RULES_SAVED_SEARCH,
} from '../constants/saved-search-mapping-rule.contant';
import { IProperty } from 'src/modules/property/interface/property.interface';
import { IMappingRule } from '../interfaces/mapping-rule.interface';
import { ICountMap } from '../interfaces/count-map.interface';
import { SavedSeachConsumer } from '../processors/saved-search.procesor';
import { SyncFromMlsJobData } from 'src/modules/property/constants/property.job-data.constant';

@Injectable()
export class SavedSearchService {
    constructor(
        private dataSource: DataSource,
        private readonly propertyService: PropertyService,
        private readonly mailConsumer: MailConsumer,
        private readonly lastRunService: LastRunService,
        private readonly helperDateService: HelperDateService,
        @Inject(forwardRef(() => SavedSeachConsumer))
        private readonly savedSeachConsumer: SavedSeachConsumer,
    ) {}

    public async getSavedSearchCriterias(
        limit: number,
        offset: number,
    ): Promise<[any[], number]> {
        const qb = this.dataSource
            .createQueryBuilder()
            .select(
                "t1.ID,t5.NAME,t6.EMAIL,JSON_REPLACE(t1.DATA,'$.poly',t2.DATA, '$.area',t3.GEOJSON)",
                'DATA',
            )
            .from('cbs_conditions', 't1')
            .leftJoin(
                'cbs_polygons',
                't2',
                "JSON_UNQUOTE(JSON_EXTRACT(t1.DATA, '$.poly')) = t2.ID",
            )
            .leftJoin(
                'cbs_map_data',
                't3',
                "JSON_UNQUOTE(JSON_EXTRACT(t1.DATA, '$.area')) = t3.URL_KEY",
            )
            .innerJoin(
                'cbs_search_condition_mapping',
                't4',
                't1.ID = t4.CONDITION_ID',
            )
            .innerJoin('cbs_search', 't5', 't4.SEARCH_ID = t5.ID')
            .innerJoin('user', 't6', 't6.ID = t5.USER_ID')
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('1')
                    .from('cbs_map_data', 'cmd')
                    .where(
                        "cmd.URL_KEY = JSON_UNQUOTE(JSON_EXTRACT(t1.DATA, '$.area'))",
                    )
                    .andWhere('t3.ID > cmd.ID')
                    .getQuery();
                return `NOT EXISTS (${subQuery})`;
            })
            .andWhere('(t5.STATUS = :statusNew OR t5.STATUS = :statusShared)', {
                statusNew: 'new',
                statusShared: 'shared',
            });

        const countQb = qb.clone();
        let savedSearchCriterias = await qb
            .offset(offset)
            .limit(limit)
            .execute();

        const { count } = await countQb.select('COUNT(*)', 'count').getRawOne();
        const total = parseInt(count, 10);

        savedSearchCriterias = savedSearchCriterias.map((item) => {
            item.DATA.poly = JSON.parse(item.DATA.poly);
            item.DATA.area = JSON.parse(item.DATA.area);
            item.DATA.k = item.DATA.k ? item.DATA.k.split(', ') : null;
            item.DATA.keyword = item.DATA.keyword
                ? item.DATA.keyword.split(', ')
                : null;
            item.DATA.pt = item.DATA.pt ? item.DATA.pt.split(',') : null;
            item.DATA.amenities = item.DATA.amenities
                ? item.DATA.amenities.split(',')
                : null;
            if (item.DATA.sw && item.DATA.ne) {
                item.DATA.ns = [
                    item.DATA.sw.split(',')[0],
                    item.DATA.ne.split(',')[0],
                ];
                item.DATA.sn = [
                    item.DATA.sw.split(',')[0],
                    item.DATA.ne.split(',')[0],
                ];
                item.DATA.we = [
                    item.DATA.sw.split(',')[1],
                    item.DATA.ne.split(',')[1],
                ];
                item.DATA.ew = [
                    item.DATA.sw.split(',')[1],
                    item.DATA.ne.split(',')[1],
                ];
            }

            return {
                ...item.DATA,
                ID: item.ID,
                NAME: item.NAME,
                EMAIL: item.EMAIL,
            };
        });

        return [savedSearchCriterias, total];
    }

    public checkMatchingProperty(
        savedSearchCriteria: any,
        property: IProperty,
        isCheckingOldProperty = false,
    ) {
        let isOk = true;
        for (const key in MAPPING_RULES_SAVED_SEARCH) {
            const rule: IMappingRule = MAPPING_RULES_SAVED_SEARCH[key];
            if (savedSearchCriteria[key]) {
                const propertiesData = this.propertyService.preparePropertyData(
                    property,
                    rule.mapKey,
                    rule.resource,
                );
                const condition = rule.condition;
                if (isCheckingOldProperty) {
                    if (
                        propertiesData &&
                        !checkCondition(
                            savedSearchCriteria[key],
                            propertiesData,
                            condition,
                        )
                    ) {
                        isOk = false;
                        break;
                    }
                } else if (
                    !checkCondition(
                        savedSearchCriteria[key],
                        propertiesData,
                        condition,
                    )
                ) {
                    isOk = false;
                    break;
                }
            }
        }
        return isOk;
    }

    public getMatchingProperties(
        savedSearchCriterias,
        propertiesData,
        oldPropertiesData = [],
    ): ICountMap {
        const countMap = {};
        for (let j = 0; j < propertiesData.length; j++) {
            const property = propertiesData[j];
            for (let i = 0; i < savedSearchCriterias.length; i++) {
                const savedSearchCriteria = savedSearchCriterias[i];

                if (this.checkMatchingProperty(savedSearchCriteria, property)) {
                    const listingIds =
                        countMap[savedSearchCriteria.ID]?.listingIds ?? [];

                    if (
                        oldPropertiesData.length == propertiesData.length &&
                        oldPropertiesData[j] != null
                    ) {
                        if (
                            !this.checkMatchingProperty(
                                savedSearchCriteria,
                                oldPropertiesData[j],
                                true,
                            )
                        ) {
                            countMap[savedSearchCriteria.ID] = {
                                email: savedSearchCriteria.EMAIL,
                                searchName: savedSearchCriteria.NAME,
                                value:
                                    (countMap[savedSearchCriteria.ID]?.value ??
                                        0) + 1,
                                listingIds: [...listingIds, property.ListingId],
                            };
                        }
                    } else {
                        countMap[savedSearchCriteria.ID] = {
                            email: savedSearchCriteria.EMAIL,
                            searchName: savedSearchCriteria.NAME,
                            value:
                                (countMap[savedSearchCriteria.ID]?.value ?? 0) +
                                1,
                            listingIds: [...listingIds, property.ListingId],
                        };
                    }
                }
            }
        }
        return countMap;
    }

    public async updateNewTotalListingSavedSearch(countMap: ICountMap) {
        for (const item of Object.keys(countMap)) {
            const value = countMap[item].value;

            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.manager.query(`
                UPDATE cbs_search_save_search sss, cbs_search_condition_mapping scm, cbs_conditions c
                SET sss.NEW_TOTAL_LISTING = sss.NEW_TOTAL_LISTING + ${value}
                WHERE sss.SEARCH_ID = scm.SEARCH_ID and scm.CONDITION_ID = c.ID and c.ID = ${item}
            `);
            await queryRunner.release();
        }
    }

    public async sendEmailNotifNewSavedSearch(countMap: ICountMap) {
        for (const item of Object.keys(countMap)) {
            const { value, listingIds, searchName, email } = countMap[item];

            if (email) {
                await this.mailConsumer.sendMailSavedSearch({
                    email,
                    context: {
                        listingIds,
                        value,
                        searchName,
                    },
                });
            }
        }
    }

    public async savedSearchMatchingProperties(
        limit: number,
        offset: number,
        setLastRun: boolean = true,
        dto?: FindPropertiesDTO,
    ) {
        const endDate = dto?.endDate || this.helperDateService.timestamp();
        const startDate =
            dto?.startDate || this.lastRunService.getLastRunOpenresync();

        const query: FindPropertiesDTO = {
            endDate,
            startDate,
        };
        let [savedSearchCriterias, total] = await this.getSavedSearchCriterias(
            limit,
            offset,
        );
        if (limit + offset < total) {
            await this.savedSeachConsumer.savedSearchNewMatching({
                limit,
                offset: limit + offset,
                dto: query,
                setLastRun: false,
            });
        }

        const propertiesData = await this.propertyService.getPropertiesData(
            query,
        );

        const countMap = this.getMatchingProperties(
            savedSearchCriterias,
            propertiesData,
        );
        console.log(countMap);

        await this.updateNewTotalListingSavedSearch(countMap);

        await this.sendEmailNotifNewSavedSearch(countMap);
        if (setLastRun) {
            this.lastRunService.setLastRunOpenresync(endDate);
        }
    }

    public async savedSearchMatchingPropertiesContainOldProperty(
        data: SyncFromMlsJobData,
    ) {
        //TODO: loop through all saved search
        let [savedSearchCriterias, total] = await this.getSavedSearchCriterias(
            100,
            0,
        );

        const countMap = await this.getMatchingProperties(
            savedSearchCriterias,
            data.propertiesData.map((data) => data.data),
            data.propertiesData.map((data) => data.oldData),
        );

        console.log(countMap);
        await this.updateNewTotalListingSavedSearch(countMap);

        await this.sendEmailNotifNewSavedSearch(countMap);
    }
}
