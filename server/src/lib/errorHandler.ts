import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ZodIssue } from "zod";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  // Erros de validação (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      errors: err.issues.map((e: ZodIssue) => ({
        field: e.path.map(String).join("."),
        message: e.message,
      })),
    });
  }

  // Erros customizados simples
  if (err instanceof Error) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Erro inesperado
  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
  });
};
