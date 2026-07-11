import { DurableObject } from "cloudflare:workers";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
  lineTotal: number;
}

export interface CartContents {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartItemRow extends Record<string, SqlStorageValue> {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

export class CartDO extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS cart_items (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price REAL NOT NULL,
          category TEXT NOT NULL,
          image TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1
        )
      `);
    });
  }
  getCart(): CartContents {
    const rows = this.ctx.storage.sql
      .exec<CartItemRow>(
        `
        SELECT
          id,
          name,
          description,
          price,
          category,
          image,
          quantity
        FROM cart_items
        ORDER BY name
      `,
      )
      .toArray();

    const items: CartItem[] = rows.map((row) => ({
      ...row,
      lineTotal: row.price * row.quantity,
    }));

    return {
      items,
      totalItems: rows.reduce((sum, row) => sum + row.quantity, 0),
      totalPrice: rows.reduce((sum, row) => sum + row.price * row.quantity, 0),
    };
  }
  async clearCart() {
    this.ctx.storage.sql.exec(`DELETE FROM cart_items`);
    this.#sendCartUpdatedEvent();
  }
  async addItem(item: Product) {
    this.ctx.storage.sql.exec(
      `
        INSERT INTO cart_items (
          id,
          name,
          description,
          price,
          category,
          image,
          quantity
        )
        VALUES (?, ?, ?, ?, ?, ?, 1)

        ON CONFLICT(id) DO UPDATE SET quantity = quantity + 1
      `,
      item.id,
      item.name,
      item.description,
      item.price,
      item.category,
      item.image,
    );

    this.#sendCartUpdatedEvent();
  }
  #sendCartUpdatedEvent() {
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(
          JSON.stringify({
            type: "cart-updated",
          }),
        );
      } catch {
        // The socket may have disconnected before Cloudflare observed it.
        socket.close(1011, "Unable to send cart update");
      }
    }
  }
  fetch(request: Request): Response {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", {
        status: 426,
      });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    this.ctx.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
  webSocketMessage(socket: WebSocket, message: string | ArrayBuffer) {
    console.log("received on DO", message);
    socket.send(JSON.stringify({ message: "Message received", originalMessage: message }));
  }
}
