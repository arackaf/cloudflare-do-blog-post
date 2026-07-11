import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import type { CartContents } from "#/durable-obj/Cart";
import { getCartForCurrentUser } from "./getCartForCurrentUser";

export const getCartContents = createServerFn({ method: "GET" }).handler(async (): Promise<CartContents> => {
  const cart = await getCartForCurrentUser();
  const result = await cart.getCart();
  const { items, totalItems, totalPrice } = result;
  return {
    items,
    totalItems,
    totalPrice,
  };
});

export const getCartQueryOptions = queryOptions({
  queryKey: ["cart"],
  queryFn: async () => {
    const cart = await getCartContents();
    return cart;
  },
  gcTime: 1000 * 60 * 60,
  staleTime: 1000 * 60 * 60,
});
