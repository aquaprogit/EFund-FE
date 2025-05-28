import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const useZodForm = <T extends Record<string, any>>(schema: z.ZodType<T>) => {
    return useForm<T>({ resolver: zodResolver(schema) });
};

export { useZodForm };
