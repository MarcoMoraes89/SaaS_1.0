import { Router } from 'express'
import { servicesController } from './services.controller'

const servicesRoutes = Router()

// Adiciona um serviço a um Ticket
servicesRoutes.post('/', servicesController.addService)

// Lista serviços de um Ticket
servicesRoutes.get('/:ticketId', servicesController.listServices)

// Remove um serviço
servicesRoutes.delete('/:serviceId', servicesController.deleteService)

export { servicesRoutes }
