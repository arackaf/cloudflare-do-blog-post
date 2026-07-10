import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ShoppingCart, User } from "lucide-react";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

const CURRENT_USER = "Adam";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Edge Shop",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <div className="flex min-h-full flex-col">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-orange-500">Edge Shop</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                  <User className="size-4 text-slate-400" aria-hidden />
                  <span>
                    Hello, <span className="font-medium text-slate-900">{CURRENT_USER}</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                  aria-label="Shopping cart, 0 items"
                >
                  <ShoppingCart className="size-4 text-slate-500" aria-hidden />
                  <span className="font-medium text-slate-900">0</span>
                </button>
              </div>
            </div>
          </header>
          <div className="flex-1">{children}</div>
        </div>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
