import { execFileSync } from "node:child_process";
export const gh = (...args) => JSON.parse(execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 << 20 }) || "null");
