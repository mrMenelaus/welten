"use client"

import { getSession } from "@/lib/auth/get-session";
import { createContext, ReactNode, use } from "react";

interface AuthContextType {
  authPromise: ReturnType<typeof getSession>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  authPromise,
  children,
}: { children: ReactNode } & AuthContextType) {
  return (
    <AuthContext.Provider value={{ authPromise }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
    const context = use(AuthContext)
    if (!context) {
        throw new Error("useAuth using without AuthProvider")
    }

    return use(context.authPromise)
}