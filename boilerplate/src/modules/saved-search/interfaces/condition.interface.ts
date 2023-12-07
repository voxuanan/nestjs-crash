export interface ICondition {
    min_pr: string;
    max_pr: string;
    city: string;
    state: string;
    k: string;
    ft: string;
    sb: string;
    sm: string;
    src: string;
    status?: number;
    pre_market?: number;
    min_ls: string;
    max_ls: string;
    min_lsf: string;
    max_lsf: string;
    min_yb: string;
    max_yb: string;
    dc?: number;
    min_dc?: number;
    max_dc?: number;
    ne: string;
    sw: string;
    pt: string;
    ra?: number;
    poly: any;
    area: any;
    zm: string;
    keyword: string;
    s_id: number;
    parking: string;
    hoa_fee: string;
    commission?: number;
    include_hoa_data: number;
    garage: string;
    open_house: string;
    '3d_tour': string;
    basement: string;
    num_of_stories: string;
    senior_living: string;
    amenities: string;
    homing_owned: string;
    day_on_homing: string;
    recent_sales?: number;
    pin?: number;
    pin_view?: number;
    folder_id?: number;
    min_bedroom: string;
    max_bedroom: string;
    min_bathroom: string;
    max_bathroom: string;
    listing_id: number;
    request_type?: number;
}
