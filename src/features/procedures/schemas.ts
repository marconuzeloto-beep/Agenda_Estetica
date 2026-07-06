import { z } from 'zod'

export const procedureFormSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome do procedimento'),
  category: z.string().trim().min(1, 'Informe a categoria'),
  durationMinutes: z
    .number()
    .min(5, 'Duração mínima de 5 minutos')
    .max(480, 'Duração máxima de 8 horas'),
  price: z.number().min(0, 'Preço não pode ser negativo'),
  notes: z.string().trim().optional(),
})

export type ProcedureFormValues = z.infer<typeof procedureFormSchema>
