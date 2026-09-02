// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

let serverLikes = 10;

export default defineConfig({
  plugins: [
    react(),
    {
      name: "internal-mock-api",
      configureServer(server) {
        server.middlewares.use("/api/like", (req, res) => {
          // 1. [GET] 조회
          if (req.method === "GET") {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ likes: serverLikes }));
            return;
          }

          // 2. [DELETE] 10으로 초기화
          if (req.method === "DELETE") {
            serverLikes = 10;
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ likes: serverLikes }));
            return;
          }

          // 3. [POST] 좋아요 증가
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", async () => {
              const { shouldFail } = JSON.parse(body || "{}");

              // 400ms 지연
              await new Promise((r) => setTimeout(r, 400));

              if (shouldFail) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ message: "서버 내부 오류 (500 Error)" }),
                );
                return;
              }

              serverLikes += 1;
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ likes: serverLikes }));
            });
            return;
          }

          res.statusCode = 405;
          res.end();
        });
      },
    },
  ],
});
