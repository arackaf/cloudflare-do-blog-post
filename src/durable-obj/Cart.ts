import { DurableObject } from "cloudflare:workers";

export class CartDO extends DurableObject {
  getCart() {
    return {
      items: [
        { id: 1, name: "Building Microservices" },
        { id: 2, name: "Standing Desk" },
      ],
    };
  }
  async addItem() {
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
