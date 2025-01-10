/** @see https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events */

import { safe, isDefined } from "@mjt-engine/object";

export const decodeSseValue = (
  value: string | undefined
): { field: SseField; value: string }[] | undefined => {
  const fields = [":", "event:", "data:", "id:", "retry:"];
  if (!value) {
    return [];
  }

  const regex = new RegExp(
    `(${fields.map((f) => `^${f}`).join("|")})(.*$)`,
    "igm"
  );
  const matches = Array.from(value.trim().matchAll(regex));
  return matches
    .map((match) => {
      return safe(() => ({
        field: match[1].replace(":", "") as SseField,
        value: match[2]?.trim(),
      }));
    })
    .filter(isDefined);
};

export type SseField = "event" | "data" | "id" | "retry" | "";
