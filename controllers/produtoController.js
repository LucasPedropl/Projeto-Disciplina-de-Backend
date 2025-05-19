const { ObjectId } = require('mongodb');
const { criarProduto } = require('../models/produto');
const { conectar } = require('../db/db');
const { logErro } = require('../utils/logger');

function validarProduto(data) {
    return data.nome && typeof data.preco === 'number' && !isNaN(data.preco);
}

async function listar(req, res, enviarJSON) {
    try {
        const db = await conectar();
        const lista = await db.collection('produtos').find().toArray();
        enviarJSON(res, 200, lista);
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao listar produtos' });
    }
}

async function buscar(req, res, enviarJSON, id) {
    try {
        const db = await conectar();
        const doc = await db.collection('produtos').findOne({ _id: new ObjectId(id) });
        enviarJSON(res, doc ? 200 : 404, doc || { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao buscar produto' });
    }
}

async function criar(req, res, enviarJSON, lerCorpo) {
    try {
        const db = await conectar();
        const corpo = await lerCorpo(req);
        if (!validarProduto(corpo)) {
            return enviarJSON(res, 400, { erro: 'Nome e preço numérico são obrigatórios' });
        }
        const produto = criarProduto(corpo);
        const resultado = await db.collection('produtos').insertOne(produto);
        const novoProduto = await db.collection('produtos').findOne({ _id: resultado.insertedId });
        enviarJSON(res, 201, novoProduto);
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao criar produto' });
    }
}

async function atualizar(req, res, enviarJSON, lerCorpo, id) {
    try {
        const db = await conectar();
        const atualizacao = await lerCorpo(req);
        if (!validarProduto(atualizacao)) {
            return enviarJSON(res, 400, { erro: 'Nome e preço numérico são obrigatórios' });
        }
        const resultado = await db.collection('produtos').updateOne({ _id: new ObjectId(id) }, { $set: atualizacao });
        enviarJSON(res, resultado.matchedCount ? 200 : 404, resultado.matchedCount ? { atualizado: id } : { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao atualizar produto' });
    }
}

async function remover(req, res, enviarJSON, id) {
    try {
        const db = await conectar();
        const resultado = await db.collection('produtos').deleteOne({ _id: new ObjectId(id) });
        enviarJSON(res, resultado.deletedCount ? 200 : 404, resultado.deletedCount ? { deletado: id } : { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao remover produto' });
    }
}

module.exports = { listar, buscar, criar, atualizar, remover };
