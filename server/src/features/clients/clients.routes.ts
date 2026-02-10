import { Router } from 'express'
import { ClientsController } from './clients.controller'

const clientsRoutes = Router()

clientsRoutes.post('/', ClientsController.create)
clientsRoutes.get('/', ClientsController.list)
clientsRoutes.get('/:id', ClientsController.show)
clientsRoutes.put('/:id', ClientsController.update)
clientsRoutes.delete('/:id', ClientsController.delete) // ✅ AGORA EXISTE

export { clientsRoutes }
