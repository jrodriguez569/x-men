import { MongoClient } from 'mongodb';

class DB {
	async init(uri) {
		this.client = await MongoClient.connect(uri || process.env.MONGO_URL, { useNewUrlParser: true, poolSize: 100 });
		this.db = await this.client.db();
		this.collection = await this.db.collection('dna');
		try {
			await this.collection.createIndex({"dna": 1}, {unique: true});
		} catch (e) {

		}
	}

	get(dna) {
		return this.collection.findOne({ dna });
	}

	async save(dna) {
		const session = await this.client.startSession();
		session.startTransaction();
		try {
			await this.collection.insert(dna);
			await session.commitTransaction();
			session.endSession();
		} catch (error) {
			await session.abortTransaction();
			session.endSession();
	  		throw error;
		}
	}

	clean() {
		return this.collection.remove({});
	}

	disconnect() {
		return this.client.close();
	}

	async stats() {
		return (await (await this.collection.aggregate([
			{
				$group: {
					_id: null,
					mutants: {$sum: { $cond: [ "$mutant", 1, 0 ] } },
					humans: { $sum: { $cond: [ "$mutant", 0, 1 ] } }
				}
			},
			{
				$project: {
					_id: 0,
					count_mutant_dna: "$mutants",
					count_human_dna: "$humans",
					ratio: { $cond: [ { $or: [ { $eq: [ "$mutants", 0 ] }, { $eq: [ "$humans", 0 ] }] }, 0, { $divide: [ "$humans", "$mutants" ] } ]}
				}
			}
		])).toArray())[0] || { count_mutant_dna: 0, count_human_dna: 0, ratio: 0 };
	}
};

export default async (uri) => {
	const db = new DB();
	await db.init(uri);
	return db;
};
