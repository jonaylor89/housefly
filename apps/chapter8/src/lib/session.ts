import { getServerSession as getServerSessionOriginal } from "next-auth";
import { authOptions } from "./auth";

export async function getServerSession() {
  return getServerSessionOriginal(authOptions);
}