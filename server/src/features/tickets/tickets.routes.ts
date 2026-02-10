import { Router } from 'express'
import {
  createTicket,
  listTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from './tickets.controller'

const ticketsRoutes = Router()

ticketsRoutes.post('/', createTicket)
ticketsRoutes.get('/', listTickets)
ticketsRoutes.get('/:id', getTicketById)
ticketsRoutes.patch('/:id', updateTicket)
ticketsRoutes.delete('/:id', deleteTicket)

export { ticketsRoutes }
