
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

    // Validate every student skill before filtering.
    const normalizedStudentSkills = studentSkills.map(skill => ({
        name: normalizeSkillName(skill?.name),
        verified: Number(skill?.verified) === 1
    }));

    // Only verified student skills count toward matching.
    const verifiedStudentSkills = normalizedStudentSkills
        .filter(skill => skill.verified)
        .map(skill => skill.name);

    // Only required job skills are considered.
    const requiredSkills = jobSkills.filter(
        skill => Number(skill?.required) === 1
    );

    const studentSkillSet = new Set(verifiedStudentSkills);

    const matchedSkills = [];
    const missingSkills = [];
    const seenRequired = new Set();

    for (const skill of requiredSkills) {
        const name = normalizeSkillName(skill?.name);

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
        matchPercentage:
            total === 0
                ? null
                : Number(
                    ((matchedSkills.length / total) * 100).toFixed(2)
                )
    };
}

export { compareSkills };
