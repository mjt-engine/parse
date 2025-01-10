export const detectSimpleStop = (
  text: string | undefined,
  stops: string[]
): [string | undefined, boolean, number] => {
  if (!text) {
    return [undefined, false, 0];
  }
  for (const stop of stops) {
    const indexMaybe = text.indexOf(stop);
    if (indexMaybe > -1) {
      const sliced = text.slice(0, indexMaybe);
      return [sliced, true, stop.length];
    }
  }

  return [text, false, 0];
};
