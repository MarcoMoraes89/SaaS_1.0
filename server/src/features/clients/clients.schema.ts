import { z } from "zod";

// Validação para criar cliente
export const createClientSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  documento: z.string().min(5, "Documento inválido"),
  email: z.string().email("Email inválido").optional(),
});

// Validação para atualizar cliente
export const updateClientSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório").optional(),
  documento: z.string().min(5, "Documento inválido").optional(),
  email: z.string().email("Email inválido").optional(),
});
