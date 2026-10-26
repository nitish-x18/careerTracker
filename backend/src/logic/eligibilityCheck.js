
function checkEligibility(student, job) {
  if (!student || !job) {
    throw new Error("Student and job data are required");
  }

  const reasons = [];
  const unverified = [];

  if (job.min_cgpa != null) {
    const minimumCGPA = Number(job.min_cgpa);
    const studentCGPA = Number(student.cgpa);

    if (!Number.isFinite(minimumCGPA)) {
      throw new Error("Job minimum CGPA is invalid");
    }

    if (student.cgpa == null || !Number.isFinite(studentCGPA)) {
      unverified.push("Student CGPA is missing or invalid");
    } else if (studentCGPA < minimumCGPA) {
      reasons.push("Minimum CGPA requirement not met");
    }
  }

  let status = "eligible";

  if (reasons.length > 0) {
    status = "ineligible";
  } else if (unverified.length > 0) {
    status = "conditionally eligible";
  }

  return {
    status,
    eligible: status === "eligible",
    reasons,
    unverified
  };
}

export { checkEligibility };
