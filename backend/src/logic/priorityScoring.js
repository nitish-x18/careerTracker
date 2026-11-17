
const DEADLINE_SCORES = [
  { maxDays: 0, score: 50 },
  { maxDays: 3, score: 40 },
  { maxDays: 7, score: 30 },
  { maxDays: 14, score: 20 },
  { maxDays: Infinity, score: 10 }
];

const PROGRESS_SCORES = {
  saved: 0,
  applied: 10,
  interview: 20
};

function getDeadlineScore(daysRemaining) {
  if (!Number.isInteger(daysRemaining)) {
    throw new Error("daysRemaining must be an integer");
  }

  return DEADLINE_SCORES.find(
    item => daysRemaining <= item.maxDays
  ).score;
}

function calculatePriorityScore({
  daysRemaining,
  matchedSkills,
  requiredSkills,
  status
}) {
  if (
    !Number.isInteger(matchedSkills) ||
    !Number.isInteger(requiredSkills) ||
    requiredSkills < 0 ||
    matchedSkills < 0 ||
    matchedSkills > requiredSkills
  ) {
    throw new Error("Invalid skill counts");
  }

  const normalizedStatus = String(status).toLowerCase();

  if (!Object.hasOwn(PROGRESS_SCORES, normalizedStatus)) {
    throw new Error("Unsupported active application status");
  }

  const deadlineScore = getDeadlineScore(daysRemaining);

  const skillScore = requiredSkills === 0
    ? 0
    : (matchedSkills / requiredSkills) * 30;

  const progressScore = PROGRESS_SCORES[normalizedStatus];

  return Number(
    (deadlineScore + skillScore + progressScore).toFixed(2)
  );
}

export {
  calculatePriorityScore,
  getDeadlineScore
};
