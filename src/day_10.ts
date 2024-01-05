import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

/*
 * 1: 6897
 * 2: 367
 */

export function partOne(input: string) {
	const grid = input.split('\n').map((i) => i.split(''));
	const { steps } = loop(grid);
	return steps / 2;
}

/**
 * This solution uses Pick's theorem and was heavily inspired from tlareg's solution
 *
 * https://en.wikipedia.org/wiki/Pick%27s_theorem
 * https://github.com/tlareg/advent-of-code/blob/master/src/2023/day10/index.ts#L215
 */
export function partTwo(input: string) {
	const grid = input.split('\n').map((i) => i.split(''));
	const { steps, path } = loop(grid);
	const area = shoelace(path);
	return area - steps / 2 + 1;
}

type Direction = 'up' | 'right' | 'left' | 'down';

/**
 * The main shared logic between the two challenges
 *
 * It calculates the steps in the loop and also tracks all the
 * tiles it encounters in the loop
 */
function loop(grid: string[][]) {
	const [y, x] = resolveStart(grid);
	const branches = getBranches(grid, [y, x]);
	if (branches.length !== 2) {
		throw new Error('There should be at least two starting branches');
	}
	const getVal = ([y, x]: [number, number]) => grid.at(y)?.at(x);

	let prev: [number, number] = [y, x];
	let current = branches[0];
	let ch = getVal(current);
	const path: [number, number][] = [prev];
	// one step is for the starting point, the other is for the starting branch
	let steps = 2;
	while (ch !== 'S') {
		// get the two branches from the current tile, one of which
		// should be `prev`, and then just use the other one
		const nexts = getBranches(grid, current).filter(([cy, cx]) =>
			!(cy === prev[0] && cx === prev[1])
		);

		let next;
		if (nexts.length === 1) {
			next = nexts[0];
		} else {
			next = validBranches(current, grid, nexts);
		}
		path.push(current);

		prev = current;
		current = next;
		steps++;
		ch = getVal(current);
	}
	// we decrement once since the initial `S` gets counted twice
	steps--;

	return {
		steps,
		path,
	};
}
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

/**
 * when a tile has multiple branches (based on `getBranches`), we
 * find the branch that is valid based on the direction the current
 * symbol can point at
 */
function validBranches<T extends [number, number]>(
	point: T,
	grid: string[][],
	branches: T[],
): T {
	const { up, down, right, left } = move;
	const ch = grid.at(point[0])?.at(point[1])!;
	const possibles: [number, number][] = [];
	switch (ch) {
		case '|':
			possibles.push(up(point), down(point));
			break;
		case '-':
			possibles.push(right(point), left(point));
			break;
		case 'L':
			possibles.push(up(point), right(point));
			break;
		case 'J':
			possibles.push(up(point), left(point));
			break;
		case '7':
			possibles.push(down(point), left(point));
			break;
		case 'F':
			possibles.push(right(point), down(point));
			break;
		default:
			throw new Error(
				`Unexpected character in path found. Got ${ch}`,
			);
	}
	if (possibles.length !== 2) {
		throw new Error(
			'Should have definitely gotten two elements here',
		);
	}
	const valids = branches.filter((branch) =>
		possibles.findIndex((possible) => pointEq(branch, possible)) > -1
	);
	if (valids.length !== 1) {
		throw new Error(
			`Still got more than one valid branch.\nPoint: ${point},\nbranches: ${
				branches.map((x) => `${x}`).join(', ')
			},\nvalids: ${valids.map((x) => `${x}`).join(', ')}`,
		);
	}
	return valids.shift()!;
}

/**
 * Based on https://en.wikipedia.org/wiki/Shoelace_formula
 */
function shoelace(vertices: [number, number][]): number {
	let area = 0;

	for (let i = 0; i < vertices.length; i++) {
		const nextIndex = (i + 1) % vertices.length;
		const [currentY, currentX] = vertices[i];
		const [nextY, nextX] = vertices[nextIndex];
		area += currentX * nextY - currentY * nextX;
	}

	area = Math.abs(area) / 2;

	return area;
}

const pointEq = <T extends [number, number]>(a: T, b: T) =>
	a[0] === b[0] && a[1] === b[1];

const move: Record<
	Direction,
	(point: [number, number]) => [number, number]
> = {
	up: ([y, x]) => [y - 1, x],
	right: ([y, x]) => [y, x + 1],
	left: ([y, x]) => [y, x - 1],
	down: ([y, x]) => [y + 1, x],
};

Deno.test('Part one test', () => {
	const teststr = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;
	assertEquals(
		partOne(teststr),
		8,
	);
});

Deno.test('Part two test', () => {
	const teststr = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJIF7FJ-
L---JF-JLJIIIIFJLJJ7
|F|F-JF---7IIIL7L|7|
|FFJF7L7F-JF7IIL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;
	assertEquals(partTwo(teststr), 10);
});
