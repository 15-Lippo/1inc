function truncateZeros(val: string) {
  if (val.length < 2) {
    return val;
  }
  while (val[val.length - 1] === '0') {
    val = val.substring(0, val.length - 1);
  }
  return val.length > 1 && val[val.length - 1] === '.' ? val.substring(0, val.length - 1) : val;
}

export function bigFloatToFixed(val: string, decimals: number, appendZeros = false) {
  const dotPosition = val.indexOf('.');
  if (dotPosition === -1) {
    return appendZeros ? `${val}.${'0'.repeat(decimals)}` : val;
  }

  const decimalPartLength = val.length - dotPosition - 1;
  if (decimalPartLength > decimals) {
    const maxIndex = dotPosition + decimals;
    const fixed = val.substring(0, maxIndex + 1);
    return appendZeros ? fixed : truncateZeros(fixed);
  } else {
    const missingDecimals = decimals - decimalPartLength;
    return appendZeros ? val + '0'.repeat(missingDecimals) : truncateZeros(val);
  }
}
