import { stackServerApp } from "@/stack";
export async function getAuthenticatedUser(){ if(!stackServerApp)return null; return stackServerApp.getUser(); }
