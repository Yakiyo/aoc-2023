const isNum = (char: string): boolean => char >= '0' && char <= '9';

const input = (await Deno.readTextFile('./inputs/1.txt'))
	.split(
		'\n',
	);

const result = input
	.map((s) => {
		const c = s.split('');
		return Number(`${c.find(isNum)}${c.findLast(isNum)}`);
	})
	.reduce((acc, curr) => acc + curr, 0);

console.log(result);
