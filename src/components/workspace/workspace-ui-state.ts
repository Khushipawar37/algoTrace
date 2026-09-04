export type WorkspaceExecution = "run" | "submit";
export const pendingLabel = (busy: WorkspaceExecution | null) => busy === "submit" ? "Running hidden tests..." : busy === "run" ? "Running..." : null;
export const canStartExecution = (busy: WorkspaceExecution | null) => busy === null;
export const toggleFocus = (focused: boolean) => !focused;
