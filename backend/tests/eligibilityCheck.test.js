
import test from "node:test";
import assert from "node:assert/strict";

import { checkEligibility } from "../src/logic/eligibilityCheck.js";

test("student meets minimum CGPA", () => {
  const result = checkEligibility(
    { cgpa: 8.5 },
    { min_cgpa: 8.0 }
  );

  assert.equal(result.status, "eligible");
  assert.equal(result.eligible, true);
});

test("student fails minimum CGPA", () => {
  const result = checkEligibility(
    { cgpa: 6.5 },
    { min_cgpa: 8.0 }
  );

  assert.equal(result.status, "ineligible");
  assert.equal(result.eligible, false);
  assert.deepEqual(result.reasons, [
    "Minimum CGPA requirement not met"
  ]);
});

test("missing CGPA is marked unverified", () => {
  const result = checkEligibility(
    {},
    { min_cgpa: 8.0 }
  );

  assert.equal(result.status, "conditionally eligible");
  assert.equal(result.eligible, false);
});

test("no CGPA requirement does not block eligibility", () => {
  const result = checkEligibility(
    {},
    { min_cgpa: null }
  );

  assert.equal(result.status, "eligible");
});

test("missing student or job data is rejected", () => {
  assert.throws(() => checkEligibility(null, {}));
});
