// filepath: c:\Users\pedro\Downloads\Projeto-Disciplina-de-Backend\routes\adminRoutes.js
import express from 'express';
import adminController from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Admin Registration
router.get('/register', (req, res) => adminController.renderRegister(req, res));
router.post('/register', (req, res) => adminController.registrar(req, res));

// Admin Login
router.get('/login', (req, res) => adminController.renderLogin(req, res));
router.post('/login', (req, res) => adminController.login(req, res));

// Logout
router.get('/logout', (req, res) => adminController.logout(req, res));

// Protected Admin Routes (aplique o middleware só aqui)
router.get('/dashboard', verifyToken, (req, res) =>
	adminController.dashboard(req, res)
);

export default router;
