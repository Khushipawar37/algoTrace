import { StackAuthScreen } from "@/components/auth/stack-auth-screen";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  return <StackAuthScreen mode="sign-in" returnTo={params.returnTo} />;
}
