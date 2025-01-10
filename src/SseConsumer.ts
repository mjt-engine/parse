import type { Boolish } from "./Boolish";

export type SseConsumer<T> = (
  value: T | undefined,
  done: boolean
) => Boolish | Promise<Boolish>;
