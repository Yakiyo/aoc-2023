import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

const ranks = [
	'J',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'T',
	'Q',
	'K',
	'A',
] as const;

const handRanks = [
	'High',
	'One',
	'Two',
	'Three',
	'Full',
	'Four',
	'Five',
] as const;

class Hand {
	private cards: number[] = [];
	private rank: typeof handRanks[number];
	public bid: number;

	constructor(input: string) {
		const [cards, bid] = input.split(' ');
		this.bid = parseInt(bid, 10);

		const vals = {} as Record<string, number>;

		cards.split('').forEach((c) => {
			vals[c] = (vals[c] ?? 0) + 1;
			this.cards.push(ranks.indexOf(c as typeof ranks[number]));
		});

		const jokers = vals['J'] ?? 0;
		delete vals['J'];

		Object.keys(vals)
			.forEach((k) => vals[k] += jokers);

		const len = Object.keys(vals).length;
		const values = Object.values(vals);

		if (len === 1 || jokers === 5) this.rank = 'Five';
		else if (len === 2) {
			if (values.includes(4)) this.rank = 'Four';
			else this.rank = 'Full';
		} else if (len === 3) {
			if (values.includes(3)) this.rank = 'Three';
			else this.rank = 'Two';
		} else if (len === 4) {
			if (values.includes(3)) this.rank = 'Three';
			else this.rank = 'One';
		} else if (values.includes(2)) this.rank = 'One';
		else this.rank = 'High';
	}

	public static parse(input: string) {
		return new Hand(input);
	}

	public comp(rh: Hand): number {
		if (this.rank !== rh.rank) {
			return handRanks.indexOf(this.rank) -
				handRanks.indexOf(rh.rank);
		}
		for (let i = 0; i < this.cards.length; i++) {
			if (this.cards[i] !== rh.cards[i]) {
				return this.cards[i] > rh.cards[i] ? 1 : -1;
			}
		}
		return 0;
	}
}

export function partTwo(input: string) {
	return input
		.split('\n')
		.map(Hand.parse)
		.sort((a, b) => a.comp(b))
		.map((hand, i) => hand.bid * (i + 1))
		.reduce((acc, curr) => acc + curr, 0);
}

Deno.test('demo test part two', () => {
	assertEquals(
		partTwo(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`),
		5905,
	);
});
