/**
 * Convert number to hexadecimal
 */

const toHex = (num: number) => {
  return `0x${num.toString(16)}`;
};

export { toHex };
