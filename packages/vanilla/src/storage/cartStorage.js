import { createMemoryStorage, createStorage } from "../lib/index.js";
import { isSSR } from "../utils/environment.js";

export const cartStorage = !isSSR ? createStorage("shopping_cart") : createMemoryStorage();
