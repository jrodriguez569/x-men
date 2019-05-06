import { expect } from 'chai'
import { describe } from 'mocha';
import Mutant from '../src/mutant';

describe("Mutant class tests", () => {
	describe("isMutant method", () => {
		it("should be true", () => {
			const mutant = new Mutant();
			expect(mutant.isMutant([
				'ATGCGA',
				'CAGTGC',
				'TTATGT',
				'AGAAGG',
				'CCCCTA',
				'TCACTG'
			])).to.be.true;
		});

		it("should be false", () => {
			const mutant = new Mutant();
			expect(mutant.isMutant([
				'ATGCGA',
				'CAGTGC',
				'TTCTGT',
				'AGAACA',
				'CCTCTA',
				'TCACTG'
			])).to.be.false;

			expect(mutant.isMutant([
				'ATGCGA',
				'CAGTGC'
			])).to.be.false;

			expect(mutant.isMutant([
				'ATGCGA',
				'CAGTGC',
				'TTCTGT',
				'AGAATG',
				'CCACTA',
				'TCACTG'
			])).to.be.false;

			expect(mutant.isMutant([])).to.be.false;

			expect(mutant.isMutant(undefined)).to.be.false;
		});
	});

	describe("getInverted method", () => {
		it("should be equals", () => {
			const mutant = new Mutant();
			let original = [
				'012',
				'345',
				'678'
			];
			let inverted = [
				['6', '3', '0'],
				['7', '4', '1'],
				['8', '5', '2']
			];
			expect(mutant.getInverted(original)).to.deep.equal(inverted);

			original = [
				'12345',
				'67890',
				'12345',
				'67890',
				'12345'
			];
			inverted = [
				['1', '6', '1', '6', '1'],
				['2', '7', '2', '7', '2'],
				['3', '8', '3', '8', '3'],
				['4', '9', '4', '9', '4'],
				['5', '0', '5', '0', '5'],
			];
			expect(mutant.getInverted(original)).to.deep.equal(inverted);
		});
	});

	describe("getDiagonal method", () => {
		it("should be equals", () => {
			const mutant = new Mutant();
			let original = [
				['0', '1', '2'],
				['3', '4', '5'],
				['6', '7', '8']
			];
			expect(() => mutant.getDiagonal(original)).to.throw(RangeError);

			original = [
				['0', '1', '2', '3'],
				['4', '5', '6', '7'],
				['8', '9', '0', '1'],
				['2', '3', '4', '5'],
			];
			let diagonal = ['0505']
			expect(mutant.getDiagonal(original)).to.deep.equal(diagonal);
		});
	});
});
