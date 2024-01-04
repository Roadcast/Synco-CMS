export interface FormColumn {
    fieldname: string;
    is_req: boolean;
    is_searchable: boolean;
    label: string;
    options?: any;
    placeholder: string;
    sequence: number;
    type: string;
}

export interface Config {
    form_columns: FormColumn[];
}

export interface Geotag {
    active: boolean;
    company: string;
    company_id: string;
    config: Config;
    created_on: Date;
    id: string;
    name: string;
}
