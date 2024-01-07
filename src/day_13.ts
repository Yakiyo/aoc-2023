/*
 * 1: 0
 * 2: 0
 */

import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { arrayEq, transpose } from '../util.ts';

export function partOne(input: string) {
	return input
		.split('\n\n') // split patterns
		.map((pattern) =>
			// split each pattern into grids
			pattern.split('\n').map((line) => line.split(''))
		)
		.map(calcPattern)
		.map(({ col, row }) => col + row * 100)
		.reduce((acc, curr) => acc + curr, 0);
}

function calcPattern(pattern: string[][]) {
	const rows = pattern;
	const cols = transpose(pattern);
	const row = findReflection(rows);
	const col = findReflection(cols);
	return {
		row,
		col,
	};
}

function findReflection(grid: string[][]) {
	for (let i = 0; i < grid.length; i++) {
		const up = grid.slice(0, i + 1).reverse();
		const bottom = grid.slice(i + 1);
		const len = Math.min(up.length, bottom.length);
		// skip iteration when checking reflection for the last element
		if (!len) continue;
		if (arrayEq(up.slice(0, len), bottom.slice(0, len))) {
			return i + 1;
		}
	}
	return 0;
}

Deno.test('calc pattern test', () => {
	const pattern1 = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.`.split('\n').map((x) => x.split(''));

	const pattern2 = `#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`.split('\n').map((x) => x.split(''));

	assertEquals(calcPattern(pattern1), { col: 5, row: 0 });
	assertEquals(calcPattern(pattern2), { col: 0, row: 4 });
});

Deno.test('Part one test', () => {
	const teststr = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

	assertEquals(partOne(teststr), 405);
});
