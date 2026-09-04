import { createHash } from "node:crypto";
export const hashStudentCode = (code: string) => createHash("sha256").update(code, "utf8").digest("hex");
