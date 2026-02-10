import { Request, Response } from 'express'
import { ticketService } from './tickets.service'
import { createTicketSchema, updateTicketSchema } from './tickets.schema'

// Criar ticket
export async function createTicket(req: Request, res: Response) {
  try {
    const data = createTicketSchema.parse(req.body)
    const ticket = await ticketService.createTicket(data)
    return res.status(201).json({ success: true, data: ticket })
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

// Listar todos os tickets
export async function listTickets(req: Request, res: Response) {
  try {
    const tickets = await ticketService.listTickets()
    return res.status(200).json({ success: true, data: tickets })
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

// Listar ticket por ID
export async function getTicketById(req: Request, res: Response) {
  try {
    const id = String(req.params.id)
    const ticket = await ticketService.getTicketById(id)
    return res.status(200).json({ success: true, data: ticket })
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

// Atualizar ticket
export async function updateTicket(req: Request, res: Response) {
  try {
    const id = String(req.params.id)
    const data = updateTicketSchema.parse(req.body)
    const ticket = await ticketService.updateTicket(id, data)
    return res.status(200).json({ success: true, data: ticket })
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message })
  }
}

// Deletar ticket
export async function deleteTicket(req: Request, res: Response) {
  try {
    const id = String(req.params.id)
    await ticketService.deleteTicket(id)
    return res
      .status(200)
      .json({ success: true, message: 'Ticket removido' })
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message })
  }
}
