export const detectSimpleStop = (text, stops) => {
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
//# sourceMappingURL=detectSimpleStop.js.map