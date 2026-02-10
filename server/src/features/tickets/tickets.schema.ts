import { z } from 'zod'

/**
 * 🔹 ENUMS (Sincronizados com o novo Prisma)
 */
export const ticketStatusEnum = z.enum([
  'ORCAMENTO',
  'APROVACAO',
  'AGUARDANDO_FORNECEDOR',
  'EM_EXECUCAO',
  'FINALIZADA',
  'CANCELADA',
])

export const paymentStatusEnum = z.enum([
  'PENDENTE',
  'PAGO',
])

export const priorityEnum = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
])

/**
 * 🔹 Criação de Ticket (OS)
 */
export const createTicketSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),

  // Definimos ORCAMENTO como padrão aqui também para evitar erros
  status: ticketStatusEnum.default('ORCAMENTO').optional(),
  priority: priorityEnum.default('MEDIUM').optional(),

  estimatedCost: z
    .coerce.number()
    .nonnegative('O valor estimado não pode ser negativo')
    .optional()
    .nullable(),

  clientId: z.string().uuid('ID do cliente inválido'),
})

/**
 * 🔹 Atualização de Ticket
 */
export const updateTicketSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().min(5).optional(),

    status: ticketStatusEnum.optional(),
    paymentStatus: paymentStatusEnum.optional(),

    estimatedCost: z.coerce.number().nonnegative().optional().nullable(),
    totalCost: z.coerce.number().nonnegative().optional().nullable(),

    priority: priorityEnum.optional(),
    // Captura o momento do pagamento automaticamente se necessário no service
    paidAt: z.date().optional().nullable(), 
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'É necessário informar ao menos um campo para atualização',
  })