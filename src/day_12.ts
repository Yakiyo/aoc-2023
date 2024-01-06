/*
 * 1: 7047
 * 2: 17391848518844
 */

import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

type OnsenData = [string, number[]];

export function partOne(input: string) {
	return input
		.split('\n')
		.map((line) => {
			const [pattern, nums] = line.split(' ');
			return [pattern, nums.split(',').map(Number)] as OnsenData;
		})
		.map(getArrangements)
		.reduce((acc, curr) => acc + curr, 0);
}

export function partTwo(input: string) {
	return input
		.split('\n')
		.map((line) => {
			const [pattern, nums] = line.split(' ');
			return [
				Array(5).fill(pattern).join('?'),
				Array(5).fill(nums).join(',').split(',').map(Number),
			] as OnsenData;
		})
		.map(getArrangements)
		.reduce((acc, curr) => acc + curr, 0);
}

// a cache to remember values of certain entries, so that
// we don't recalculate the value when the entry is encountered
// more than once. This makes part 2 significantly faster.
const cache: Map<string, number> = new Map();

function getArrangements([cfg, nums]: OnsenData): number {
	if (cfg === '') {
		return nums.length ? 0 : 1;
	}
	if (nums.length === 0) {
		return cfg.includes('#') ? 0 : 1;
	}

	const key = `${cfg} ${nums.join(',')}`;
	if (cache.has(key)) {
		return cache.get(key)!;
	}

	let result = 0;

	if (['?', '.'].includes(cfg[0])) {
		result += getArrangements([cfg.slice(1), nums]);
	}

	if (['?', '#'].includes(cfg[0])) {
		if (
			nums[0] <= cfg.length &&
			!cfg.slice(0, nums[0]).includes('.') &&
			(
				nums[0] === cfg.length ||
				cfg[nums[0]] !== '#'
			)
		) {
			result += getArrangements([
				cfg.slice(nums[0] + 1, cfg.length),
				nums.slice(1, nums.length),
			]);
		}
	}
	cache.set(key, result);
	return result;
}

Deno.test('Part one test', () => {
	assertEquals(
		partOne(`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`),
		21,
	);
});

Deno.test('Part two test', () => {
	assertEquals(
		partTwo(`???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`),
		525152,
	);
});
