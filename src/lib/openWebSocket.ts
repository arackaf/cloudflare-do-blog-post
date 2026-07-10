export function openWebSocket() {
  return new Promise<WebSocket>((res, rej) => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";

    const socket = new WebSocket(`${protocol}//${location.host}/api/cart/subscribe`);

    socket.addEventListener("open", () => {
      console.log("WebSocket connected");
      res(socket);
    });

    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
      rej(event);
    });

    socket.addEventListener("close", (event) => {
      console.error("WebSocket closed:", event);
    });
  });
}
