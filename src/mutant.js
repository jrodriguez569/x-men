class Mutant {

	getInverted(dna) { 
		return dna
			.map(row => row.split(''))
			.reduce((prev, next) => next.map((_, i) => [next[i], ...prev[i]]), Array(dna.length).fill([]));
	}

	getDiagonal(dna) {
		const range = Array(dna.length - Mutant.REQUIRED_LENGTH).map((_, i) => 1 + i);
		return	[
			dna[0].map((_, i) => dna[i][i]),
			...dna
			.reduce((prev, row, index, matrix) => [
					range.map(i => [...prev[1][i - 1], row[i + index]]),
					range.map(i => [...prev[2][i - 1], (matrix[i + index] || [])[index]])
				],
				[
					Array(range.length).fill([]),
					Array(range.length).fill([])
				]
			)
			.map(rows => [...rows])
		]
		.map(row => row.join(''))
		.filter(row => row.length > 0);
	}

	check(dna) {
		return dna.some(s => Mutant.REGEXP.test(s));
	}

	isMutant(dna) {
		let inverted;
		return (
			Array.isArray(dna) &&
			dna.length >= Mutant.REQUIRED_LENGTH && 
			!dna.some(row => typeof row !== 'string'|| row.length != dna.length)
		) && (
			this.check(dna) || 
			this.check((inverted = this.getInverted(dna)).map(row => row.join(''))) ||
			this.check(this.getDiagonal(inverted)) ||
			this.check(dna.map(row => row.split('')))
		);
	}
};

Mutant.REQUIRED_LENGTH = 4;
Mutant.REGEXP = new RegExp('ACTG'.split('').map(s => `${s}{${Mutant.REQUIRED_LENGTH}}`).join('|'));

export default Mutant;
