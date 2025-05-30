import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormMode = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';

const useZodForm = <T extends Record<string, any>>(schema: z.ZodType<T>) => {
    return useForm<T>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });
};

export { useZodForm };

