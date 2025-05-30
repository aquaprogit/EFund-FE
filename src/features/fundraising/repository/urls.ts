export const urls = {
    myFundraising: '/fundraisings/',
    fundraisings: '/fundraisings',
    fundraising: (id: string) => `/fundraisings/${id}`,
    fundraisingAvatar: (id: string) => `/fundraisings/${id}/avatar`,
    fundraisingSearch: '/fundraisings/search',
    fundraisingCreate: '/fundraisings'
} as const; 