export enum FundraisingStatus {
    // Fundraising just created and visible to the public (default)
    Open = 1,
    // Fundraising funded enough and don't need more donations (set by owner)
    Closed = 2,
    // Fundraising is ready for review by the admin (set by owner)
    ReadyForReview = 3,
    // Fundraising is reviewed by the admin, marked as finished (set by admin)
    Reviewed = 4,
    // Fundraising is hidden from the public (set after review action 'Request changes')
    Hidden = 5,
    // Fundraising is deleted (set after review action 'Approve complaint')
    Deleted = 6
}

export const FundraisingStatusLabels = {
    [FundraisingStatus.Open]: 'Open',
    [FundraisingStatus.Closed]: 'Closed',
    [FundraisingStatus.ReadyForReview]: 'Ready for Review',
    [FundraisingStatus.Reviewed]: 'Reviewed',
    [FundraisingStatus.Hidden]: 'Hidden',
    [FundraisingStatus.Deleted]: 'Deleted'
};

export const getStatusOptions = () => {
    return Object.entries(FundraisingStatusLabels).map(([value, label]) => ({
        value: parseInt(value),
        label
    }));
}; 