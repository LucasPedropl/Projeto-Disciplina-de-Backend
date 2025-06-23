import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function logErro(erro) {
	const logDir = path.join(__dirname, '..', 'logs');
	if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
	const logPath = path.join(logDir, 'erros.log');
	const mensagem = `[${new Date().toISOString()}] ${erro.stack || erro}\n`;
	fs.appendFile(logPath, mensagem, () => {});
}
