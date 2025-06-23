// filepath: c:\Users\pedro\Downloads\Projeto-Disciplina-de-Backend\middleware\auth.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export function verifyToken(req, res, next) {
	const token =
		req.cookies.token || req.headers['authorization']?.split(' ')[1];
	if (!token) {
		return res.redirect('/admin/login');
	}

	jwt.verify(token, SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.redirect('/admin/login');
		}
		req.adminId = decoded.id;
		next();
	});
}

export function isAdmin(req, res, next) {
	if (!req.adminId) {
		return res
			.status(403)
			.send('Acesso negado. Você não é um administrador.');
	}
	next();
}
