import type { CartContents as CartData } from "#/durable-obj/Cart";
import { ShoppingCart } from "lucide-react";
import type { FC } from "react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export const CartButton = () => {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
      aria-label="Shopping cart, 0 items"
    >
      <ShoppingCart className="size-4 text-slate-500" aria-hidden />
      <span className="font-medium text-slate-900">0</span>
    </button>
  );
};

export const CartContents: FC<{ contents: CartData }> = ({ contents }) => {
  if (contents.items.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">Your cart is empty.</p>;
  }

  return (
    <div className="flex flex-col">
      <ul className="divide-y divide-slate-100">
        {contents.items.map((item) => (
          <li key={item.id} className="flex gap-3 py-3">
            <img
              src={item.image}
              alt={item.name}
              className="size-14 shrink-0 rounded-lg border border-slate-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium text-slate-900">{formatPrice(item.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
        <span className="text-sm font-medium text-slate-600">Total</span>
        <span className="text-base font-semibold text-slate-900">{formatPrice(contents.totalPrice)}</span>
      </div>
    </div>
  );
};
