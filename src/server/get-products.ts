import { createServerFn } from "@tanstack/react-start";

import products from "#/data/products.json";
import type { Product } from "#/durable-obj/Cart";

export const getProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => products as Product[],
);
