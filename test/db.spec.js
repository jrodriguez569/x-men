import '@babel/polyfill';
import MongoMemoryServer from 'mongodb-memory-server';
import { expect } from 'chai'
import { describe } from "mocha";
import DB from '../src/db';

const mongod = new MongoMemoryServer({
	debug: true
});

describe("DB class tests", () => {

	before(function(done) {
		this.timeout(10000);
		mongod.getConnectionString().then((uri) => {
			process.env.MONGO_URL = uri;
			done();
		});
	});

	after(function(done) {
		mongod.stop().then(() => done());
	});

	describe("isMutant method", () => {
		it("should be true", async () => {
			const db = await DB(process.env.MONGO_URL);
			await db.clean();
			await db.save({ dna: 'AAABBBCCC', mutant: true });
			expect((await db.get('AAABBBCCC')).mutant).to.be.true;
			expect((await db.get('AAABBBCCD'))).to.be.null;
			db.disconnect();
		});

		it("should be false", async () => {
			const db = await DB(process.env.MONGO_URL);
			await db.clean();
			await db.save({ dna: 'AAABBBCCC', mutant: false });
			expect((await db.get('AAABBBCCC')).mutant).to.be.false;
			expect((await db.get('AAABBBCCD'))).to.be.null;
			await db.disconnect();
		});

		it("should be ok", async () => {
			const db = await DB(process.env.MONGO_URL);
			await db.clean();
			expect(await db.stats()).to.deep.equal({ count_mutant_dna: 0, count_human_dna: 0, ratio: 0 });

			await db.save([
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC00", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC01", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC02", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC03", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC04", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC05", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC06", "mutant": true}
			]);
			expect(await db.stats()).to.deep.equal({ count_mutant_dna: 7, count_human_dna: 0, ratio: 0 });

			await db.save([
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC07", "mutant": false},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC08", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC09", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC10", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC11", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC12", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC13", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC14", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC15", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC16", "mutant": false},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC17", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC18", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC19", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC20", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC21", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC22", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC23", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC24", "mutant": false},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC25", "mutant": false},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC26", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC27", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC28", "mutant": true},
				{"dna": "ATGCGACAGTGCTTATGTAGAAGGCCCCTATCAC29", "mutant": false}
			]);
			expect(await db.stats()).to.deep.equal({ count_mutant_dna: 25, count_human_dna: 5, ratio: 0.2 });
			await db.disconnect();
		});
	});
});
