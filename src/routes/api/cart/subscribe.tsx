import { createFileRoute } from "@tanstack/react-router";
import { getCartForCurrentUser } from "#/server/getCartForCurrentUser";

export const Route = createFileRoute("/api/cart/subscribe")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cart = await getCartForCurrentUser();
        return cart.fetch(request);
      },
    },
  },
});
