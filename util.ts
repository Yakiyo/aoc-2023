import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

export function readInput(day: number): Promise<string> {
	return Deno.readTextFile(`./inputs/${day}.txt`);
}

export const isNum = (char: string): boolean =>
	char >= '0' && char <= '9';

export type Awaitable<T> = T | Promise<T>;

export type Solution = (input: string) => Awaitable<number>;

export function debug<T>(value: T, extra?: unknown): T {
	console.log(extra ? extra : '', value);
	return value;
}

/**
 * Equivalent to transposing a square matrix
 */
export function transpose<T>(array: T[][]): T[][] {
	return array[0].map((_, i) => array.map((x) => x[i]));
}

/**
 * Check if array a and b are the same or not
 * 
 * We use the assertEquals func from the testing module in std.
 * If it throws, they are not the same, if it doesnt, then they are.
 */
export function arrayEq<T>(a: T[], b: T[]): boolean {
	try {
		assertEquals(a, b);
		return true;
	} catch (_) {
		return false;
	}
}

Deno.test('transpose test', () => {
	const array = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 10],
	];
	const expected = [
		[1, 4, 7],
		[2, 5, 8],
		[3, 6, 10],
	];
	assertEquals(transpose(array), expected);
});
