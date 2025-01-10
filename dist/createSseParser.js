import { processSsePartialUntilNoMoreStops } from "./processSsePartialUntilNoMoreStops";
export const createSseParser = ({ consumer, reader, onDone = () => { }, onError = () => { }, dataParser = (data) => data, signal, }) => {
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
        }
        catch (error) {
            onError(error);
            reject(error);
        }
        finally {
            reader.cancel();
            if (!finished) {
                onDone(); // make sure onDone is always called
            }
            consumer(undefined, true);
            resolve();
        }
    });
};
//# sourceMappingURL=createSseParser.js.map