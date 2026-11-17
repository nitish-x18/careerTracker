
import test from "node:test";
import assert from "node:assert/strict";

import {
  calculatePriorityScore,
  getDeadlineScore
} from "../src/logic/priorityScoring.js";

test("calculates priority without an interest-level field", () => {
  const score = calculatePriorityScore({
    daysRemaining: 2,
    matchedSkills: 3,
    requiredSkills: 4,
    status: "applied"
  });

  assert.equal(score, 72.5);
});

test("deadline score is highest when due today", () => {
  assert.equal(getDeadlineScore(0), 50);
});

test("rejects invalid skill counts", () => {
  assert.throws(() => calculatePriorityScore({
    daysRemaining: 2,
    matchedSkills: 5,
    requiredSkills: 4,
    status: "applied"
  }));
});

test("rejects unsupported statuses", () => {
  assert.throws(() => calculatePriorityScore({
    daysRemaining: 2,
    matchedSkills: 2,
    requiredSkills: 4,
    status: "rejected"
  }));
});

test("returns a valid score when no skills are required", () => {
  assert.equal(calculatePriorityScore({
    daysRemaining: 10,
    matchedSkills: 0,
    requiredSkills: 0,
    status: "saved"
  }), 20);
});
