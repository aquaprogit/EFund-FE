import { Violation } from "./Violation";

export interface Complaint {
    id: string;
    status: number;
    comment: string;
    requestedAt: string;
    reviewedAt?: string;
    fundraisingId: string;
    requestedBy: string;
    requestedFor: string;
    reviewedBy?: string;
    violations: Violation[];
}


