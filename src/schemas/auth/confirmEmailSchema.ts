import { z } from 'zod';

export const confirmEmailSchema = z.object({
    userId: z.string()
        .min(1, 'User ID is required'),
    code: z.string()
        .min(1, 'Confirmation code is required')
        .length(6, 'Confirmation code must be 6 characters')
});

export type ConfirmEmailFormData = z.infer<typeof confirmEmailSchema>; 