import handler from "@tanstack/react-start/server-entry";

// Export Durable Objects
export { CartDO } from "./durable-obj/Cart";

export default {
  fetch: handler.fetch,
};
