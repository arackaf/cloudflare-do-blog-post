import { DurableObject } from "cloudflare:workers";

export class CartDO extends DurableObject {
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
  allWebsockets() {
    return this.ctx.getWebSockets().map((ws) => ws.url);
  }
  async addItem() {
    await new Promise((res) => setTimeout(res, 10));

    const message = JSON.stringify({
      type: "cart-updated",
    });

    for (const socket of this.ctx.getWebSockets()) {
      try {
        console.log("Sending message to", socket.url);
        socket.send(message);
      } catch {
        // The socket may have disconnected before Cloudflare observed it.
        socket.close(1011, "Unable to send cart update");
      }
    }
  }
  items() {
    return {
      items: [
        { id: 1, name: "Building Microservices" },
        { id: 2, name: "Standing Desk" },
      ],
    };
  }
}
