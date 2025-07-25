import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import hbs from 'hbs';
import routes from './routes/routes.js';
import adminRoutes from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: 'um_segredo_aleatorio',
		resave: false,
		saveUninitialized: false,
	})
);
app.use((req, res, next) => {
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

app.use('/', routes);
app.use('/admin', adminRoutes);

hbs.registerHelper('json', function (context) {
	return JSON.stringify(context);
});
hbs.registerHelper('ifCond', function (v1, v2, options) {
	return v1 == v2 ? options.fn(this) : options.inverse(this);
});
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
