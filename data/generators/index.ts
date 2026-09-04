export function createDeterministicRandom(seed = 48291) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function deterministicIntArrays(options: {
  seed?: number;
  count: number;
  minLength: number;
  maxLength: number;
  minValue: number;
  maxValue: number;
}) {
  const random = createDeterministicRandom(options.seed);
  return Array.from({ length: options.count }, () => {
    const length = options.minLength + Math.floor(random() * (options.maxLength - options.minLength + 1));
    return Array.from({ length }, () => options.minValue + Math.floor(random() * (options.maxValue - options.minValue + 1)));
  });
}
