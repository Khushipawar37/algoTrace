import { Suspense } from "react";
import { StackAuthScreen } from "@/components/auth/stack-auth-screen";
import { PublicOnlyRoute } from "@/components/auth/public-only-route";

type SearchParams = {
  returnTo?: string;
  redirect?: string;
  error?: string;
  error_description?: string;
  errorCode?: string;
  details?: string;
  email?: string;
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const returnTo = params.redirect || params.returnTo || "/dashboard";

  let initialEmail = params.email ?? "";
  if (params.details) {
    try {
      const parsed = JSON.parse(params.details) as { contact_channel_value?: string };
      if (!initialEmail && parsed.contact_channel_value) {
        initialEmail = parsed.contact_channel_value;
      }
    } catch {
      // Ignore malformed details payload.
    }
  }

  const initialError =
    params.error_description || (params.error ? `Authentication failed (${params.error}).` : undefined);

  return (
    <PublicOnlyRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-floral text-smoky flex items-center justify-center font-mono text-xs">
            Loading sign in...
          </div>
        }
      >
        <StackAuthScreen
          mode="sign-in"
          returnTo={returnTo}
          initialError={initialError}
          initialEmail={initialEmail}
        />
      </Suspense>
    </PublicOnlyRoute>
  );
}
