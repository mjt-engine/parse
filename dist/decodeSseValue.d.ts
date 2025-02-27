/** @see https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events */
export declare const decodeSseValue: (value: string | undefined) => {
    field: SseField;
    value: string;
}[] | undefined;
export type SseField = "event" | "data" | "id" | "retry" | "";
