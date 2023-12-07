export enum ENUM_MAPPING_RULES_CONDITION {
    Equal = 'Equal',
    NotEqual = 'NotEqual',
    Large = 'Large',
    LargeOrEqual = 'LargeOrEqual',
    Smaller = 'Smaller',
    SmallerOrEqual = 'SmallerOrEqual',
    ContainedBy = 'ContainedBy',
    NotContainedBy = 'NotContainedBy',
    Between = 'Between',
    FullTextSearch = 'FullTextSearch',
    PolyContainPoint = 'PolyContainPoint',
    PropertySubType = 'PropertySubType',
}

export enum ENUM_MAPPING_RULES_RESOURCE {
    Homing = 'Homing',
    Trestle = 'Trestle',
}

export const MAPPING_RULES_SAVED_SEARCH = {
    min_pr: {
        mapKey: 'ListPrice',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    max_pr: {
        mapKey: 'ListPrice',
        condition: ENUM_MAPPING_RULES_CONDITION.LargeOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    city: {
        mapKey: 'City',
        condition: ENUM_MAPPING_RULES_CONDITION.Equal,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    state: {
        mapKey: 'StateOrProvince',
        condition: ENUM_MAPPING_RULES_CONDITION.Equal,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    k: {
        mapKey: 'SearchKeyword',
        condition: ENUM_MAPPING_RULES_CONDITION.FullTextSearch,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    ft: {
        mapKey: 'PropertyType',
        condition: ENUM_MAPPING_RULES_CONDITION.Equal,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // sb: '',
    // sm: '',
    // src: '',
    status: {
        mapKey: 'StandardStatus',
        condition: ENUM_MAPPING_RULES_CONDITION.Equal,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // pre_market: '',
    min_ls: {
        mapKey: 'LotSizeSquareFeet',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    max_ls: {
        mapKey: 'LotSizeSquareFeet',
        condition: ENUM_MAPPING_RULES_CONDITION.LargeOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    min_lsf: {
        mapKey: 'LivingArea',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    max_lsf: {
        mapKey: 'LivingArea',
        condition: ENUM_MAPPING_RULES_CONDITION.LargeOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    min_yb: {
        mapKey: 'YearBuilt',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    max_yb: {
        mapKey: 'YearBuilt',
        condition: ENUM_MAPPING_RULES_CONDITION.LargeOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // dc: "",
    // min_dc: null,
    // max_dc: null,
    /*   ne: '33.81569,-117.86456', //BOundary
  sw: '33.56831,-118.15844', //BOundary */
    sn: {
        mapKey: 'Latitude',
        condition: ENUM_MAPPING_RULES_CONDITION.Between,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    ew: {
        mapKey: 'Longitude',
        condition: ENUM_MAPPING_RULES_CONDITION.Between,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    pt: {
        mapKey: 'PropertySubType',
        condition: ENUM_MAPPING_RULES_CONDITION.PropertySubType,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // ra: null,
    poly: {
        mapKey: 'Longitude,Latitude',
        condition: ENUM_MAPPING_RULES_CONDITION.PolyContainPoint,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    area: {
        mapKey: 'Longitude,Latitude',
        condition: ENUM_MAPPING_RULES_CONDITION.PolyContainPoint,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // zm: '12',
    keyword: {
        mapKey: 'SearchKeyword',
        condition: ENUM_MAPPING_RULES_CONDITION.FullTextSearch,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    /* s_id: 'SAvesearchID', */
    parking: {
        mapKey: 'ParkingTotal',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    hoa_fee: {
        mapKey: 'AssociationFee',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    commission: {
        mapKey: 'BuyerAgencyCompensation',
        condition: ENUM_MAPPING_RULES_CONDITION.Equal,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // include_hoa_data: 0,
    garage: {
        mapKey: 'GarageSpaces',
        condition: ENUM_MAPPING_RULES_CONDITION.Equal,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // open_house: '',
    // '3d_tour': '',
    basement: {
        mapKey: 'Basement',
        condition: ENUM_MAPPING_RULES_CONDITION.Equal,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    // num_of_stories: 'Stories',
    // senior_living: '',
    amenities: {
        mapKey: 'AssociationAmenities',
        condition: ENUM_MAPPING_RULES_CONDITION.ContainedBy,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    /* homing_owned: '', //UserID / homing
  day_on_homing: '', // ... //homing// num 
  pin: null, // ... homing
  pin_view: null, // ... homing
  folder_id: null, // ... homing */
    // recent_sales: 'null',
    min_bedroom: {
        mapKey: 'BedroomsTotal',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    max_bedroom: {
        mapKey: 'BedroomsTotal',
        condition: ENUM_MAPPING_RULES_CONDITION.LargeOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    min_bathroom: {
        mapKey: 'BathroomsTotalInteger',
        condition: ENUM_MAPPING_RULES_CONDITION.SmallerOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    max_bathroom: {
        mapKey: 'BathroomsTotalInteger',
        condition: ENUM_MAPPING_RULES_CONDITION.LargeOrEqual,
        resource: ENUM_MAPPING_RULES_RESOURCE.Trestle,
    },
    /*  listing_id: '', // id /homing */
    // request_type: null,
};
