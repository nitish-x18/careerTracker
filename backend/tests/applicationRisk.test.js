
import test from "node:test";
import assert from "node:assert/strict";

import { classifyApplicationRisk } from "../src/logic/applicationRisk.js";

const today = new Date("2026-10-29T12:00:00Z");

test("saved application with a passed deadline is At Risk", () => {
    const result = classifyApplicationRisk(
        { status: "saved", deadline: "2026-10-28" },
        today
    );

    assert.equal(result.riskStatus, "At Risk");
});

test("saved application due within 3 days Needs Attention", () => {
    const result = classifyApplicationRisk(
        { status: "saved", deadline: "2026-11-01" },
        today
    );

    assert.equal(result.riskStatus, "Needs Attention");
});

test("saved application with a distant deadline is On Track", () => {
    const result = classifyApplicationRisk(
        { status: "saved", deadline: "2026-11-10" },
        today
    );

    assert.equal(result.riskStatus, "On Track");
});

test("missing deadline Needs Attention", () => {
    const result = classifyApplicationRisk(
        { status: "saved", deadline: null },
        today
    );

    assert.equal(result.riskStatus, "Needs Attention");
});

test("applied application due soon Needs Attention", () => {
    const result = classifyApplicationRisk(
        { status: "applied", deadline: "2026-10-30" },
        today
    );

    assert.equal(result.riskStatus, "Needs Attention");
});

test("closed application is Not Applicable", () => {
    const result = classifyApplicationRisk(
        { status: "rejected", deadline: "2026-10-28" },
        today
    );

    assert.equal(result.riskStatus, "Not Applicable");
});

test("missing application data is rejected", () => {
    assert.throws(
        () => classifyApplicationRisk(null, today),
        /Application data is required/
    );
});
