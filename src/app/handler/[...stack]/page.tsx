import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

export default function StackAuthHandlerPage(props: any) {
  if (!stackServerApp) {
    return (
      <div className="min-h-screen bg-floral text-smoky flex items-center justify-center p-6 font-sans">
        <div className="p-8 rounded-[24px] border border-smoky/20 bg-bone/30 text-center space-y-4 max-w-md">
          <h1 className="text-xl font-bold text-smoky">StackAuth Configuration Pending</h1>
          <p className="text-xs font-mono text-olive">
            Please add NEXT_PUBLIC_STACK_PROJECT_ID, NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY, and STACK_SECRET_SERVER_KEY to your .env.local file.
          </p>
        </div>
      </div>
    );
  }

  return <StackHandler app={stackServerApp} {...props} />;
}
