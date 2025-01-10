import type { SseConsumer } from "./SseConsumer";
import { processSsePartialUntilNoMoreStops } from "./processSsePartialUntilNoMoreStops";

export const createSseParser = <T>({
  consumer,
  reader,
  onDone = () => {},
  onError = () => {},
  dataParser = (data) => data as T,
  signal,
}: {
  signal?: AbortSignal;
  onDone?: () => void;
  onError?: (err: unknown) => void;
  reader: ReadableStreamDefaultReader<string>;
  dataParser?: (data: string) => T | undefined;
  consumer: SseConsumer<T>;
}): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    let finished = false;
    try {
      let partial = "";
      while (!signal?.aborted && !finished) {
        const { value: readValue = "", done } = await reader.read();

        if (!readValue && !done) {
          continue;
        }
        if (done) {
          if (partial.length > 0) {
            const foo = await processSsePartialUntilNoMoreStops({
              input: partial + readValue,
              consumer,
              done,
              reader,
              dataParser,
            });
          }
          await consumer(undefined, done);
          onDone();
          reader.cancel();
          finished = true;
          break;
        }
        partial = await processSsePartialUntilNoMoreStops({
          input: partial + readValue,
          consumer,
          done,
          reader,
          dataParser,
        });
      }
    } catch (error) {
      onError(error);
      reject(error);
    } finally {
      reader.cancel();
      if (!finished) {
        onDone(); // make sure onDone is always called
      }
      consumer(undefined, true);
      resolve();
    }
  });
};
