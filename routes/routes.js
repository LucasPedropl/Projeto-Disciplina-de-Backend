const fs = require('fs');
const path = require('path');

function serveArquivo(res, nomeArquivo) {
	const filePath = path.join(__dirname, '..', 'public', nomeArquivo);
	fs.readFile(filePath, (err, data) => {
		if (err) {
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.end('<h1>Arquivo não encontrado</h1>');
		} else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		}
	});
}

function rotas(req, res) {
	const aceita = req.headers.accept || '';
	if ((req.url === '/' || req.url === '/index.html') && req.method === 'GET') {
		serveArquivo(res, 'index.html');
		return true;
	}
	if (req.url === '/produtos' && req.method === 'GET' && !aceita.includes('application/json')) {
		serveArquivo(res, 'produtos.html');
		return true;
	}
	if (req.url === '/usuarios' && req.method === 'GET' && !aceita.includes('application/json')) {
		serveArquivo(res, 'usuarios.html');
		return true;
	}
	if (req.url === '/pedidos' && req.method === 'GET' && !aceita.includes('application/json')) {
		serveArquivo(res, 'pedidos.html');
		return true;
	}
	return false;
}

module.exports = rotas;
