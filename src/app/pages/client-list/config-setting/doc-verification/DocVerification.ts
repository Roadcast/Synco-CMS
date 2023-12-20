export interface DocVerification {
    company_id: string
    created_on?: string
    docs: Docs
    id: string
    verification_partner: string
    verification_partner_id: string
}

export interface Docs {
    aadhar: string
    bank: string
    dl: string
    get_aadhar_otp: string
    pan: string
    verify_aadhar_with_otp: string
}