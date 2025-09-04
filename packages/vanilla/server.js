import compression from "compression";
import express from "express";
import fs from "node:fs/promises";
import sirv from "sirv";

const prod = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || (prod ? "/front_6th_chapter4-1/vanilla/" : "/");

// 서버 인스턴스 생성
const app = express();

let vite;
let template;
let render;
if (!prod) {
  // dev 환경에서는 vite 서버를 사용
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  // production 환경
  console.log("production 환경");
  app.use(compression());
  app.use(base, sirv("./dist/vanilla", { extensions: [] }));

  // 템플릿 로드
  render = (await import("./dist/vanilla-ssr/main-server.js")).render;
  template = await fs.readFile("./dist/vanilla/index.html", "utf-8");
}

app.get("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");
    if (!prod) {
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("./src/main-server.js")).render;
    }

    const renderResult = await render(url, req.query);

    const initData = renderResult.initData
      ? `<script>window.__INITIAL_DATA__ = ${JSON.stringify(renderResult.initData)}</script>`
      : "";

    const html = template
      .replace("<!--app-html-->", renderResult.html ?? "")
      .replace("<!--app-head-->", renderResult.head ?? "")
      .replace("</head>", `${initData}</head>`);

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (error) {
    if (!prod && vite) {
      vite.ssrFixStacktrace(error);
    }
    console.error("Error SSR page", error.stack);
    res.status(500).end(error.message);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Vanilla Server started at http://localhost:${port}`);
});
