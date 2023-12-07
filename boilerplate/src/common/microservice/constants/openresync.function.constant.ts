import { pointInPoly } from 'src/common/helper/constants/helper.function.constant';
import { ENUM_MAPPING_RULES_CONDITION } from 'src/modules/saved-search/constants/saved-search-mapping-rule.contant';

export const checkCondition = (
    a: any,
    b: any,
    condition: ENUM_MAPPING_RULES_CONDITION,
) => {
    if (a == null || a == '') return true;
    if (b == null) return false;

    switch (condition) {
        case ENUM_MAPPING_RULES_CONDITION.Equal:
            return a == b;
        case ENUM_MAPPING_RULES_CONDITION.Large:
            return +a > +b;
        case ENUM_MAPPING_RULES_CONDITION.LargeOrEqual:
            return +a >= +b;
        case ENUM_MAPPING_RULES_CONDITION.Smaller:
            return +a < +b;
        case ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual:
            return +a <= +b;
        case ENUM_MAPPING_RULES_CONDITION.NotEqual:
            return +a != +b;
        case ENUM_MAPPING_RULES_CONDITION.FullTextSearch:
            if (!(Array.isArray(b) || typeof b == 'string')) return false;
            return a.every((element) => {
                return b.includes(element);
            });
        case ENUM_MAPPING_RULES_CONDITION.ContainedBy:
            if (!Array.isArray(a)) return false;
            if (!(Array.isArray(b) || typeof b == 'string')) return false;
            return a.every((element) => {
                return b.includes(element);
            });
        case ENUM_MAPPING_RULES_CONDITION.NotContainedBy:
            if (!Array.isArray(a)) return false;
            if (!(Array.isArray(b) || typeof b == 'string')) return false;
            return !a.every((element) => {
                return b.includes(element);
            });
        case ENUM_MAPPING_RULES_CONDITION.Between:
            if (!Array.isArray(a) || a.length != 2) return false;
            return +a[0] < +b && +b < +a[1];
        case ENUM_MAPPING_RULES_CONDITION.PolyContainPoint:
            return pointInPoly(b, a.coordinates, a.type);
        case ENUM_MAPPING_RULES_CONDITION.PropertySubType:
            let result = true;
            if (b == 'MultiFamily') result = a.includes('income');
            else if (b == 'Commercial') result = a.includes('lease');
            else if (b == 'Townhouse') result = a.includes('townhome');
            else if (b == 'Condominium') result = a.includes('condo');
            else if (b == 'SingleFamily') result = a.includes('singlehome');
            else if (b == 'ManufacturedHome' || b == 'ManufacturedOnLand')
                result = a.includes('manufactured');
            else result = a.includes('other');
            return result;
    }
};
