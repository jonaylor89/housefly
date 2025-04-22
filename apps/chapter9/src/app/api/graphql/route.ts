import type { NextApiRequest } from "next";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/lib/schema";
import { resolvers } from "@/lib/resolvers";

// Create the Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create the Next.js handler for the Apollo Server
const handler = startServerAndCreateNextHandler<NextApiRequest>(server, {
  context: async (req) => {
    // Simple auth handling using headers
    const authHeader = req.headers["authorization"];
    let user = undefined;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      try {
        // In a real app, verify the JWT here
        // Here we just decode the base64 token
        const [userId] = Buffer.from(token, "base64")
          .toString("ascii")
          .split(":");
        user = { id: userId };
      } catch (error) {
        // Invalid token, user remains undefined
      }
    }

    return { user };
  },
});

// Define the route handlers
export { handler as GET, handler as POST };
