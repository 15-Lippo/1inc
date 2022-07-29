/**
 * The function is used to round the percent value in routes.
 * If the percent is an integer, then such value is displayed without an extra "0" after the decimal point.
 * Example of rounding to two decimals: "33.33 %", "50 %", "22.25 %", "60 %", etc.
 */

const roundPercentInRoutes = (num: number, fixed: number) => {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  // @ts-ignore
  return num.toString().match(re)[0];
};

export { roundPercentInRoutes };
