import { redirect } from "next/navigation";

function toQueryString(
  searchParams: Record<string, string | string[] | undefined>,
  mapAfterAuth = false,
) {
  const entries = Object.entries(searchParams).flatMap(([key, value]) => {
    if (value === undefined) return [];
    const mappedKey = mapAfterAuth && key === "after_auth_return_to" ? "returnTo" : key;
    if (Array.isArray(value)) return value.map((v) => [mappedKey, v]);
    return [[mappedKey, value]];
  });
  if (!entries.length) return "";
  return `?${new URLSearchParams(entries).toString()}`;
}

export default async function StackAuthHandlerPage({
  params,
  searchParams,
}: {
  params: Promise<{ stack?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { stack = [] } = await params;
  const query = await searchParams;
  const action = stack[0] ?? "sign-in";

  if (action === "oauth-callback") {
    redirect((`/oauth-callback${toQueryString(query)}` as unknown) as "/oauth-callback");
  }
  if (action === "email-verification") {
    redirect((`/verify-email${toQueryString(query)}` as unknown) as "/verify-email");
  }
  if (action === "sign-up") {
    redirect((`/sign-up${toQueryString(query, true)}` as unknown) as "/sign-up");
  }
  redirect((`/sign-in${toQueryString(query, true)}` as unknown) as "/sign-in");
}
