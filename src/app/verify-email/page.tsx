import { VerifyEmailScreen } from "@/components/auth/verify-email-screen";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; email?: string }>;
}) {
  const params = await searchParams;
  return <VerifyEmailScreen initialCode={params.code} email={params.email} />;
}

