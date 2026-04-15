import { StackClientApp, StackServerApp } from "@stackframe/stack";

const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
const secretServerKey = process.env.STACK_SECRET_SERVER_KEY;

export const isStackClientConfigured = Boolean(projectId && publishableClientKey);
export const isStackServerConfigured = Boolean(projectId && publishableClientKey && secretServerKey);

export const stackServerApp = isStackServerConfigured
  ? new StackServerApp({
      projectId,
      publishableClientKey,
      secretServerKey,
      tokenStore: "nextjs-cookie",
      urls: {
        signIn: "/sign-in",
        signUp: "/sign-up",
        emailVerification: "/verify-email",
        oauthCallback: "/oauth-callback",
        afterSignIn: "/dashboard",
        afterSignUp: "/dashboard",
        home: "/",
      },
    })
  : null;

export const stackClientApp = isStackClientConfigured
  ? new StackClientApp({
      projectId,
      publishableClientKey,
      tokenStore: "nextjs-cookie",
      urls: {
        signIn: "/sign-in",
        signUp: "/sign-up",
        emailVerification: "/verify-email",
        oauthCallback: "/oauth-callback",
        afterSignIn: "/dashboard",
        afterSignUp: "/dashboard",
        home: "/",
      },
    })
  : null;
