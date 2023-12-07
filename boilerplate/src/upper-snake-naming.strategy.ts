import { DefaultNamingStrategy, type NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';
import _ from 'lodash';

export class UpperSnakeNamingStrategy
    extends DefaultNamingStrategy
    implements NamingStrategyInterface
{
    tableName(className: string, customName: string | undefined): string {
        return customName ?? snakeCase(className);
    }

    columnName(
        propertyName: string,
        customName: string | undefined,
        embeddedPrefixes: string[],
    ): string {
        return _.toUpper(
            snakeCase(embeddedPrefixes.join('_')) +
                (customName ?? _.toUpper(snakeCase(propertyName))),
        );
    }

    relationName(propertyName: string): string {
        return _.toUpper(snakeCase(propertyName));
    }

    joinColumnName(relationName: string, referencedColumnName: string): string {
        return _.toUpper(snakeCase(relationName + '_' + referencedColumnName));
    }

    joinTableName(
        firstTableName: string,
        secondTableName: string,
        firstPropertyName: string,
        _secondPropertyName: string,
    ): string {
        return _.toUpper(
            snakeCase(
                firstTableName +
                    '_' +
                    firstPropertyName.replaceAll(/\./gi, '_') +
                    '_' +
                    secondTableName,
            ),
        );
    }

    joinTableColumnName(
        tableName: string,
        propertyName: string,
        columnName?: string,
    ): string {
        return _.toUpper(
            snakeCase(tableName + '_' + (columnName ?? propertyName)),
        );
    }

    classTableInheritanceParentColumnName(
        parentTableName: string,
        parentTableIdPropertyName: string,
    ): string {
        return _.toUpper(
            snakeCase(`${parentTableName}_${parentTableIdPropertyName}`),
        );
    }
}
