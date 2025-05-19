const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const NOME_BANCO = 'ecommerce';

let banco = null;

async function conectar() {
	if (!banco) {
		const cliente = await MongoClient.connect(MONGO_URI);
		banco = cliente.db(NOME_BANCO);
	}
	return banco;
}

module.exports = { conectar };
