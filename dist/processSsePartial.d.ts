import type { SseConsumer } from "./SseConsumer";
export declare const processSsePartial: <T>({ input, dataParser, consumer, reader, done, }: {
    done: boolean;
    input: string;
    reader: ReadableStreamDefaultReader<string>;
    dataParser?: (data: string) => T | undefined;
    consumer: SseConsumer<T>;
}) => Promise<string>;
