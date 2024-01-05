/**
 * 1: 10885634
 * 2: 707505470642
 */

import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

export function partOne(input: string) {
	return solve(input, 1);
}

export function partTwo(input: string) {
	return solve(input, 999999);
}

function solve(input: string, expansion: number): number {
	const grid = input.split('\n').map((i) => i.split(''));
	const { rows, cols } = emptyLines(grid);
	const galaxies = findGalaxies(grid, { rows, cols }, expansion);
	const distances: number[] = [];
	for (let i = 0; i < galaxies.length; i++) {
		for (let j = i + 1; j < galaxies.length; j++) {
			const { x: x1, y: y1 } = galaxies[i];
			const { x: x2, y: y2 } = galaxies[j];
			distances.push(Math.abs(x1 - x2) + Math.abs(y1 - y2));
		}
	}

	return distances.reduce((acc, curr) => acc + curr, 0);
}

function emptyLines(grid: string[][]): {
	rows: number[];
	cols: number[];
} {
	const rows = [];
	for (let i = 0; i < grid.length; i++) {
		if (!grid[i].includes('#')) rows.push(i);
	}
	const cols = [];
	for (let i = 0; i < grid[0].length; i++) {
		if (!grid.map((x) => x[i]).includes('#')) cols.push(i);
	}
	return { rows, cols };
}

function findGalaxies(
	grid: string[][],
	{ rows, cols }: { rows: number[]; cols: number[] },
	expansion: number,
): { x: number; y: number }[] {
	const galaxies: { x: number; y: number }[] = [];
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid.at(y)?.length!; x++) {
			if (grid[y][x] === '#') {
				const h = x +
					cols.filter((i) => i < x).length * expansion;
				const v = y +
					rows.filter((i) => i < y).length * expansion;
				galaxies.push({ x: h, y: v });
			}
		}
	}
	return galaxies;
}

Deno.test('Part one test', () => {
	const teststr = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

	assertEquals(partOne(teststr), 374);
});
