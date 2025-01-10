import { processSsePartial } from "./processSsePartial";
export const processSsePartialUntilNoMoreStops = async (params) => {
    const rest = await processSsePartial(params);
    if (rest.length === 0 || rest === params.input) {
        return rest;
    }
    return processSsePartialUntilNoMoreStops({
        ...params,
        input: rest,
    });
};
//# sourceMappingURL=processSsePartialUntilNoMoreStops.js.map