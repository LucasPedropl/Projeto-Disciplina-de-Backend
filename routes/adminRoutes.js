
import express from 'express';
import adminController from '../controllers/adminController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


router.get('/register', (req, res) => adminController.renderRegister(req, res));
router.post('/register', (req, res) => adminController.registrar(req, res));


router.get('/login', (req, res) => adminController.renderLogin(req, res));
router.post('/login', (req, res) => adminController.login(req, res));


router.get('/logout', (req, res) => adminController.logout(req, res));


router.get('/dashboard', verifyToken, (req, res) =>
	adminController.dashboard(req, res)
);

export default router;
