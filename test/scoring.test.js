import assert from "node:assert/strict";
import test from "node:test";
import { assessCandidate, INTERVIEW_PROMPTS } from "../src/scoring.js";

test("returns low risk with baseline verification actions when no signals are selected", () => {
  const result = assessCandidate([]);

  assert.equal(result.level, "low");
  assert.equal(result.score, 0);
  assert.ok(result.actions.some((action) => action.id === "verifyDocuments"));
});

test("escalates multiple hiring inconsistencies to high risk", () => {
  const result = assessCandidate({
    selectedSignals: ["identityMismatch", "alternateShippingAddress", "cryptoPaymentRequest"],
  });

  assert.equal(result.level, "high");
  assert.equal(result.score, 52);
  assert.ok(result.actions.some((action) => action.id === "pauseAccess"));
  assert.ok(result.actions.some((action) => action.id === "sanctionsReview"));
});

test("does not treat crypto payroll context as a strong signal alone", () => {
  const result = assessCandidate(["cryptoPaymentRequest"]);

  assert.equal(result.level, "low");
  assert.equal(result.score, 8);
});

test("elevates claim-specific Korea verification gaps without treating nationality as a signal", () => {
  const result = assessCandidate(["claimedKoreaVerificationGap", "locationStoryWeak", "scriptedSoftQuestionFailure"]);

  assert.equal(result.level, "elevated");
  assert.equal(result.score, 38);
  assert.ok(result.actions.some((action) => action.id === "structuredInterview"));
  assert.ok(result.selectedSignals.every((signal) => !signal.label.toLowerCase().includes("nationality")));
});

test("interview prompt bank uses neutral consistency checks", () => {
  const promptText = INTERVIEW_PROMPTS.flatMap((group) => [group.title, ...group.prompts]).join(" ");

  assert.match(promptText, /claims South Korea/);
  assert.match(promptText, /not (a )?nationality tests?/i);
  assert.match(promptText, /Do not score fashion/);
  assert.match(promptText, /Do not score accent alone/);
  assert.doesNotMatch(promptText, /loyalty/i);
});

test("person appearance checks are constrained to identity consistency", () => {
  const result = assessCandidate(["personMismatchAcrossArtifacts"]);

  assert.equal(result.score, 20);
  assert.equal(result.level, "low");
  assert.ok(result.actions.some((action) => action.id === "pauseAccess"));
  assert.match(result.evidenceGaps.join(" "), /Do not score fashion/);
});

test("accent or language concerns are low-weight and require claim conflict", () => {
  const result = assessCandidate(["languageHistoryMismatch"]);

  assert.equal(result.score, 8);
  assert.equal(result.level, "low");
  assert.match(result.evidenceGaps.join(" "), /Do not score accent alone/);
  assert.ok(result.actions.some((action) => action.id === "verifyDocuments"));
});

test("critical indicators override score thresholds", () => {
  const result = assessCandidate(["repoExfiltration"]);

  assert.equal(result.level, "critical");
  assert.equal(result.score, 35);
  assert.ok(result.actions.some((action) => action.id === "incidentResponse"));
  assert.ok(result.actions.some((action) => action.id === "lawEnforcement"));
});

test("ignores unknown signal identifiers", () => {
  const result = assessCandidate(["identityMismatch", "not-real"]);

  assert.equal(result.score, 20);
  assert.deepEqual(
    result.selectedSignals.map((signal) => signal.id),
    ["identityMismatch"],
  );
});
