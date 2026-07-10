import { getCartForCurrentUser } from "#/server/getCartForCurrentUser";
import { createFileRoute } from "@tanstack/react-router";

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
