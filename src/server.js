import restify from 'restify';
import DB from './db';
import Mutant from './mutant';

class Server {

	constructor() {
		DB().then(db => this.db = db);
		this.mutant = new Mutant();
		this.server = restify.createServer();
		this.server.use(restify.plugins.acceptParser(this.server.acceptable));
		this.server.use(restify.plugins.queryParser());
		this.server.use(restify.plugins.fullResponse());
		this.server.use(restify.plugins.bodyParser());

		this.server.post('/mutant', this.isMutant.bind(this));
		this.server.get('/stats', this.stats.bind(this));
	}

	async isMutant(req, res, next) {
		res.header('content-type', 'application/json');
		try {
			const {dna = []} = req.body || {};
			const id = dna.join('');
			const record = await this.db.get(id);
			if (record === null) {
				const mutant = this.mutant.isMutant(dna);
				this.db.save({dna: id, mutant});
				res.send(mutant ? 200 : 403);
			} else {
				res.send(record.mutant ? 200 : 403);
			}
		} catch (e) {
			res.send(500);
		}	
		return next();
	}

	async stats(req, res, next) {
		res.header('content-type', 'application/json');
		try {
			const stats = await this.db.stats();
			res.send(stats);
		} catch (e) {
			res.send(500);
		}
		return next();
	}

	start() {
		this.server.listen(Server.PORT, () => {
			console.log('%s listening at %s', this.server.name, this.server.url);
		});
	}
};

Server.PORT = 3000;

export default Server;
