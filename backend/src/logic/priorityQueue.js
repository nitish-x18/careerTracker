
function parseDeadline(deadline) {
    if (deadline == null || deadline === "") {
        return null;
    }

    const timestamp = Date.parse(deadline);

    if (!Number.isFinite(timestamp)) {
        throw new Error("deadline must be a valid date or null");
    }

    return timestamp;
}

function compareApplications(a, b) {
    // Higher priority score comes first.
    if (a.priorityScore !== b.priorityScore) {
        return b.priorityScore - a.priorityScore;
    }

    // Applications with an earlier deadline come first.
    // Missing deadlines are placed after dated applications.
    const deadlineA = parseDeadline(a.deadline);
    const deadlineB = parseDeadline(b.deadline);

    if (deadlineA === null && deadlineB !== null) return 1;
    if (deadlineA !== null && deadlineB === null) return -1;

    if (deadlineA !== deadlineB) {
        return deadlineA - deadlineB;
    }

    // Final deterministic tie-breaker.
    return a.applicationId.localeCompare(b.applicationId);
}

function validateApplication(application) {
    if (
        !application ||
        typeof application.applicationId !== "string" ||
        !application.applicationId.trim()
    ) {
        throw new Error("applicationId is required");
    }

    if (!Number.isFinite(application.priorityScore)) {
        throw new Error("priorityScore must be a finite number");
    }

    parseDeadline(application.deadline);
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

            if (
                compareApplications(
                    this.heap[index],
                    this.heap[parent]
                ) >= 0
            ) {
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

                if (
                    left < this.heap.length &&
                    compareApplications(
                        this.heap[left],
                        this.heap[best]
                    ) < 0
                ) {
                    best = left;
                }

                if (
                    right < this.heap.length &&
                    compareApplications(
                        this.heap[right],
                        this.heap[best]
                    ) < 0
                ) {
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
