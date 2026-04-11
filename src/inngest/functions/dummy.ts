import { inngest } from "../client";

export const dummyCheckFunction = inngest.createFunction(
  { id: "dummy-check", triggers: [{ event: "check/dummy" }] },
  async ({ event }) => {
    console.log("dummy-check received", event);
    return { ok: true };
  }
);