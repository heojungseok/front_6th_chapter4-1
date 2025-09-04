// 글로벌 라우터 인스턴스
import { BASE_URL } from "../constants.js";
import { Router, ServerRouter } from "../lib";
import { isSSR } from "../utils/environment.js";

const CurrentRouter = isSSR ? ServerRouter : Router;

export const router = new CurrentRouter(BASE_URL);
