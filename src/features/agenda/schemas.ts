import { z } from 'zod'

export const appointmentFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Informe um título'),
    date: z.string().min(1, 'Informe a data'),
    startTime: z.string().min(1, 'Informe o horário de início'),
    endTime: z.string().min(1, 'Informe o horário de término'),
    notes: z.string().trim().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'O término deve ser depois do início',
    path: ['endTime'],
  })

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>
