import { Router } from 'express'
import { clientsRoutes } from './features/clients'
import { ticketsRoutes } from './features/tickets'
import { servicesRoutes } from './features/services'

const routes = Router()

routes.use('/clients', clientsRoutes)
routes.use('/services', servicesRoutes)
routes.use('/tickets', ticketsRoutes) // 🔹 registrar

export { routes }
