import { prisma } from '../../lib/prisma'

export const servicesService = {
  /**
   * Adiciona um serviço a um Ticket
   * Recalcula o totalCost do Ticket
   */
  async addService(ticketId: string, description: string, price: number) {
    // cria o serviço
    const service = await prisma.service.create({
      data: {
        description,
        price,
        ticketId,
      },
    })

    // recalcula total do ticket
    const services = await prisma.service.findMany({
      where: { ticketId },
    })

    const totalCost = services.reduce(
      (sum, service) => sum + service.price,
      0
    )

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { totalCost },
    })

    return service
  },

  /**
   * Lista serviços de um Ticket
   */
  async listServices(ticketId: string) {
    return prisma.service.findMany({
      where: { ticketId },
    })
  },

  /**
   * Remove um serviço e recalcula o total
   */
  async deleteService(serviceId: string) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      throw new Error('Serviço não encontrado')
    }

    await prisma.service.delete({
      where: { id: serviceId },
    })

    const services = await prisma.service.findMany({
      where: { ticketId: service.ticketId },
    })

    const totalCost =
      services.length === 0
        ? null
        : services.reduce((sum, s) => sum + s.price, 0)

    await prisma.ticket.update({
      where: { id: service.ticketId },
      data: { totalCost },
    })
  },
}
