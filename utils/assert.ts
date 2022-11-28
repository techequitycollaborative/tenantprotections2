import assert from 'assert';

// needed for typescript type validation
export function assertIsString(val: any): asserts val is string {
  assert(typeof val === 'string');
}
