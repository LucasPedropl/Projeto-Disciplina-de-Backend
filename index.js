const http = require('http');
const usuarioController = require('./controllers/usuarioController');
const produtoController = require('./controllers/produtoController');
const pedidoController = require('./controllers/pedidoController');
const rotas = require('./routes/routes');


function lerCorpo(req) {
	return new Promise((resolve, reject) => {
		let dados = '';
		req.on('data', (parte) => (dados += parte));
		req.on('end', () => {
			try {
				resolve(dados ? JSON.parse(dados) : {});
			} catch (erro) {
				reject(erro);
			}
		});
	});
}

function enviarJSON(res, status, conteudo) {
	const json = JSON.stringify(conteudo);
	res.writeHead(status, { 'Content-Type': 'application/json' });
	res.end(json);
}

const servidor = http.createServer(async (req, res) => {
	if (rotas(req, res)) return;


	const partes = req.url.split('/').filter(Boolean);
	const recurso = partes[0];
	const id = partes[1];

	try {
		switch (recurso) {
			case 'usuarios':
				if (req.method === 'GET' && id) return usuarioController.buscar(req, res, enviarJSON, id);
				if (req.method === 'GET') return usuarioController.listar(req, res, enviarJSON);
				if (req.method === 'POST') return usuarioController.criar(req, res, enviarJSON, lerCorpo);
				if (req.method === 'PUT' && id) return usuarioController.atualizar(req, res, enviarJSON, lerCorpo, id);
				if (req.method === 'DELETE' && id) return usuarioController.remover(req, res, enviarJSON, id);
				break;
			case 'produtos':
				if (req.method === 'GET' && id) return produtoController.buscar(req, res, enviarJSON, id);
				if (req.method === 'GET') return produtoController.listar(req, res, enviarJSON);
				if (req.method === 'POST') return produtoController.criar(req, res, enviarJSON, lerCorpo);
				if (req.method === 'PUT' && id) return produtoController.atualizar(req, res, enviarJSON, lerCorpo, id);
				if (req.method === 'DELETE' && id) return produtoController.remover(req, res, enviarJSON, id);
				break;
			case 'pedidos':
				if (req.method === 'GET' && id) return pedidoController.buscar(req, res, enviarJSON, id);
				if (req.method === 'GET') return pedidoController.listar(req, res, enviarJSON);
				if (req.method === 'POST') return pedidoController.criar(req, res, enviarJSON, lerCorpo);
				if (req.method === 'PUT' && id) return pedidoController.atualizar(req, res, enviarJSON, lerCorpo, id);
				if (req.method === 'DELETE' && id) return pedidoController.remover(req, res, enviarJSON, id);
				break;
			default:
				return enviarJSON(res, 404, { erro: 'Rota não encontrada' });
		}
		enviarJSON(res, 405, { erro: 'Método não permitido' });
	} catch (erro) {
		enviarJSON(res, 500, { erro: erro.message });
	}
});

servidor.listen(process.env.PORT || 3000, () => {
	console.log(`Servidor ouvindo na porta ${process.env.PORT || 3000}`);
	console.log('Acesse http://localhost:3000 para utilizar o sistema');
});
