import { readInput, type Solution } from './util.ts';

function exists(p: string): boolean {
	try {
		Deno.statSync(p);
		return true;
	} catch (_) {
		return false;
	}
}

if (Deno.args.length < 1) {
	console.error(
		'Please pass day number as argument',
	);
	Deno.exit(1);
}

const [day] = Deno.args;

if (isNaN(Number(day))) {
	console.error('Arguments day must be a valid integer');
	Deno.exit(1);
}

let path = `./src/day_${day}.ts`;

if (!exists(path)) {
	// maybe ts doesnt exist, try js
	path = path.replace('.ts', '.js');

	// even js doesnt exist, show err and exit
	if (!exists(path)) {
		console.error('Invalid path. Does not exist');
		Deno.exit(1);
	}
}

const input = await readInput(parseInt(day, 10));

console.time('execution');

const script = await import(path) as Record<string, Solution>;

if ('partOne' in script) {
	console.log('Part 1:', await script.partOne(input));
}

if ('partTwo' in script) {
	console.log('Part 2:', await script.partTwo(input));
}

console.timeEnd('execution');

Deno.exit(0);
