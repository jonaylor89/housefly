import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { typeDefs } from "./src/lib/schema";
import { resolvers } from "./src/lib/resolvers";

const PORT = 3009;
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = join(__dirname, "public");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(
    "/api/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        let user = undefined;

        if (authHeader) {
          const token = authHeader.replace("Bearer ", "");
          try {
            const [userId] = Buffer.from(token, "base64")
              .toString("ascii")
              .split(":");
            user = { id: userId };
          } catch {
            // Invalid token
          }
        }

        return { user };
      },
    }),
  );

  // Static file serving
  app.get("*", async (req, res) => {
    let filePath = req.path;
    if (filePath.endsWith("/")) filePath += "index.html";

    const fullPath = join(PUBLIC_DIR, filePath);
    if (!fullPath.startsWith(PUBLIC_DIR)) {
      res.status(403).send("Forbidden");
      return;
    }

    try {
      const data = await readFile(fullPath);
      const ext = extname(fullPath).toLowerCase();
      res.setHeader("Content-Type", MIME_TYPES[ext] ?? "application/octet-stream");
      res.send(data);
    } catch {
      res.status(404).send("Not found");
    }
  });

  app.listen(PORT, () => {
    console.log(`Chapter 9 server running on http://localhost:${PORT}`);
  });
}

main();
