import { StackAuthScreen } from "@/components/auth/stack-auth-screen";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const params = await searchParams;
  const returnTo = params.returnTo === "/" ? "/" : "/dashboard";
  return <StackAuthScreen mode="sign-in" returnTo={returnTo} />;
}
