export interface Zone {
    id: string;
    name: string;
}

export interface Store {
    active: boolean;
    address?: any;
    address_id: string;
    brand?: any;
    brand_id?: any;
    brand_name?: any;
    email: string;
    external_id: string;
    id: string;
    is_premium: boolean;
    merchants: any[];
    mobile_number: string;
    name: string;
    prep_time: number;
    zone: Zone;
    zone_id: string;
}