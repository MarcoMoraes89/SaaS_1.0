import { Request, Response } from 'express'
import { servicesService } from './services.service'

export const servicesController = {
  /**
   * Adiciona um serviço a um Ticket
   */
  async addService(req: Request, res: Response) {
    try {
      const { ticketId, description, price } = req.body

      if (!ticketId || !description || price == null) {
        return res.status(400).json({
          success: false,
          message: 'ticketId, description e price são obrigatórios',
        })
      }

      const service = await servicesService.addService(
        ticketId,
        description,
        Number(price)
      )

      return res.status(201).json({
        success: true,
        data: service,
      })
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      })
    }
  },

  /**
   * Lista serviços de um Ticket
   */
  async listServices(req: Request, res: Response) {
    try {
      const ticketId = String(req.params.ticketId)
      const services = await servicesService.listServices(ticketId)
      return res.status(200).json({ success: true, data: services })
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      })
    }
  },

  /**
   * Remove um serviço
   */
  async deleteService(req: Request, res: Response) {
    try {
      const serviceId = String(req.params.serviceId)
      await servicesService.deleteService(serviceId)
  
      return res
        .status(200)
        .json({ success: true, message: 'Serviço removido' })
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.message,
      })
    }
  }
}
