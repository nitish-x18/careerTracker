
function checkEligibility(student, job) {
    if (!student || !job) {
        throw new Error("Student and job data are required");
    }

    const reasons = [];
    const unverified = [];

    // 1. CGPA eligibility
    if (job.min_cgpa != null) {
        const minimumCGPA = Number(job.min_cgpa);

        if (!Number.isFinite(minimumCGPA)) {
            throw new Error("Job minimum CGPA is invalid");
        }

        if (student.cgpa == null || student.cgpa === "") {
            unverified.push("Student CGPA is missing");
        } else {
            const studentCGPA = Number(student.cgpa);

            if (!Number.isFinite(studentCGPA)) {
                unverified.push("Student CGPA is invalid");
            } else if (studentCGPA < minimumCGPA) {
                reasons.push("Minimum CGPA requirement not met");
            }
        }
    }

    // 2. Degree eligibility
    if (job.required_degree != null && job.required_degree !== "") {
        if (!student.degree) {
            unverified.push("Student degree is missing");
        } else if (
            String(student.degree).trim().toLowerCase() !==
            String(job.required_degree).trim().toLowerCase()
        ) {
            reasons.push("Required degree does not match");
        }
    }

    // 3. Branch / major eligibility
    if (job.required_major != null && job.required_major !== "") {
        if (!student.major) {
            unverified.push("Student branch/major is missing");
        } else if (
            String(student.major).trim().toLowerCase() !==
            String(job.required_major).trim().toLowerCase()
        ) {
            reasons.push("Required branch/major does not match");
        }
    }

    // 4. Graduation year eligibility
    if (job.min_grad_year != null || job.max_grad_year != null) {
        const graduationYear = Number(student.grad_year);

        if (
            student.grad_year == null ||
            student.grad_year === "" ||
            !Number.isInteger(graduationYear)
        ) {
            unverified.push("Student graduation year is missing or invalid");
        } else {
            if (
                job.min_grad_year != null &&
                graduationYear < Number(job.min_grad_year)
            ) {
                reasons.push("Graduation year is earlier than allowed");
            }

            if (
                job.max_grad_year != null &&
                graduationYear > Number(job.max_grad_year)
            ) {
                reasons.push("Graduation year is later than allowed");
            }
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
