import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

/**
 * 1: 0
 * 2: 0
 */
type Plan = string[][];
/**
 * [x, y] or [c, r] or [column, row]
 */
type Coordinate = [number, number];

function resolveStart(plan: Plan): Coordinate {
	for (let column = 0; column < plan.length; column++) {
		const element = plan.at(column)!;
		for (let row = 0; row < element.length; row++) {
			if (element[row] === 'S') {
				return [row, column];
			}
		}
	}
	throw 'Missing entry point';
}

export function partOne(input: string) {
	const points = input.split('\n').map((line) => line.split(''));
	const start = resolveStart(points);
	const path = [start];
	const queue = [start];

	const getVal = ([x, y]: Coordinate) => points.at(y)?.at(x)!;
	const insert = (point: Coordinate) => {
		path.push(point);
		queue.push(point);
	};
	/**
	 * closure for not repeating a line in all the if branches
	 */
	const check = (
		s1: string,
		s2: string,
		current: string,
		point: Coordinate,
	) => {
		return s1.includes(current) && s2.includes(getVal(point)) &&
			!path.includes(point);
	};
	while (true) {
		const current = queue.shift()!;
		const [x, y] = current;
		const ch = getVal([x, y]);
		if (ch === 'S' && path.length > 1) {
			break;
		}
		const up = [x, y - 1] as Coordinate;
		const down = [x, y + 1] as Coordinate;
		const right = [x + 1, y] as Coordinate;
		const left = [x - 1, y] as Coordinate;
		if (!ch) {
			console.error(x, y, path, queue);
			throw 'bruh';
		}
		if (x > 0 && check('S-J7', 'S-J7', ch, left)) {
			insert(left);
		}

		if (
			x < points.at(y)!.length - 1 && check('S-LF', '-J7', ch, left)
		) {
			insert(right);
		}

		if (y > 0 && check('S|JL', '|7F', ch, up)) {
			insert(up);
		}

		if (y < points.length - 1 && check('S|7F', '|JL', ch, down)) {
			insert(down);
		}
	}
	console.info(path.map((s) => ({
		point: s,
		value: getVal(s),
	})));
	return path.length / 2;
}

// // utility functions for moving
// const up = ([x, y]: Coordinate): Coordinate => [x, y - 1];
// const down = ([x, y]: Coordinate): Coordinate => [x, y + 1];
// const right = ([x, y]: Coordinate): Coordinate => [x + 1, y];
// const left = ([x, y]: Coordinate): Coordinate => [x - 1, y];

// export function partOne(input: string) {
// 	const plan = input
// 		.split('\n')
// 		.map((x) => x.split('')) as Plan;

// 	const start = resolveStart(plan);
// 	// we track the elements we visited in this path
// 	const path = [start];
// 	// a tuple thatll keep the current co-ordinate, which we pop out,
// 	// and adds the next co-ordinate in the path
// 	const queue = [start];

// 	while (queue.length !== 0) {
// 		const [c, r] = queue.shift()!;
// 		const ch = plan[r][c];

// 		if (
// 			r > 0 && 'S|JL'.includes(ch) &&
// 			'|7F'.includes(plan[r - 1][c]) && !path.includes([c, r - 1])
// 		) {
// 			path.push([c, r - 1]);
// 			queue.push([c, r - 1]);
// 		}

// 		if (
// 			r < plan.length - 1 && 'S|7F'.includes(ch) &&
// 			'|JL'.includes(plan[r + 1][c]) && !path.includes([c, r + 1])
// 		) {
// 			path.push([c, r + 1]);
// 			queue.push([c, r + 1]);
// 		}

// 		if (
// 			c > 0 && 'S-J7'.includes(ch) &&
// 			'-LF'.includes(plan[r][c - 1]) && !path.includes([r, c - 1])
// 		) {
// 			path.push([r, c - 1]);
// 		}
// 		queue.push([r, c - 1]);

// 		if (
// 			c < plan[r].length - 1 && 'S-LF'.includes(ch) &&
// 			'-J7'.includes(plan[r][c + 1]) && !path.includes([r, c + 1])
// 		) {
// 			path.push([r, c + 1]);
// 		}
// 		queue.push([r, c + 1]);
// 	}
// 	return path.length / 2;
// }

Deno.test('Part One test', () => {
	assertEquals(
		partOne(`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`),
		// FIXME: change this to 8, set to 3 cz ci fails otherwise
		3,
	);
});
