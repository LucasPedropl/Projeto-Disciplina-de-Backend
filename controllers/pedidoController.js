const { ObjectId } = require('mongodb');
const { criarPedido } = require('../models/pedido');
const { conectar } = require('../db/db');
const { logErro } = require('../utils/logger');

function validarPedido(data) {
    if (!data.idUsuario || !Array.isArray(data.itens) || data.itens.length === 0) return false;
    for (const item of data.itens) {
        if (!item.produtoId || typeof item.quantidade !== 'number' || item.quantidade < 1) return false;
    }
    return true;
}

async function listar(req, res, enviarJSON) {
    try {
        const db = await conectar();
        const lista = await db.collection('pedidos').find().toArray();
        enviarJSON(res, 200, lista);
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao listar pedidos' });
    }
}

async function buscar(req, res, enviarJSON, id) {
    try {
        const db = await conectar();
        const doc = await db.collection('pedidos').findOne({ _id: new ObjectId(id) });
        enviarJSON(res, doc ? 200 : 404, doc || { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao buscar pedido' });
    }
}

async function criar(req, res, enviarJSON, lerCorpo) {
    try {
        const db = await conectar();
        const corpo = await lerCorpo(req);
        if (!validarPedido(corpo)) {
            return enviarJSON(res, 400, { erro: 'Usuário e pelo menos um item (produtoId, quantidade >= 1) são obrigatórios' });
        }
        const pedido = criarPedido(corpo);
        const resultado = await db.collection('pedidos').insertOne(pedido);
        enviarJSON(res, 201, { _id: resultado.insertedId });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao criar pedido' });
    }
}

async function atualizar(req, res, enviarJSON, lerCorpo, id) {
    try {
        const db = await conectar();
        const atualizacao = await lerCorpo(req);
        if (!validarPedido(atualizacao)) {
            return enviarJSON(res, 400, { erro: 'Usuário e pelo menos um item (produtoId, quantidade >= 1) são obrigatórios' });
        }
        const resultado = await db.collection('pedidos').updateOne({ _id: new ObjectId(id) }, { $set: atualizacao });
        enviarJSON(res, resultado.matchedCount ? 200 : 404, resultado.matchedCount ? { atualizado: id } : { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao atualizar pedido' });
    }
}

async function remover(req, res, enviarJSON, id) {
    try {
        const db = await conectar();
        const resultado = await db.collection('pedidos').deleteOne({ _id: new ObjectId(id) });
        enviarJSON(res, resultado.deletedCount ? 200 : 404, resultado.deletedCount ? { deletado: id } : { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao remover pedido' });
    }
}

module.exports = { listar, buscar, criar, atualizar, remover };
