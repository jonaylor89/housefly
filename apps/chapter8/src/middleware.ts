import { withAuth } from "next-auth/middleware";

// Export the middleware to protect routes
export default withAuth({
  callbacks: {
    authorized({ token }) {
      // Return true if the user has a valid token
      return !!token;
    },
  },
});

// Define which routes should be protected
export const config = {
  matcher: ["/dashboard/:path*", "/api/user/:path*"],
};
