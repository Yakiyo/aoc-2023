import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

/*
 * 1: 0
 * 2: 0
 */

type Direction = 'up' | 'right' | 'left' | 'down';

/**
 * Find the starting point 'S'
 * returns [row, column] or [y, x]
 */
function resolveStart(input: string[][]): [number, number] {
	const r = input.findIndex((i) => i.includes('S'));
	const c = input.at(r)?.findIndex((i) => i === 'S')!;
	if (r < 0 || c < 0) {
		throw new Error('Cannot find starting position');
	}
	return [r, c];
}

function getBranches(grid: string[][], [y, x]: [number, number]) {
	const sides = {
		up: [y - 1, x],
		down: [y + 1, x],
		left: [y, x - 1],
		right: [y, x + 1],
	};
	const getVal = ([y, x]: [number, number]) => grid.at(y)?.at(x);
	const branches: [number, number][] = [];
	for (
		const [k, v] of Object.entries(sides) as [
			Direction,
			[number, number],
		][]
	) {
		if (v.some((i) => i < 0)) {
			// skip elements whose co-ordinates are less than zero
			continue;
		}
		// const [sy, sx] = v;
		const val = getVal(v);
		if (!val) {
			// skip elements whose co-ordinates exceed max row/column
			// for them, `val` does not exist
			continue;
		}
		switch (k as Direction) {
			case 'up': {
				if (['S', '|', 'F', '7'].includes(val)) branches.push(v);
				break;
			}
			case 'right': {
				if (['S', '-', '7', 'J'].includes(val)) branches.push(v);
				break;
			}
			case 'left': {
				if (['S', '-', 'F', 'L'].includes(val)) branches.push(v);
				break;
			}
			case 'down': {
				if (['S', '|', 'L', 'J'].includes(val)) branches.push(v);
				break;
			}
		}
	}
	return branches;
}

export function partOne(input: string) {
	const grid = input.split('\n').map((i) => i.split(''));
	const [y, x] = resolveStart(grid);
	const branches = getBranches(grid, [y, x]);
	if (branches.length !== 2) {
		throw new Error('There should be at least two starting branches');
	}
	const getVal = ([y, x]: [number, number]) => grid.at(y)?.at(x);

	let prev = [y, x];
	let current = branches[0];
	let ch = getVal(current);
	// one step is for the starting point, the other is for the starting branch
	let steps = 2;
	while (ch !== 'S') {
		// get the two branches from the current tile, one of which
		// should be `prev`, and then just use the other one
		const next = getBranches(grid, current).filter(([cy, cx]) =>
			!(cy === prev[0] && cx === prev[1])
		);
		console.log(ch, prev, current, next);

		prev = current;
		current = next[0];
		steps++;
		ch = getVal(current);
	}
	// we decrement once since the initial `S` gets counted twice
	steps--;
	return steps / 2;
}

const teststr = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

Deno.test('Part One test', () => {
	assertEquals(
		partOne(teststr),
		8,
	);
});
