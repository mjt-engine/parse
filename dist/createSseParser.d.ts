import type { SseConsumer } from "./SseConsumer";
export declare const createSseParser: <T>({ consumer, reader, onDone, onError, dataParser, signal, }: {
    signal?: AbortSignal;
    onDone?: () => void;
    onError?: (err: unknown) => void;
    reader: ReadableStreamDefaultReader<string>;
    dataParser?: (data: string) => T | undefined;
    consumer: SseConsumer<T>;
}) => Promise<void>;
