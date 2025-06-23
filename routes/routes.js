// filepath: c:\Users\pedro\Downloads\Projeto-Disciplina-de-Backend\routes\routes.js
import express from 'express';
const router = express.Router();

import userController from '../controllers/usuarioController.js';
import produtoController from '../controllers/produtoController.js';
import pedidoController from '../controllers/pedidoController.js';
import adminRoutes from './adminRoutes.js';
import { verifyToken } from '../middleware/auth.js';

// Admin routes
router.use('/admin', adminRoutes);

// Protege as rotas abaixo
router.use(['/', '/usuarios', '/produtos', '/pedidos'], verifyToken);

// Pedidos
router.get('/pedidos', (req, res) => pedidoController.listar(req, res));
router.post('/pedidos', (req, res) => pedidoController.criar(req, res));
router.get('/pedidos/editar/:id', (req, res) =>
	pedidoController.editar(req, res)
);
router.post('/pedidos/editar/:id', (req, res) =>
	pedidoController.atualizar(req, res)
);
router.post('/pedidos/deletar/:id', (req, res) =>
	pedidoController.remover(req, res)
);

// Produtos
router.get('/produtos', (req, res) => produtoController.listar(req, res));
router.post('/produtos', (req, res) => produtoController.criar(req, res));
router.get('/produtos/editar/:id', (req, res) =>
	produtoController.editar(req, res)
);
router.post('/produtos/editar/:id', (req, res) =>
	produtoController.atualizar(req, res)
);
router.post('/produtos/deletar/:id', (req, res) =>
	produtoController.remover(req, res)
);

// Usuários
router.get('/usuarios', (req, res) => userController.listar(req, res));
router.post('/usuarios', (req, res) => userController.criar(req, res));
router.get('/usuarios/editar/:id', (req, res) =>
	userController.editar(req, res)
);
router.post('/usuarios/editar/:id', (req, res) =>
	userController.atualizar(req, res)
);
router.post('/usuarios/deletar/:id', (req, res) =>
	userController.remover(req, res)
);

// Página inicial
router.get('/', (req, res) => {
	res.render('index');
});

export default router;
