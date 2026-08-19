import { Suspense } from "react";
import { StackAuthScreen } from "@/components/auth/stack-auth-screen";
import { PublicOnlyRoute } from "@/components/auth/public-only-route";

export default function SignUpPage() {
  return (
    <PublicOnlyRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-floral text-smoky flex items-center justify-center font-mono text-xs">
            Loading sign up...
          </div>
        }
      >
        <StackAuthScreen mode="sign-up" returnTo="/dashboard" />
      </Suspense>
    </PublicOnlyRoute>
  );
}
