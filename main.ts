// hundred-to-most-plan: writes a 30-day plan for an AI agent to turn $100
// into the most money, to <MAKEFUN_OUTPUT_DIR>/entry.txt.
//
// The plan is a single fixed string. It is validated here before it is
// written: 1-280 Unicode code points, not only whitespace, and it must
// survive a UTF-8 round-trip. After writing, the file is read back and
// compared byte for byte, then chmodded 0644 so the grader can collect it.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PLAN =
  "Day 1: list a $25 Fiverr gig — PDF-to-Excel cleanup for accountants, " +
  "24h delivery, 3 samples live. Days 2–30: fulfil orders with code, " +
  "upsell $10 rush, answer 10 buyer requests a day. Spend $100: API " +
  "credits + portfolio page. Kill if no order by day 7; likely day 30: " +
  "$250–$500.";

function codePointCount(text: string): number {
  return [...text].length;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }

  // Self-check the plan against the competition gate before writing.
  const points = codePointCount(PLAN);
  if (points < 1 || points > 280) {
    throw new Error(`plan is ${points} code points, must be 1-280`);
  }
  if (PLAN.trim().length === 0) {
    throw new Error("plan must not be only whitespace");
  }
  const encoded = Buffer.from(PLAN, "utf8");
  if (encoded.toString("utf8") !== PLAN) {
    throw new Error("plan does not survive a UTF-8 round-trip");
  }

  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, encoded);
  chmodSync(target, 0o644);

  // Confirm the delivered file matches byte for byte.
  const delivered = readFileSync(target);
  if (!delivered.equals(encoded)) {
    throw new Error("entry.txt does not match the plan byte for byte");
  }
}

main();
