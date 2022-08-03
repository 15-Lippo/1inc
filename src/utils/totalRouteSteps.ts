const totalRouteSteps = (protocols: any) => {
  if (!protocols || !protocols.length) return 0;
  const total: number[] = [];
  protocols.forEach((e: any) => total.push(e.length));
  return total.reduce((p, c) => p + c, 0) || 0;
};

export { totalRouteSteps };
