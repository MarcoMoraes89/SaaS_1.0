import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { routes } from './routes';
import { errorHandler } from './lib/errorHandler';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Arquivos estáticos
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '..', '..', 'uploads'))
);

// Rotas da aplicação
app.use(routes);

// Middleware global de erro (SEMPRE por último)
app.use(errorHandler);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 sistema_gestao is online na porta ${PORT}`);
});
