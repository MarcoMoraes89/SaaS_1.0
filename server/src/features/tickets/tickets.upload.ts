import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'

const UPLOAD_DIR = path.resolve(__dirname, '..', '..', '..', 'uploads')

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      cb(null, UPLOAD_DIR)
    },

    filename: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      cb(null, `${uniqueSuffix}-${file.originalname}`)
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})
