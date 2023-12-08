import { Index, ViewColumn, ViewEntity } from 'typeorm';
export const ARTICLE_WITH_MAP_DATA_VIEW_NAME: string =
  'article_with_map_data_materialized_view';

@ViewEntity({
  expression: `
    SELECT a.id, a.name, t."mapData"
    FROM articles AS a 
    LEFT JOIN tests AS t ON a."name" = t."name"
    `,
  materialized: true,
  name: ARTICLE_WITH_MAP_DATA_VIEW_NAME,
  synchronize: true,
})
@Index(['id'], { unique: true })
export class ArticlWithMapDataeMaterializedView {
  @ViewColumn()
  id!: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  mapData?: string;
}
