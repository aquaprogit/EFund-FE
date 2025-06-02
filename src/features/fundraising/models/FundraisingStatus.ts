export enum FundraisingStatus {
    Open = 1,
    Closed = 2,
    ReadyForReview = 3,
    Reviewed = 4,
    Hidden = 5,
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