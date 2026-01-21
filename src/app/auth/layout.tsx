import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Pathshala Design Studio",
  description: "Sign in or register for Pathshala Design Studio",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
