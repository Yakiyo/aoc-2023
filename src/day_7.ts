/**
 * 1: 250370104
 */

import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

const ranks = [
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'T',
	'J',
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

		switch (Object.keys(vals).length) {
			case 5:
				this.rank = 'High';
				break;
			case 4:
				this.rank = 'One';
				break;
			case 1:
				this.rank = 'Five';
				break;
			case 3: {
				this.rank = Object.values(vals).includes(3) ? 'Three' : 'Two';
				break;
			}
			case 2: {
				this.rank = Object.values(vals).includes(4) ? 'Four' : 'Full';
				break;
			}
			default:
				console.error('vals', vals);
				throw new Error(
					`WTF did i get. input: ${input}`,
				);
		}
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

export function partOne(input: string) {
	return input
		.split('\n')
		.map(Hand.parse)
		.sort((a, b) => a.comp(b))
		.map((hand, i) => hand.bid * (i + 1))
		.reduce((acc, curr) => acc + curr, 0);
}

Deno.test('demo test part one', () => {
	assertEquals(
		partOne(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`),
		6440,
	);
});
