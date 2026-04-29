import assert from "node:assert/strict";
import test from "node:test";
import { assessCandidate } from "../src/scoring.js";

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
  assert.equal(result.score, 64);
  assert.ok(result.actions.some((action) => action.id === "pauseAccess"));
  assert.ok(result.actions.some((action) => action.id === "sanctionsReview"));
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
