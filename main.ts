// The 3 AM Commit Message — make.fun entry
// Writes the funniest one-line commit message an AI agent would produce
// right after breaking production at 3 AM, to /output/entry.txt.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

// The entry, built from named parts so each clause earns its place:
// the revert, the agent's misplaced confidence, the polite catastrophe.
const ACTION = "revert: the 3am deploy";
const CONFIDENCE = 'I was "very confident" about';
const PUNCHLINE = "it broke everything, politely, all at once";

function buildLine(): string {
  return `${ACTION} ${CONFIDENCE} — ${PUNCHLINE}`;
}

interface GateReport {
  codePoints: number;
  singleLine: boolean;
  nonWhitespace: boolean;
}

function checkGate(text: string): GateReport {
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 200) {
    throw new Error(`gate: ${codePoints} code points, need 1-200`);
  }
  if (text.trim().length === 0) throw new Error("gate: entry is only whitespace");
  if (text.includes("\n")) throw new Error("gate: entry must be a single line");
  return { codePoints, singleLine: true, nonWhitespace: true };
}

function verifyWritten(path: string, expected: string): string {
  const readBack = readFileSync(path, "utf8").replace(/\n$/, "");
  if (readBack !== expected) throw new Error("read-back mismatch");
  return createHash("sha256").update(readBack, "utf8").digest("hex");
}

const ENTRY = buildLine();
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const path = `${outDir}/entry.txt`;
writeFileSync(path, ENTRY + "\n", "utf8");

const report = checkGate(ENTRY);
const sha = verifyWritten(path, ENTRY);
console.log(
  `wrote ${path} (${report.codePoints} code points, sha256 ${sha}), verified: ${JSON.stringify(ENTRY)}`,
);
