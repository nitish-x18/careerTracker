
import test from "node:test";
import assert from "node:assert/strict";

import { PriorityQueue } from "../src/logic/priorityQueue.js";

function application(id, score, deadline, createdAt) {
  return {
    applicationId: id,
    priorityScore: score,
    deadline,
    createdAt
  };
}

test("highest priority score comes first", () => {
  const queue = new PriorityQueue();

  queue.push(application("A1", 60, "2026-11-10", "2026-10-01"));
  queue.push(application("A2", 90, "2026-11-15", "2026-10-02"));
  queue.push(application("A3", 75, "2026-11-05", "2026-10-03"));

  assert.equal(queue.pop().applicationId, "A2");
  assert.equal(queue.pop().applicationId, "A3");
  assert.equal(queue.pop().applicationId, "A1");
});

test("equal scores use the earlier deadline", () => {
  const queue = new PriorityQueue();

  queue.push(application("A1", 80, "2026-11-15", "2026-10-01"));
  queue.push(application("A2", 80, "2026-11-05", "2026-10-02"));

  assert.equal(queue.pop().applicationId, "A2");
});

test("equal scores and deadlines use creation time", () => {
  const queue = new PriorityQueue();

  queue.push(application("A2", 80, "2026-11-05", "2026-10-02"));
  queue.push(application("A1", 80, "2026-11-05", "2026-10-01"));

  assert.equal(queue.pop().applicationId, "A1");
});

test("application ID resolves complete ties", () => {
  const queue = new PriorityQueue();

  queue.push(application("A2", 80, "2026-11-05", "2026-10-01"));
  queue.push(application("A1", 80, "2026-11-05", "2026-10-01"));

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
    queue.push(application("A1", NaN, "2026-11-05", "2026-10-01"));
  }, /priorityScore/);
});
