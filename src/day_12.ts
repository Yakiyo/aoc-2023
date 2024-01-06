/*
 * 1: 7047
 * 2: 0
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

function getArrangements([cfg, nums]: OnsenData): number {
	if (cfg === '') {
		return nums.length ? 0 : 1;
	}
	if (nums.length === 0) {
		return cfg.includes('#') ? 0 : 1;
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

	return result;
}

export function partTwo(_input: string) {
	return 0;
}

Deno.test('Part one test', () => {
	const teststr = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;
	assertEquals(partOne(teststr), 21);
});
