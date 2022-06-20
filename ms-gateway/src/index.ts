import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(
  "/saldo",
  createProxyMiddleware({
    target: `http://ms-financial:3334/`,
    headers: {
      accept: "application/json",
      method: "GET",
    },
    changeOrigin: true,
  })
);

app.use(
  "/transacao",
  createProxyMiddleware({
    target: `http://ms-financial:3334/`,
    headers: {
      accept: "application/json",
      method: "GET",
    },
    changeOrigin: true,
  })
);

app.use(
  "/transacao",
  createProxyMiddleware({
    target: `http://ms-financial:3334/`,
    headers: {
      accept: "application/json",
      method: "POST",
    },
    changeOrigin: true,
  })
);

app.use(
  "/cliente",
  createProxyMiddleware({
    target: `http://ms-users:3333/`,
    headers: {
      accept: "application/json",
      method: "GET",
    },
    changeOrigin: true,
  })
);

app.use(
  "/cliente",
  createProxyMiddleware({
    target: `http://ms-users:3333/`,
    headers: {
      accept: "application/json",
      method: "POST",
    },
    changeOrigin: true,
  })
);

app.listen(3000, () => {
  console.log("MS-Gateway running!");
});
