
function normalizeSkillName(name) {
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Skill name must be a non-empty string");
  }

  return name.trim().toLowerCase();
}

function compareSkills(studentSkills, jobSkills) {
  if (!Array.isArray(studentSkills) || !Array.isArray(jobSkills)) {
    throw new Error("Student and job skills must be arrays");
  }

  // Only required job skills count toward the match percentage.
  const requiredSkills = jobSkills.filter(
    skill => Number(skill.required) === 1
  );

  const studentSkillSet = new Set(
    studentSkills.map(skill => normalizeSkillName(skill.name))
  );

  const matchedSkills = [];
  const missingSkills = [];

  // De-duplicate required skills by normalized name.
  const seenRequired = new Set();

  for (const skill of requiredSkills) {
    const name = normalizeSkillName(skill.name);

    if (seenRequired.has(name)) continue;
    seenRequired.add(name);

    if (studentSkillSet.has(name)) {
      matchedSkills.push(name);
    } else {
      missingSkills.push(name);
    }
  }

  const total = matchedSkills.length + missingSkills.length;

  return {
    matchedSkills,
    missingSkills,
    matchedCount: matchedSkills.length,
    missingCount: missingSkills.length,
    totalRequiredSkills: total,
    matchPercentage: total === 0
      ? null
      : Number(((matchedSkills.length / total) * 100).toFixed(2))
  };
}

export { compareSkills };
