import type { SseConsumer } from "./SseConsumer";
import { processSsePartial } from "./processSsePartial";

export const processSsePartialUntilNoMoreStops = async <T>(params: {
  done: boolean;
  input: string;
  reader: ReadableStreamDefaultReader<string>;
  dataParser?: (data: string) => T | undefined;
  consumer: SseConsumer<T>;
}): Promise<string> => {
  const rest = await processSsePartial(params);
  if (rest.length === 0 || rest === params.input) {
    return rest;
  }

  return processSsePartialUntilNoMoreStops({
    ...params,
    input: rest,
  });
};
