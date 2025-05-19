function criarProduto(data) {
	return {
		nome: data.nome,
		preco: data.preco,
	};
}

module.exports = { criarProduto };
