export function getAverageAlignmentScore(applications) {
  if (applications.length === 0) {
    return 0;
  }

  const totalMatchScore = applications.reduce(
    (total, application) => total + application.match,
    0
  );

  return Math.round(totalMatchScore / applications.length);
}

export function getActiveOffers(applications) {
  return applications.filter(
    (application) => application.status === "Offer Received"
  ).length;
}

export function sortApplicationsByScore(applications) {
  return [...applications]
    .sort((first, second) => second.score - first.score)
    .map((application, index) => ({
      ...application,
      rank: index + 1,
    }));
}

export function getUrgencyLabel(applications) {
  const statuses = applications.map((application) =>
    application.status?.toLowerCase()
  );

  if (statuses.includes("critical urgency")) {
    return "High Attention";
  }

  if (statuses.includes("high urgency")) {
    return "Needs Attention";
  }

  return "On Track";
}