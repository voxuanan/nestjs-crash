import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';

export function PaginationFilterEqualIdPipe(
    field: string,
    raw: boolean,
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterEqualObjectIdPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService,
        ) {}

        async transform(value: string): Promise<Record<string, number>> {
            if (!value) {
                return undefined;
            }

            value = value.trim();
            const finalValue = parseInt(value);

            let res: Record<string, any>;
            if (raw) {
                res = {
                    [field]: value,
                };
            } else {
                res = this.paginationService.filterEqual<number>(
                    field,
                    finalValue,
                );
            }

            this.request.__pagination = {
                ...this.request.__pagination,
                filters: this.request.__pagination?.filters
                    ? {
                          ...this.request.__pagination?.filters,
                          ...res,
                      }
                    : res,
            };

            return res;
        }
    }

    return mixin(MixinPaginationFilterEqualObjectIdPipe);
}
