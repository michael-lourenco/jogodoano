import { JWT } from "next-auth/jwt";
import { handler } from "./handler";

export interface Token extends JWT {
  sub?: string;
}

export { handler as GET, handler as POST };
