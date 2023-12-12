import { readInput } from '../util.ts';

const input = (await readInput(4)).split('\n');

export function parseCard(
	line: string,
): [number[], number[], number] {
	const [card, _colon, wins, _bar, gains] = line.split(/(:|\|)/).map(
		(x) => x.trim(),
	);
	return [
		wins.split(/ +/).map(Number),
		gains.split(/ +/).map(Number),
		Number(card.replace('Card ', '')),
	];
}

function calcScore([wins, gains]: [number[], number[], number]) {
	return gains.filter((i) => wins.includes(i)).length;
}

function partOne(input: string[]) {
	return input
		.map(parseCard) // map to cards
		.map(calcScore) // filter only winning entries and get length
		.filter((n) => n !== 0) // filter out zero values
		.map((n) => Math.pow(2, n - 1)) // convert to points
		.reduce((acc, curr) => acc + curr, 0); // add em
}

function partTwo(input: string[]) {
	const cards = input.map(parseCard);
	const copies: number[] = Array(cards.length).fill(0);

	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];
		const amount = 1 + copies[i];
		const score = calcScore(card);
		for (let j = 1; j <= score; j++) {
			const id = i + j;
			copies[id] = (copies[id] ?? 0) + amount;
		}
	}

	return copies.reduce((acc, curr) => acc + curr + 1, 0);
}

console.log(`Part 1: ${partOne(input)}`); // 24706
console.log(`Part 2: ${partTwo(input)}`); // 13114317

/**
 * This was a failed attempt. While it worked for the demo input, it didn't work for the actual one
 */
// function partTwo(input: string[]) {
// 	const cards = input.map(parseCard);
// 	const calcScore = (wins: number[], gains: number[]) =>
// 		gains.filter((i) => wins.includes(i)).length;
// 	// a record of ids and their copies
// 	// copies do not include the count for the original count
// 	// need to increment it by one in the end
// 	const stats: Record<number, number> = {};
// 	for (const card of cards) {
// 		const id = card[2];
// 		// if it isnt already in stats, make an entry
// 		if (!(id in stats)) {
// 			stats[id] = 1;
// 		} else {
// 			stats[id]++;
// 		}
// 		const score = calcScore(card[0], card[1]);
// 		if (score === 0) break;
// 		let i;
// 		for (i = 1; i <= score; i++) {
// 			if (!((id + i) in stats)) {
// 				stats[id + i] = 0;
// 			}
// 			stats[id + i] = stats[id + i] + stats[id];
// 		}
// 	}
// 	const sum = Object.values(stats).reduce((acc, curr) => acc + curr, 0);
// 	return sum + (input.length - Object.values(stats).length);
// }
