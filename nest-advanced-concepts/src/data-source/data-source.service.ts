import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class DataSourceService {
  constructor(@Inject(REQUEST) private readonly requestContext: unknown) {}
}
