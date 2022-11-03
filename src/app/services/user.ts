export interface User {
  id: string;
  currency?: string;
  name?: string;
  mobile_number?: string;
  email?: string;
  retail_brand?: RetailBrand;
}

export interface RetailBrand {
  id: string;
  name: string;
}
