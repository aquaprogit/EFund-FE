import Jar from "../../monobank/models/Jar";
import Report from "../../reports/models/Report";

export default interface Fundraising {
    id: string;
    title: string;
    description: string;
    avatarUrl: string;
    status: FundraisingStatus;
    createdAt: string;
    closedAt: Date;
    readyForReviewAt: Date;
    reviewedAt: Date;
    userId: string;
    userName: string;
    userAvatarUrl: string;
    monobankJarId: string;
    tags: string[];
    monobankJar: Jar;
    reports: Report[];
}

enum FundraisingStatus {
    Open = 1,
    Closed = 2,
    ReadyForReview = 3,
    Reviewed = 4,
    Hidden = 5,
    Deleted = 6
}