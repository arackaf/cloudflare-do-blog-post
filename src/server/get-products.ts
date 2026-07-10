import { createServerFn } from "@tanstack/react-start";

import products from "#/data/products.json";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export const getProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => products as Product[],
);
