import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ARTICLE_WITH_MAP_DATA_VIEW_NAME } from './article-with-map-data.materialized-view.entity';

@Injectable()
export class ArticleWithMapDataViewUpdater {
  logger: Logger = new Logger(ArticleWithMapDataViewUpdater.name);

  constructor(private readonly dataSource: DataSource) {}

  async updateArticleView(): Promise<void> {
    if (await this.isViewEmpty()) {
      return this.populateViewForTheFirstTime();
    }
    return this.refreshView();
  }

  private async isViewEmpty(): Promise<boolean> {
    const result: any = await this.dataSource.query(
      `SELECT * FROM pg_matviews WHERE matviewname = '${ARTICLE_WITH_MAP_DATA_VIEW_NAME}'`,
    );
    return !result[0].ispopulated;
  }

  private async populateViewForTheFirstTime(): Promise<void> {
    this.logger.warn('Populating Article View for the first time...');
    return this.dataSource.query(
      `REFRESH MATERIALIZED VIEW ${ARTICLE_WITH_MAP_DATA_VIEW_NAME} WITH DATA`,
    );
  }

  private async refreshView(): Promise<void> {
    this.logger.warn('Refreshing Article View...');
    return this.dataSource.query(
      `REFRESH MATERIALIZED VIEW CONCURRENTLY ${ARTICLE_WITH_MAP_DATA_VIEW_NAME} WITH DATA`,
    );
  }
}
