import { isDefined } from "@mjt-engine/object";
/**
 * remove any stopword references as well as any _potential_ stopword references
 */
const stopWordToCleanText = ({ text, stopWord, }) => {
    // the text could potentially have several partial matches.
    const { pre, mid, post } = stopWord;
    // if there is a post but does not match further, then give up
    const postMatch = text.match(new RegExp(`${post}`));
    if (postMatch) {
        const preMidPostMatch = text.match(new RegExp(`${pre}${mid}${post}`));
        if (preMidPostMatch && isDefined(preMidPostMatch.index)) {
            return [text.slice(0, preMidPostMatch.index), true];
        }
        return [text, false];
    }
    // we are potentially in the middle of a match
    // grab as much as we can to check later
    const preMidMatch = text.match(new RegExp(`${pre}${mid}`));
    if (preMidMatch && isDefined(preMidMatch.index)) {
        return [text.slice(0, preMidMatch.index), false];
    }
    // since single char matching need to be able to check first chars directly
    // possible that the mid regex might require stuff that just isn't possible yet
    const preMatch = text.match(new RegExp(`${pre}`));
    if (preMatch && isDefined(preMatch.index)) {
        return [text.slice(0, preMatch.index), false];
    }
    return [text, false];
};
const stopWordsToCleanText = ({ text, stopWords, onConsume = () => { }, }) => {
    let cleanResult = text;
    for (const stopWord of stopWords) {
        const [cleaned, consumed] = stopWordToCleanText({
            text: cleanResult,
            stopWord: stopWord,
        });
        if (consumed) {
            onConsume(text, stopWord);
            return [cleaned, consumed];
        }
        cleanResult = cleaned;
    }
    return [cleanResult, false];
};
export const createStreamParser = ({ onConsume, stopWords = [], }) => {
    let buffer = "";
    const transformStream = new TransformStream({
        transform: (chunk, controller) => {
            if (!chunk || chunk.length === 0) {
                return;
            }
            buffer = `${buffer}${chunk}`;
            const [cleaned, consumed] = stopWordsToCleanText({
                text: buffer,
                stopWords,
                onConsume,
            });
            buffer = consumed ? "" : buffer.slice(cleaned.length);
            if (cleaned.length > 0) {
                controller.enqueue(cleaned);
            }
        },
        start: (controller) => { },
        flush: (controller) => {
            controller.terminate();
        },
    });
    const reader = transformStream.readable.getReader();
    const writer = transformStream.writable.getWriter();
    return {
        reader,
        write: (text) => {
            text.split("").forEach((c) => writer.write(c));
        },
        close: () => {
            writer.close();
        },
    };
};
//# sourceMappingURL=createStreamParser.js.map