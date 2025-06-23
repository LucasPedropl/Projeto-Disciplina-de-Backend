
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export function gerarToken(admin) {
	return jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
}

export function verificarToken(token) {
	try {
		return jwt.verify(token, SECRET_KEY);
	} catch (erro) {
		return null;
	}
}
