import { getCurrentUser } from "./current-user";
import { env } from "cloudflare:workers";

export const getCartForCurrentUser = async () => {
  const user = await getCurrentUser();

  const { CART_DO } = env;
  const cartId = CART_DO.idFromName(user.id);
  const cart = CART_DO.get(cartId);

  return cart;
};
