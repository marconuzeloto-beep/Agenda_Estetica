import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome completo'),
  phone: z
    .string()
    .trim()
    .min(1, 'Informe o telefone')
    .refine((value) => value.replace(/\D/g, '').length >= 10, {
      message: 'Telefone deve ter DDD + número (mín. 10 dígitos)',
    }),
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: 'E-mail inválido',
    }),
  birthDate: z.string().trim().optional(),
  notes: z.string().trim().optional(),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>
