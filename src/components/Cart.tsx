import type { CartContents as CartData } from "#/durable-obj/Cart";
import { cn } from "#/lib/utils";
import { clearCart } from "#/server/clear-cart";
import { getCartQueryOptions } from "#/server/get-cart-contents";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import type { FC } from "react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export const CartButton: FC = () => {
  const { data: cart } = useQuery(getCartQueryOptions);
  const contentsCount = cart?.totalItems;

  const cartReady = cart != null;

  return (
    <Sheet>
      <SheetTrigger
        disabled={!cartReady}
        render={
          <button
            type="button"
            className={cn(
              "flex items-center min-h-[34px] gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition",
              cartReady ? "hover:border-orange-300 hover:bg-orange-50 cursor-pointer" : "cursor-default",
            )}
            aria-label={`Shopping cart, ${cart?.totalItems ?? "loading"} items`}
          />
        }
      >
        <ShoppingCart className="size-4 text-slate-500" aria-hidden />
        <span className="font-medium text-slate-900 min-w-[1ch]">{contentsCount}</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        <div className="px-4">{cart ? <CartContents contents={cart} /> : null}</div>
      </SheetContent>
    </Sheet>
  );
};

export const CartContents: FC<{ contents: CartData }> = ({ contents }) => {
  const queryClient = useQueryClient();

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
      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full"
        onClick={async () => {
          await clearCart();
          await queryClient.invalidateQueries({ queryKey: getCartQueryOptions.queryKey });
        }}
      >
        Clear cart
      </Button>
    </div>
  );
};
