
import test from "node:test";
import assert from "node:assert/strict";

import { PriorityQueue } from "../src/logic/priorityQueue.js";

function application(id, score, deadline = null) {
    return {
        applicationId: id,
        priorityScore: score,
        deadline
    };
}

test("highest priority score comes first", () => {
    const queue = new PriorityQueue();

    queue.push(application("A1", 60, "2026-11-10"));
    queue.push(application("A2", 90, "2026-11-15"));
    queue.push(application("A3", 75, "2026-11-05"));

    assert.equal(queue.pop().applicationId, "A2");
    assert.equal(queue.pop().applicationId, "A3");
    assert.equal(queue.pop().applicationId, "A1");
});

test("equal scores use the earlier deadline", () => {
    const queue = new PriorityQueue();

    queue.push(application("A1", 80, "2026-11-15"));
    queue.push(application("A2", 80, "2026-11-05"));

    assert.equal(queue.pop().applicationId, "A2");
});

test("applications with deadlines come before missing deadlines", () => {
    const queue = new PriorityQueue();

    queue.push(application("A1", 80, null));
    queue.push(application("A2", 80, "2026-11-05"));

    assert.equal(queue.pop().applicationId, "A2");
    assert.equal(queue.pop().applicationId, "A1");
});

test("application ID resolves ties when deadlines are equal", () => {
    const queue = new PriorityQueue();

    queue.push(application("A2", 80, "2026-11-05"));
    queue.push(application("A1", 80, "2026-11-05"));

    assert.equal(queue.pop().applicationId, "A1");
});

test("empty queue returns null", () => {
    const queue = new PriorityQueue();

    assert.equal(queue.pop(), null);
    assert.equal(queue.peek(), null);
    assert.equal(queue.isEmpty(), true);
});

test("invalid application score is rejected", () => {
    const queue = new PriorityQueue();

    assert.throws(() => {
        queue.push(application("A1", NaN, "2026-11-05"));
    }, /priorityScore/);
});

test("invalid deadline is rejected", () => {
    const queue = new PriorityQueue();

    assert.throws(() => {
        queue.push(application("A1", 80, "not-a-date"));
    }, /deadline/);
});
