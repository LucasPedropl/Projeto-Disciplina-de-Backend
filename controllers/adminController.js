// filepath: c:\Users\pedro\Downloads\Projeto-Disciplina-de-Backend\controllers\adminController.js
import { ObjectId } from 'mongodb';
import { criarAdmin } from '../models/admin.js';
import conectar from '../db/db.js';
import { logErro } from '../utils/logger.js';
import { gerarToken } from '../utils/jwt.js';

class AdminController {
	async registrar(req, res) {
		try {
			const db = await conectar();
			const { username, password } = req.body;

			const adminExistente = await db
				.collection('admins')
				.findOne({ username });
			if (adminExistente) {
				return res.status(400).send('Administrador já cadastrado');
			}

			const admin = criarAdmin({ username, password });
			await db.collection('admins').insertOne(admin);
			res.redirect('/admin/login');
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao registrar administrador');
		}
	}

	async login(req, res) {
		try {
			const db = await conectar();
			const { username, password } = req.body;

			const admin = await db.collection('admins').findOne({ username });
			if (!admin || admin.password !== password) {
				return res.status(401).send('Credenciais inválidas');
			}

			const token = gerarToken(admin);
			res.cookie('token', token, { httpOnly: true });
			res.redirect('/');
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao fazer login');
		}
	}

	async dashboard(req, res) {
		res.render('adminDashboard.hbs');
	}

	async logout(req, res) {
		res.clearCookie('token');
		res.redirect('/admin/login');
	}

	renderRegister(req, res) {
		res.render('adminRegister');
	}

	renderLogin(req, res) {
		res.render('adminLogin');
	}
}

export default new AdminController();
