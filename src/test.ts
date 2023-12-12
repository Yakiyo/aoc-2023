import {
	assert,
	assertEquals,
} from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { parseNumbers } from './day_1.ts';
import { isValidGame, parseGame, parseRecord } from './day_2.ts';
import {
	getSurroundings,
	parseNumbers as parseSchematicNumbers,
} from './day_3.ts';
import { parseCard } from './day_4.ts';

Deno.test('Day 1: parse test', () => {
	assertEquals(parseNumbers('vzxf4tqrljgxmthreejcr'), ['4', '3']);
});

Deno.test('Day 2: parse record test', () => {
	assertEquals(parseRecord('1 green, 3 red, 6 blue'), {
		red: 3,
		green: 1,
		blue: 6,
	});
	assertEquals(parseRecord('3 green, 6 red'), {
		red: 6,
		green: 3,
		blue: 0,
	});
	assertEquals(parseRecord('1 red'), {
		red: 1,
		green: 0,
		blue: 0,
	});
});

Deno.test('Day 2: parse game test', () => {
	assertEquals(
		parseGame(
			'Game 7: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
		),
		{
			id: 7,
			records: [
				{ red: 4, blue: 3, green: 0 },
				{ red: 1, blue: 6, green: 2 },
				{ red: 0, blue: 0, green: 2 },
			],
		},
	);
});

Deno.test('Day 2: is valid game test', () => {
	assert(isValidGame({
		id: 7,
		records: [
			{ red: 4, blue: 3, green: 0 },
			{ red: 1, blue: 6, green: 2 },
			{ red: 0, blue: 0, green: 2 },
		],
	}));

	assert(
		!isValidGame({
			id: 7,
			records: [
				{ red: 14, blue: 3, green: 0 },
				{ red: 1, blue: 6, green: 2 },
				{ red: 0, blue: 0, green: 2 },
			],
		}),
	);
});

Deno.test('Day 3: parse numbers test', () => {
	assertEquals(parseSchematicNumbers('467..114..', 1), [
		{ value: '467', position: [0, 1] },
		{ value: '114', position: [5, 1] },
	]);
});

Deno.test('Day 3: get surroundings test', () => {
	assertEquals(getSurroundings({ value: '114', position: [0, 0] }), [
		[3, 0],
		[3, 1],
		[0, 1],
		[1, 1],
		[2, 1],
	]);
});

Deno.test('Day 3: parse card test', () => {
	const str = 'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53';
	assertEquals<[number[], number[]]>(parseCard(str), [
		[41, 48, 83, 86, 17],
		[
			83,
			86,
			6,
			31,
			17,
			9,
			48,
			53,
		],
	]);
});
