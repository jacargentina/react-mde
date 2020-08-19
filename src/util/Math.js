// @flow
/**
 * Calculates modulus, like %, except that it works with negative numbers
 */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
