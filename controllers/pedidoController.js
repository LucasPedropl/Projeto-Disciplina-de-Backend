import { ObjectId } from 'mongodb';
import { criarPedido } from '../models/pedido.js';
import conectar from '../db/db.js';
import { logErro } from '../utils/logger.js';

class PedidoController {
	validarPedido(data) {
		if (
			!data.idUsuario ||
			!Array.isArray(data.itens) ||
			data.itens.length === 0
		)
			return false;
		for (const item of data.itens) {
			if (
				!item.produtoId ||
				typeof item.quantidade !== 'number' ||
				item.quantidade < 1
			)
				return false;
		}
		return true;
	}

	async listar(req, res) {
		try {
			const db = await conectar();
			const pedidos = await db
				.collection('pedidos')
				.find({ adminId: req.adminId })
				.toArray();
			const usuarios = await db
				.collection('usuarios')
				.find({ adminId: req.adminId })
				.toArray();
			const produtos = await db
				.collection('produtos')
				.find({ adminId: req.adminId })
				.toArray();
			res.render('pedidos.hbs', { pedidos, usuarios, produtos });
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao listar pedidos');
		}
	}

	async buscar(req, res, enviarJSON, id) {
		try {
			const db = await conectar();
			const doc = await db
				.collection('pedidos')
				.findOne({ _id: new ObjectId(id) });
			enviarJSON(res, doc ? 200 : 404, doc || { erro: 'Não encontrado' });
		} catch (erro) {
			logErro(erro);
			enviarJSON(res, 500, { erro: 'Erro ao buscar pedido' });
		}
	}

	async criar(req, res) {
		try {
			const db = await conectar();
			const { idUsuario, produtoId, quantidade } = req.body;
			const itens = [
				{
					produtoId,
					quantidade: Number(quantidade),
				},
			];
			if (!this.validarPedido({ idUsuario, itens })) {
				return res.status(400).send('Dados inválidos');
			}
			const pedido = criarPedido({ idUsuario, itens });
			pedido.adminId = req.adminId;
			await db.collection('pedidos').insertOne(pedido);
			res.redirect('/pedidos');
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao criar pedido');
		}
	}

	async editar(req, res) {
		const db = await conectar();
		const id = req.params.id;
		const pedido = await db
			.collection('pedidos')
			.findOne({ _id: new ObjectId(id), adminId: req.adminId }); // ajuste
		if (!pedido) return res.status(404).send('Pedido não encontrado');
		res.render('pedidos.hbs', { editar: true, pedido });
	}

	async atualizar(req, res) {
		const db = await conectar();
		const id = req.params.id;
		const { idUsuario, itens } = req.body;
		if (!this.validarPedido({ idUsuario, itens })) {
			return res.status(400).send('Dados inválidos');
		}
		const result = await db.collection('pedidos').updateOne(
			{ _id: new ObjectId(id), adminId: req.adminId }, // ajuste
			{ $set: { idUsuario, itens } }
		);
		if (result.matchedCount === 0) {
			return res.status(404).send('Pedido não encontrado');
		}
		res.redirect('/pedidos');
	}

	async remover(req, res) {
		const db = await conectar();
		const id = req.params.id;
		const result = await db
			.collection('pedidos')
			.deleteOne({ _id: new ObjectId(id), adminId: req.adminId }); // ajuste
		if (result.deletedCount === 0) {
			return res.status(404).send('Pedido não encontrado');
		}
		res.redirect('/pedidos');
	}
}

export default new PedidoController();
