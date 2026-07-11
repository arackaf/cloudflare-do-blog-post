import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { User } from "lucide-react";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "#/server/current-user";
import { useState } from "react";
import { CartButton } from "#/components/Cart";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async () => {
    const user = getCurrentUser();
    return { userPromise: user };
  },
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
  const [user, setUser] = useState<string | null>(null);
  const { userPromise } = Route.useLoaderData();

  userPromise.then((user) => {
    setUser(user.name);
  });

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
              <div className="flex items-center gap-3 min-h-[34px]">
                {user ? (
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                    <User className="size-4 text-slate-400" aria-hidden />
                    <span>
                      Hello, <span className="font-medium text-slate-900">{user}</span>
                    </span>
                  </div>
                ) : null}
                <CartButton />
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
