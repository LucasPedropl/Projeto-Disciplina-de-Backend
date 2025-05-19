function criarPedido(data) {
	return {
		idUsuario: data.idUsuario,
		itens: data.itens,
	};
}

module.exports = { criarPedido };
