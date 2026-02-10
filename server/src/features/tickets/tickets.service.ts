import { prisma } from '../../lib/prisma'
import {
  createTicketSchema,
  updateTicketSchema,
} from './tickets.schema'
import {
  Ticket,
  PaymentStatus,
  TicketStatus,
} from '@prisma/client'
import { z } from 'zod'

export const ticketService = {
  /**
   * Criar Ticket com Número Sequencial Automático
   */
  async createTicket(
    data: z.infer<typeof createTicketSchema>
  ): Promise<Ticket> {
    // 1. Busca o maior número sequencial existente
    const lastTicket = await prisma.ticket.findFirst({
      orderBy: { sequentialId: 'desc' },
      select: { sequentialId: true }
    });

    // 2. Define o próximo número (se não houver nenhum, começa em 1)
    const nextNumber = lastTicket ? lastTicket.sequentialId + 1 : 1;

    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        sequentialId: nextNumber, // Atribui o número gerado (ex: 501)
        status: (data.status as TicketStatus) ?? TicketStatus.ORCAMENTO,
        priority: data.priority ?? 'MEDIUM',
        estimatedCost: data.estimatedCost,
        clientId: data.clientId,
        paymentStatus: PaymentStatus.PENDENTE,
      },
    })

    return ticket
  },

  /**
   * Upload de fotos
   */
  async uploadPhotos(ticketId: string, files: Express.Multer.File[]) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    if (!files || files.length === 0) {
      throw new Error('No files uploaded')
    }

    await prisma.photo.createMany({
      data: files.map(file => ({
        ticketId,
        url: `/uploads/${file.filename}`,
      })),
    })

    return { uploaded: files.length }
  },

  /**
   * Listar Tickets
   */
  async listTickets(clientId?: string): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: clientId ? { clientId } : {},
      include: {
        client: true,
        photos: true,
        services: true,
      },
      orderBy: { sequentialId: 'desc' }, // Ordena pelo número da OS (mais recentes primeiro)
    })
  },

  /**
   * Buscar Ticket por ID
   */
  async getTicketById(id: string): Promise<Ticket | null> {
    return prisma.ticket.findUnique({
      where: { id },
      include: {
        client: true,
        photos: true,
        services: true,
      },
    })
  },

  /**
   * Atualizar Ticket
   */
  async updateTicket(
    id: string,
    data: z.infer<typeof updateTicketSchema>
  ): Promise<Ticket> {
    const currentTicket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!currentTicket) {
      throw new Error('Ticket not found')
    }

    const nextStatus = data.status || currentTicket.status;
    const nextPaymentStatus = data.paymentStatus || currentTicket.paymentStatus;

    if (nextStatus === TicketStatus.FINALIZADA && nextPaymentStatus !== PaymentStatus.PAGO) {
      throw new Error('Não é possível finalizar a OS sem pagamento confirmado')
    }

    let paidAtValue = currentTicket.paidAt;
    if (data.paymentStatus === PaymentStatus.PAGO && !currentTicket.paidAt) {
      paidAtValue = new Date();
    } else if (data.paymentStatus === PaymentStatus.PENDENTE) {
      paidAtValue = null;
    }

    return await prisma.ticket.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: (data.status as TicketStatus),
        paymentStatus: data.paymentStatus,
        priority: data.priority,
        estimatedCost: data.estimatedCost,
        totalCost: data.totalCost,
        paidAt: paidAtValue,
      },
    })
  },

  /**
   * Deletar Ticket
   */
  async deleteTicket(id: string): Promise<Ticket> {
    return prisma.ticket.delete({
      where: { id },
    })
  },
}