import { createServerFn } from "@tanstack/react-start";

const currentUser = {
  id: "1",
  name: "Adam",
};

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  return currentUser;
});
