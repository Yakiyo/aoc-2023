/**
 * 1: 1901217887
 * 2:
 */

import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

function createPyramid(values: number[]): number[][] {
	const pyramid = [values];
	while (true) {
		const diff = createDiff(pyramid.at(-1)!);
		pyramid.push(diff);
		if (!diff.some((i) => i !== 0)) break;
	}
	return pyramid;
}

function createDiff(values: number[]): number[] {
	const diffs = [];
	for (let i = 1; i < values.length; i++) {
		diffs.push(values.at(i)! - values.at(i - 1)!);
	}
	return diffs;
}

function extrapolate(input: number[][]): number {
	const pyramid = input.toReversed();
	for (let i = 1; i < pyramid.length; i++) {
		const curr = pyramid[i];
		const prev = pyramid[i - 1];
		curr.push(curr.at(-1)! + prev.at(-1)!);
	}
	return pyramid.at(-1)!.at(-1)!;
}

function extrapolateReverse(input: number[][]): number {
	const pyramid = input.toReversed();
	for (let i = 1; i < pyramid.length; i++) {
		const curr = pyramid[i];
		const prev = pyramid[i - 1];
		// the only diff with `extrapolate` and this is
		// we use unshift, and subtract instead of add
		curr.unshift(curr.at(0)! - prev.at(0)!);
	}
	// and we return the first element of the last array
	return pyramid.at(-1)!.at(0)!;
}

export function partOne(input: string) {
	return input
		.split('\n')
		.map((s) => s.split(/ +/).map(Number))
		.map(createPyramid)
		.map(extrapolate)
		.reduce((acc, curr) => acc + curr, 0);
}

export function partTwo(input: string) {
	return input
		.split('\n')
		.map((s) => s.split(/ +/).map(Number))
		.map(createPyramid)
		.map(extrapolateReverse)
		.reduce((acc, curr) => acc + curr, 0);
}

Deno.test('create pyramid test', () => {
	assertEquals(
		createPyramid('0 3 6 9 12 15'.split(/ +/).map(Number)),
		[
			[0, 3, 6, 9, 12, 15],
			[3, 3, 3, 3, 3],
			[0, 0, 0, 0],
		],
	);
});

Deno.test('extrapolate test', () => {
	assertEquals(
		extrapolate([
			[0, 3, 6, 9, 12, 15],
			[3, 3, 3, 3, 3],
			[0, 0, 0, 0],
		]),
		18,
	);
});

Deno.test('demo input test', () => {
	assertEquals(
		partOne(`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`),
		114,
	);
	assertEquals(
		partTwo(`0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`),
		2,
	);
});
