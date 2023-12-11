import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { parse } from './day_1.ts';

Deno.test('Parse test', () => {
	assertEquals(parse('vzxf4tqrljgxmthreejcr'), ['4', '3']);
});
