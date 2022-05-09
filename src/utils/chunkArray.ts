/**
 * Returns an array with arrays of the given size.
 */
export const chunkArray = async (myArray: any[], chunkSize: number) => {
  const results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }
  return results;
};
