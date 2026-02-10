import { Request, Response } from 'express'
import { ClientsService } from './clients.service'

const clientsService = new ClientsService()

export const ClientsController = {
  async create(req: Request, res: Response) {
    try {
      const client = await clientsService.create(req.body)
      return res.status(201).json(client)
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Erro ao criar cliente',
      })
    }
  },

  async list(req: Request, res: Response) {
    const clients = await clientsService.list()
    return res.json(clients)
  },

  async show(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const client = await clientsService.findById(id)
      return res.json(client)
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || 'Cliente não encontrado',
      })
    }
  },

  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      const client = await clientsService.update(id, req.body)
      return res.json(client)
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || 'Erro ao atualizar cliente',
      })
    }
  },

  // 🗑️ DELETE
  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params
      await clientsService.delete(id)
      return res.status(204).send()
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || 'Erro ao deletar cliente',
      })
    }
  },
}
