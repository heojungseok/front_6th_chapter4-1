import { createMemoryStorage, createStorage } from "../lib";
import { isSSR } from "../utils/environment.js";

export const cartStorage = !isSSR ? createStorage("shopping_cart") : createMemoryStorage();
