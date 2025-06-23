import { ObjectId } from 'mongodb';
import { criarUsuario } from '../models/usuario.js';
import conectar from '../db/db.js';
import { logErro } from '../utils/logger.js';

class UsuarioController {
	validarUsuario(data) {
		return data.nome && data.email;
	}

	async listar(req, res) {
		try {
			const db = await conectar();
			const usuarios = await db
				.collection('usuarios')
				.find({ adminId: req.adminId })
				.toArray();
			res.render('usuarios.hbs', { usuarios });
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao listar usuários');
		}
	}

	async criar(req, res) {
		try {
			const db = await conectar();
			const { nome, email } = req.body;
			if (!this.validarUsuario({ nome, email })) {
				return res.status(400).send('Dados inválidos');
			}
			const usuario = criarUsuario({ nome, email });
			usuario.adminId = req.adminId;
			await db.collection('usuarios').insertOne(usuario);
			res.redirect('/usuarios');
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao criar usuário');
		}
	}

	async editar(req, res) {
		try {
			const db = await conectar();
			const id = req.params.id;
			const usuario = await db
				.collection('usuarios')
				.findOne({ _id: new ObjectId(id), adminId: req.adminId });
			if (!usuario) return res.status(404).send('Usuário não encontrado');
			res.render('usuarios.hbs', { editar: true, usuario });
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao buscar usuário');
		}
	}

	async atualizar(req, res) {
		try {
			const db = await conectar();
			const id = req.params.id;
			const { nome, email } = req.body;
			if (!this.validarUsuario({ nome, email })) {
				return res.status(400).send('Dados inválidos');
			}
			const result = await db
				.collection('usuarios')
				.updateOne(
					{ _id: new ObjectId(id), adminId: req.adminId },
					{ $set: { nome, email } }
				);
			if (result.matchedCount === 0) {
				return res.status(404).send('Usuário não encontrado');
			}
			res.redirect('/usuarios');
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao atualizar usuário');
		}
	}

	async remover(req, res) {
		try {
			const db = await conectar();
			const id = req.params.id;
			const result = await db
				.collection('usuarios')
				.deleteOne({ _id: new ObjectId(id), adminId: req.adminId });
			if (result.deletedCount === 0) {
				return res.status(404).send('Usuário não encontrado');
			}
			res.redirect('/usuarios');
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao remover usuário');
		}
	}
}

export default new UsuarioController();
