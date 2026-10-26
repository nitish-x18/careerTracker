
import test from "node:test";
import assert from "node:assert/strict";

import { compareSkills } from "../src/logic/skillMatching.js";

test("matches skills and identifies missing required skills", () => {
  const studentSkills = [
    { name: "JavaScript" },
    { name: "React" },
    { name: "SQL" }
  ];

  const jobSkills = [
    { name: "JavaScript", required: 1 },
    { name: "React", required: 1 },
    { name: "Node.js", required: 1 },
    { name: "Docker", required: 0 }
  ];

  const result = compareSkills(studentSkills, jobSkills);

  assert.deepEqual(result.matchedSkills, [
    "javascript", "react"
  ]);
  assert.deepEqual(result.missingSkills, ["node.js"]);
  assert.equal(result.matchPercentage, 66.67);
});

test("skill matching ignores case and extra spaces", () => {
  const result = compareSkills(
    [{ name: "  JAVASCRIPT " }],
    [{ name: "javascript", required: 1 }]
  );

  assert.deepEqual(result.matchedSkills, ["javascript"]);
  assert.equal(result.matchPercentage, 100);
});

test("no required skills returns null percentage", () => {
  const result = compareSkills(
    [{ name: "JavaScript" }],
    [{ name: "Docker", required: 0 }]
  );

  assert.equal(result.matchPercentage, null);
  assert.deepEqual(result.missingSkills, []);
});

test("invalid skill data is rejected", () => {
  assert.throws(
    () => compareSkills([{ name: "" }], []),
    /Skill name/
  );
});
