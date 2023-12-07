import {
    ENUM_MAPPING_RULES_CONDITION,
    ENUM_MAPPING_RULES_RESOURCE,
} from '../constants/saved-search-mapping-rule.contant';

export interface IMappingRule {
    mapKey: string;
    condition: ENUM_MAPPING_RULES_CONDITION;
    resource: ENUM_MAPPING_RULES_RESOURCE;
}
