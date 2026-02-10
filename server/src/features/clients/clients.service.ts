import { prisma } from '../../lib/prisma'

interface CreateClientDTO {
  name: string
  phone: string
  document?: string
  email?: string
}

export class ClientsService {
  async create(data: CreateClientDTO) {
    if (data.document) {
      const existingClient = await prisma.client.findFirst({
        where: { document: data.document },
      })

      if (existingClient) {
        throw new Error('Cliente com este documento já existe')
      }
    }

    return prisma.client.create({
      data,
    })
  }

  async list() {
    return prisma.client.findMany()
  }

  async findById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { 
        tickets: true // 🔹 Isso faz o Prisma trazer as OS vinculadas ao cliente
      },
    })
  
    if (!client) {
      throw new Error('Cliente não encontrado')
    }
  
    return client
  }

  async update(id: string, data: CreateClientDTO) {
    const client = await prisma.client.findUnique({
      where: { id },
    })

    if (!client) {
      throw new Error('Cliente não encontrado')
    }

    if (data.document) {
      const existingClient = await prisma.client.findFirst({
        where: {
          document: data.document,
          NOT: { id },
        },
      })

      if (existingClient) {
        throw new Error('Outro cliente já usa este documento')
      }
    }

    return prisma.client.update({
      where: { id },
      data,
    })
  }

  // 🗑️ DELETE
  async delete(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
    })

    if (!client) {
      throw new Error('Cliente não encontrado')
    }

    await prisma.client.delete({
      where: { id },
    })
  }
}
