import { ObjectId } from 'mongodb';
import { criarProduto } from '../models/produto.js';
import conectar from '../db/db.js';
import { logErro } from '../utils/logger.js';

class ProdutoController {
	validarProduto(data) {
		return (
			data.nome && typeof data.preco === 'number' && !isNaN(data.preco)
		);
	}

	async listar(req, res) {
		try {
			const db = await conectar();
			const produtos = await db
				.collection('produtos')
				.find({ adminId: req.adminId })
				.toArray();
			res.render('produtos.hbs', { produtos });
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao listar produtos');
		}
	}

	async criar(req, res) {
		try {
			const db = await conectar();
			const { nome, preco } = req.body;
			if (!this.validarProduto({ nome, preco: Number(preco) })) {
				return res.status(400).send('Dados inválidos');
			}
			const produto = criarProduto({ nome, preco: Number(preco) });
			produto.adminId = req.adminId;
			await db.collection('produtos').insertOne(produto);
			res.redirect('/produtos');
		} catch (erro) {
			logErro(erro);
			res.status(500).send('Erro ao criar produto');
		}
	}

	async editar(req, res) {
		const db = await conectar();
		const id = req.params.id;
		const produto = await db
			.collection('produtos')
			.findOne({ _id: new ObjectId(id), adminId: req.adminId }); // ajuste
		if (!produto) return res.status(404).send('Produto não encontrado');
		res.render('produtos.hbs', { editar: true, produto });
	}

	async atualizar(req, res) {
		const db = await conectar();
		const id = req.params.id;
		const { nome, preco } = req.body;
		if (!this.validarProduto({ nome, preco: Number(preco) })) {
			return res.status(400).send('Dados inválidos');
		}
		const result = await db.collection('produtos').updateOne(
			{ _id: new ObjectId(id), adminId: req.adminId }, // ajuste
			{ $set: { nome, preco: Number(preco) } }
		);
		if (result.matchedCount === 0) {
			return res.status(404).send('Produto não encontrado');
		}
		res.redirect('/produtos');
	}

	async remover(req, res) {
		const db = await conectar();
		const id = req.params.id;
		const result = await db
			.collection('produtos')
			.deleteOne({ _id: new ObjectId(id), adminId: req.adminId }); // ajuste
		if (result.deletedCount === 0) {
			return res.status(404).send('Produto não encontrado');
		}
		res.redirect('/produtos');
	}
}

export default new ProdutoController();
