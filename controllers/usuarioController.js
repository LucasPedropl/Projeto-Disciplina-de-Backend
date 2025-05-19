const { ObjectId } = require('mongodb');
const { criarUsuario } = require('../models/usuario');
const { conectar } = require('../db/db');
const { logErro } = require('../utils/logger');

function validarUsuario(data) {
    return data.nome && data.email;
}

async function listar(req, res, enviarJSON) {
    try {
        const db = await conectar();
        const lista = await db.collection('usuarios').find().toArray();
        enviarJSON(res, 200, lista);
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao listar usuários' });
    }
}

async function buscar(req, res, enviarJSON, id) {
    try {
        const db = await conectar();
        const doc = await db.collection('usuarios').findOne({ _id: new ObjectId(id) });
        enviarJSON(res, doc ? 200 : 404, doc || { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao buscar usuário' });
    }
}

async function criar(req, res, enviarJSON, lerCorpo) {
    try {
        const db = await conectar();
        const corpo = await lerCorpo(req);
        if (!validarUsuario(corpo)) {
            return enviarJSON(res, 400, { erro: 'Nome e e-mail são obrigatórios' });
        }
        const usuario = criarUsuario(corpo);
        const resultado = await db.collection('usuarios').insertOne(usuario);
        enviarJSON(res, 201, { _id: resultado.insertedId });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao criar usuário' });
    }
}

async function atualizar(req, res, enviarJSON, lerCorpo, id) {
    try {
        const db = await conectar();
        const atualizacao = await lerCorpo(req);
        if (!validarUsuario(atualizacao)) {
            return enviarJSON(res, 400, { erro: 'Nome e e-mail são obrigatórios' });
        }
        const resultado = await db.collection('usuarios').updateOne({ _id: new ObjectId(id) }, { $set: atualizacao });
        enviarJSON(res, resultado.matchedCount ? 200 : 404, resultado.matchedCount ? { atualizado: id } : { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao atualizar usuário' });
    }
}

async function remover(req, res, enviarJSON, id) {
    try {
        const db = await conectar();
        const resultado = await db.collection('usuarios').deleteOne({ _id: new ObjectId(id) });
        enviarJSON(res, resultado.deletedCount ? 200 : 404, resultado.deletedCount ? { deletado: id } : { erro: 'Não encontrado' });
    } catch (erro) {
        logErro(erro);
        enviarJSON(res, 500, { erro: 'Erro ao remover usuário' });
    }
}

module.exports = { listar, buscar, criar, atualizar, remover };
