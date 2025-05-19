const fs = require('fs');
const path = require('path');

function logErro(erro) {
    const logDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    const logPath = path.join(logDir, 'erros.log');
    const mensagem = `[${new Date().toISOString()}] ${erro.stack || erro}\n`;
    fs.appendFile(logPath, mensagem, () => {});
}

module.exports = { logErro };