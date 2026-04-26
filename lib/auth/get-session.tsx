import { cache } from "react";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const getSession = cache(async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
    try {
        const player = jwt.verify(token, process.env.JWT_SECRET!) as { name: string, sub: string };
        return player
    } catch {
        return null
    }
});
