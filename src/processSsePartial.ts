import { isDefined, safe } from "@mjt-engine/object";
import type { SseConsumer } from "./SseConsumer";
import { decodeSseValue } from "./decodeSseValue";
import { detectSimpleStop } from "./detectSimpleStop";

export const processSsePartial = async <T>({
  input,
  dataParser = (data) => data as T,
  consumer,
  reader,
  done,
}: {
  done: boolean;
  input: string;
  reader: ReadableStreamDefaultReader<string>;

  dataParser?: (data: string) => T | undefined;
  consumer: SseConsumer<T>;
}) => {
  const [stopFragment, stopped, stopLength] = detectSimpleStop(input, [
    "\n\n",
    "\n",
  ]);
  if (!stopped) {
    if (!stopFragment) {
      console.log("error", [input, stopFragment, stopped]);
      throw new Error("unexpected undefined stopFragment");
    }
    return stopFragment;
  }

  const decodes = decodeSseValue(stopFragment);

  if (decodes) {
    for (const decoded of decodes) {
      if (isDefined(decoded) && decoded.field === "data") {
        const chunk = safe(() => dataParser(decoded.value), {
          onError: `${decoded.value}`,
        }) as T;
        if (isDefined(chunk)) {
          const consumerResp = await consumer(chunk, done);
          if (consumerResp) {
            reader.cancel();
          }
        } else {
          // TODO better to allow consumer to know of failed chunk parse?
        }
      } else {
        // TODO interface for other SSE fields if/when needed
        // something we don't care about...
      }
    }
  }

  return stopFragment ? input.slice(stopFragment.length + stopLength) : input;
};
