export type ComplexStopWord = {
    pre: string;
    mid: string;
    post: string;
    name: string;
};
export declare const createStreamParser: ({ onConsume, stopWords, }: {
    stopWords: ComplexStopWord[];
    onConsume?: (text: string, stopWord: ComplexStopWord) => void;
}) => {
    reader: ReadableStreamDefaultReader<string>;
    write: (text: string) => void;
    close: () => void;
};
