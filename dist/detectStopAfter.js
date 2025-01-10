import { escapeRegExp } from "./escapeRegExp";
export const detectStopAfter = (text, stopArrayOrString = []) => {
    if (!text) {
        return [undefined, false];
    }
    const stop = Array.isArray(stopArrayOrString)
        ? stopArrayOrString
        : [stopArrayOrString];
    if (stop.length === 0) {
        return [text, false];
    }
    const escapedStops = stop.map(escapeRegExp);
    const regex = new RegExp(`(.*?)(${escapedStops.join("|")})`, "ms");
    const match = text.match(regex);
    if (match && match.length === 3) {
        return [match[1] + match[2], true];
    }
    return [text, false];
};
//# sourceMappingURL=detectStopAfter.js.map