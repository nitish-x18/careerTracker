
function compareApplications(a, b) {
  if (a.priorityScore !== b.priorityScore) {
    return b.priorityScore - a.priorityScore;
  }

  const deadlineA = Date.parse(a.deadline);
  const deadlineB = Date.parse(b.deadline);

  if (deadlineA !== deadlineB) {
    return deadlineA - deadlineB;
  }

  const createdA = Date.parse(a.createdAt);
  const createdB = Date.parse(b.createdAt);

  if (createdA !== createdB) {
    return createdA - createdB;
  }

  return String(a.applicationId).localeCompare(
    String(b.applicationId)
  );
}

function validateApplication(application) {
  if (!application || typeof application.applicationId !== "string" ||
      !application.applicationId.trim()) {
    throw new Error("applicationId is required");
  }

  if (!Number.isFinite(application.priorityScore)) {
    throw new Error("priorityScore must be a finite number");
  }

  if (!Number.isFinite(Date.parse(application.deadline))) {
    throw new Error("A valid deadline is required");
  }

  if (!Number.isFinite(Date.parse(application.createdAt))) {
    throw new Error("A valid createdAt date is required");
  }
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  push(application) {
    validateApplication(application);

    this.heap.push(application);
    let index = this.heap.length - 1;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      if (compareApplications(
        this.heap[index],
        this.heap[parent]
      ) >= 0) {
        break;
      }

      [this.heap[index], this.heap[parent]] =
        [this.heap[parent], this.heap[index]];

      index = parent;
    }
  }

  peek() {
    return this.heap[0] ?? null;
  }

  pop() {
    if (this.heap.length === 0) return null;

    const highest = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      let index = 0;

      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let best = index;

        if (left < this.heap.length &&
            compareApplications(
              this.heap[left], this.heap[best]
            ) < 0) {
          best = left;
        }

        if (right < this.heap.length &&
            compareApplications(
              this.heap[right], this.heap[best]
            ) < 0) {
          best = right;
        }

        if (best === index) break;

        [this.heap[index], this.heap[best]] =
          [this.heap[best], this.heap[index]];

        index = best;
      }
    }

    return highest;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

export { PriorityQueue, compareApplications };
