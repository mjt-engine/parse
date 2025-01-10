import type { SseConsumer } from "./SseConsumer";
export declare const processSsePartialUntilNoMoreStops: <T>(params: {
    done: boolean;
    input: string;
    reader: ReadableStreamDefaultReader<string>;
    dataParser?: (data: string) => T | undefined;
    consumer: SseConsumer<T>;
}) => Promise<string>;
