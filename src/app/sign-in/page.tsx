import { StackAuthScreen } from "@/components/auth/stack-auth-screen";

type SearchParams = {
  returnTo?: string;
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
  const returnTo = params.returnTo === "/" ? "/" : "/dashboard";

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

  const isGoogleConflict = params.errorCode === "CONTACT_CHANNEL_ALREADY_USED_FOR_AUTH_BY_SOMEONE_ELSE";
  const initialError = isGoogleConflict
    ? "Account conflict detected for this email. Trying automatic Google resolution..."
    : params.error_description || (params.error ? `Authentication failed (${params.error}).` : undefined);

  return (
    <StackAuthScreen
      mode="sign-in"
      returnTo={returnTo}
      initialError={initialError}
      initialEmail={initialEmail}
      autoResolveGoogleConflict={isGoogleConflict}
    />
  );
}
