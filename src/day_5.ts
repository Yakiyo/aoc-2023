import { readInput } from '../util.ts';

const input = await readInput(5);

const _demo = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

class Range {
	private source: number;
	private destination: number;
	private range: number;

	constructor(line: string) {
		const [destination, source, range] = line.split(/ +/).map(Number);
		this.destination = destination;
		this.source = source;
		this.range = range - 1;
	}

    public static parse(line: string) {
        return new Range(line);
    }

	/**
	 * If the provided number falls in this range
	 */
	private matches(value: number): boolean {
		return value >= this.source && value <= this.source + this.range;
	}

    /**
     * Converts the source number to the destination number
     */
    public map(source: number): number | null {
        if (!this.matches(source)) return null;
        return this.destination + (source - this.source);
    }

}

class AlmanacMap {
    private ranges: Range[];
    constructor(input: string) {
        // we ignore the first line since all the maps are provided in order
        this.ranges = input.split('\n').slice(1).map(Range.parse);
    }

    public static parse(input: string) {
        return new AlmanacMap(input);
    }

    public convert(source: number) {
        let destination: number | null = null;
        for (const range of this.ranges) {
            destination = range.map(source);
            // if destination finally got a value, we stop the loop
            if (destination !== null) break; 
        }

        // just in case destination is still null, 
        // source and destination will then be the same value
        if (destination === null) {
            destination = source;
        }
        return destination;
    }
}

function convert(source: number, maps: AlmanacMap[]): number {
    let n = source;
    for (const map of maps) {
        n = map.convert(n);
    }
    return n;
}

function partOne(input: string) {
    const inputs = input.split('\n\n');
    const seeds = inputs[0].replace('seeds: ', '').split(/ +/).map(Number);
	const maps = inputs.slice(1).map(AlmanacMap.parse);
    return seeds.map(n => convert(n, maps)).sort()[0];
}


console.log(`Part 1: ${partOne(input)}`);
