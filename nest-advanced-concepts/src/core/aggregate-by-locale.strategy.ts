import {
  ContextId,
  ContextIdFactory,
  ContextIdResolver,
  ContextIdResolverFn,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';
import { pick } from 'accept-language-parser';
import { Request } from 'express';
import { I18nService } from 'src/i18n/i18n.service';

export class AggregateByLocaleContextStrategy implements ContextIdStrategy {
  private readonly tenants = new Map<string, ContextId>();

  attach(
    contextId: ContextId,
    request: Request,
  ): ContextIdResolverFn | ContextIdResolver {
    const localeCode =
      pick(
        I18nService.supportedLanguages,
        request.headers['accept-language'],
      ) ?? I18nService.defaultLanguage;

    let localeSubTreeId: ContextId;
    if (this.tenants.has(localeCode)) {
      localeSubTreeId = this.tenants.get(localeCode);
    } else {
      localeSubTreeId = ContextIdFactory.create();
      this.tenants.set(localeCode, localeSubTreeId);
      setTimeout(() => this.tenants.delete(localeCode), 3000);
    }

    return {
      payload: {
        localeCode,
      },
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? localeSubTreeId : contextId,
    };
  }
}
