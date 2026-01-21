"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            {error === "CredentialsSignin"
              ? "Invalid email or password"
              : error || "An authentication error occurred"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error === "CredentialsSignin"
              ? "Please check your email and password and try again."
              : "Please try again or contact support if the problem persists."}
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login" className="flex-1">
              <Button className="w-full">Back to Login</Button>
            </Link>
            <Link href="/auth/register" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
