import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';

function parseNode(input: string): [string, [string, string]] {
	const [key, l, r] = input.replaceAll(/\(|\)|,|=/g, '').split(/ +/)
		.map((s) => s.trim());
	return [key, [l, r]];
}

export function partOne(input: string) {
	const [direction_input, node_input] = input.split('\n\n');

	const nodes = new Map(node_input.split('\n').map(parseNode));

	const directions = direction_input
		.replaceAll('L', '0')
		.replaceAll('R', '1')
		.split('')
		.map(Number);

	let current = nodes.get('AAA')![directions[0]];
	// steps begin from one cz we already did it once in the above line
	let steps = 1;
	let i = 1;
	while (current !== 'ZZZ') {
		if (i >= directions.length) {
			i = 0;
		}
		current = nodes.get(current)![directions[i]];
		steps++;
		i++;
	}
	return steps;
}

export function partTwo(input: string) {
	const [direction_input, node_input] = input.split('\n\n');

	const nodes = new Map(node_input.split('\n').map(parseNode));

	const directions = direction_input
		.replaceAll('L', '0')
		.replaceAll('R', '1')
		.split('')
		.map(Number);

	// closure for following directions from a node based on a direction
	const step = (key: string, direction: number) =>
		nodes.get(key)![directions[direction]];

	// start with the values that have keys that ends with 'A'
	// and step into their first element according to direction
	let currents = Array.from(nodes.entries())
		.filter((i) => i[0].endsWith('A'))
		.map((i) => step(i[0], 0));
	let steps = 1;
	let i = 1;

	// we continue as long as some entry does not end with Z
	while (currents.some((v) => !v.endsWith('Z'))) {
		if (i >= directions.length) {
			i = 0;
		}
		currents = currents.map((v) => step(v, i));
		steps++;
		i++;
	}
	return steps;
}

Deno.test('parse node test', () => {
	assertEquals(parseNode('AAA = (BBB, CCC)'), ['AAA', [
		'BBB',
		'CCC',
	]]);
});

Deno.test('demo input test part 1', () => {
	assertEquals(
		partOne(`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`),
		6,
	);

	assertEquals(
		partOne(`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`),
		2,
	);
});

Deno.test('demo input test part 2', () => {
	assertEquals(
		partTwo(`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`),
		6,
	);
});
