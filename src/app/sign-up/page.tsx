import { StackAuthScreen } from "@/components/auth/stack-auth-screen";

export default function SignUpPage() {
  return <StackAuthScreen mode="sign-up" returnTo="/dashboard" />;
}
