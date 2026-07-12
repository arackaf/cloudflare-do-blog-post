import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getProducts } from "#/server/get-products";
import { openWebSocket } from "#/lib/openWebSocket";
import { getCartForCurrentUser } from "#/server/getCartForCurrentUser";
import { useEffect, useRef, useState } from "react";
import type { Product } from "#/durable-obj/Cart";
import { useQueryClient } from "@tanstack/react-query";
import { getCartQueryOptions } from "#/server/get-cart-contents";

const addItem = createServerFn({ method: "POST" })
  .validator((item: Product) => item)
  .handler(async ({ data }) => {
    const cart = await getCartForCurrentUser();
    await cart.addItem(data);
  });

export const Route = createFileRoute("/")({
  loader: () => getProducts(),
  component: Home,
});

function formatPrice(price: number) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-orange-300 hover:shadow-md">
      <div className="relative aspect-4/3 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 line-clamp-2 h-14 text-lg font-semibold leading-snug text-slate-900 group-hover:text-orange-600">
          {product.name}
        </h2>
        <p className="mb-4 line-clamp-3 h-17 text-sm leading-relaxed text-slate-600">{product.description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-lg font-semibold text-slate-900">{formatPrice(product.price)}</span>
          <button
            type="button"
            className="rounded-lg bg-orange-500 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600"
            onClick={() => {
              addItem({ data: product });
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

function Home() {
  const products = Route.useLoaderData();
  const [_, setSocket] = useState<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const socketInitializedRef = useRef(false);
  useEffect(() => {
    if (socketInitializedRef.current) return;
    socketInitializedRef.current = true;
    openWebSocket().then((socket) => {
      setSocket(socket);
      console.log("Socket open");

      socket.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data) as { type: string; data: any };
        if (payload.type === "cart-updated") {
          queryClient.invalidateQueries({ queryKey: getCartQueryOptions.queryKey });
        }
      });
    });
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catalog</h1>
        <p className="mt-2 text-slate-600">Curated gear for developers who ship at the edge.</p>
      </div>

      <ul className="grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id} className="h-full">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </main>
  );
}
