import { createServerFn } from "@tanstack/react-start";
import { getCartForCurrentUser } from "./getCartForCurrentUser";

export const clearCart = createServerFn({ method: "POST" }).handler(async () => {
  const cart = await getCartForCurrentUser();
  await cart.clearCart();
});
