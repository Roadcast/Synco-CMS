export interface Company {
    address: string
    country: Country
    created_on: string
    currency: any
    decimal_places: any
    geom: Geom
    icon: string
    id: string
    is_deactivate: boolean
    name: string
    partner_id: string
    phone_code: string
    profile_icon: string
    sale_poc_id: string
    support_poc_id: string
    time_zone: string
    time_zone_string: string
    unique_company_id: string
}

export interface Country {
    alpha2: string
    alpha3: string
    areaCode: string
    capital: string
    countryName: string
    countryNumber: string
    currencyCode: string
    timeZone: string[]
}

export interface Geom {
    latitude: number
    longitude: number
}
