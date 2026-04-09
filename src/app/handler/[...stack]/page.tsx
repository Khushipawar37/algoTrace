import { redirect } from "next/navigation";

export default function StackAuthHandlerPage() {
  redirect("/sign-in");
}
