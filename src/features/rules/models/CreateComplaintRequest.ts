export interface CreateComplaintRequest {
    fundraisingId: string;
    comment?: string;
    violationsIds: string[];
}