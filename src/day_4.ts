import { readInput } from '../util.ts';

const input = (await readInput(4)).split('\n');

function partOne(input: string[]) {
	return input
		.map(parseCard) // map to cards
		.map(([w, g]) => g.filter((i) => w.includes(i)).length) // filter only winning entries and get length
		.filter((n) => n !== 0) // filter out zero values
		.map((n) => Math.pow(2, n - 1)) // convert to points
		.reduce((acc, curr) => acc + curr, 0); // add em
}

export function parseCard(line: string): [number[], number[]] {
	const [_card, _colon, wins, _bar, gains] = line.split(/(:|\|)/).map(
		(x) => x.trim(),
	);
	return [
		wins.split(/ +/).map(Number),
		gains.split(/ +/).map(Number),
	];
}

console.log(`Part 1: ${partOne(input)}`); // 24706
