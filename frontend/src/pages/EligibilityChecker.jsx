import { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function EligibilityChecker() {
  const [formData, setFormData] = useState({
    cgpa: "",
    graduationYear: "",
    backlogs: "0",
    experience: "Fresher",
    skills: "",
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    const cgpa = Number(formData.cgpa);
    const year = Number(formData.graduationYear);
    const backlogs = Number(formData.backlogs);

    if (formData.cgpa.trim() === "" || !Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10) {
      newErrors.cgpa = "Enter a CGPA between 0 and 10.";
    }

    if (
      formData.graduationYear.trim() === "" ||
      !Number.isInteger(year) ||
      year < 2000 ||
      year > 2100
    ) {
      newErrors.graduationYear = "Enter a valid graduation year.";
    }

    if (
      formData.backlogs.trim() === "" ||
      !Number.isInteger(backlogs) ||
      backlogs < 0
    ) {
      newErrors.backlogs = "Enter zero or a positive whole number.";
    }

    if (formData.skills.trim() === "") {
      newErrors.skills = "Enter at least one skill.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setResult(null);
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Temporary eligibility rules for UI development only.
    // Replace these rules with the actual job criteria or backend API.
    const cgpa = Number(formData.cgpa);
    const backlogs = Number(formData.backlogs);

    const eligible = cgpa >= 6.0 && backlogs === 0;

    setResult({
      eligible,
      message: eligible
        ? "You meet the sample eligibility criteria."
        : "You do not meet all the sample eligibility criteria.",
      criteria: [
        {
          label: "Minimum CGPA of 6.0",
          passed: cgpa >= 6.0,
        },
        {
          label: "No active backlogs",
          passed: backlogs === 0,
        },
      ],
    });

    setIsLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-sm text-gray-500">
          Workspace / Eligibility Checker
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Eligibility Checker
        </h1>

        <p className="mt-2 text-gray-500">
          Enter your details to check them against sample eligibility criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900">
            Your Academic Details
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Complete all required fields to check eligibility.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label
                htmlFor="cgpa"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                CGPA (out of 10)
              </label>

              <Input
                id="cgpa"
                name="cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.5"
                aria-invalid={Boolean(errors.cgpa)}
                aria-describedby={errors.cgpa ? "cgpa-error" : undefined}
              />

              {errors.cgpa && (
                <p id="cgpa-error" className="mt-1 text-sm text-red-600">
                  {errors.cgpa}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="graduationYear"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Graduation Year
              </label>

              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min="2000"
                max="2100"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2028"
                aria-invalid={Boolean(errors.graduationYear)}
                aria-describedby={
                  errors.graduationYear ? "year-error" : undefined
                }
              />

              {errors.graduationYear && (
                <p id="year-error" className="mt-1 text-sm text-red-600">
                  {errors.graduationYear}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="backlogs"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Active Backlogs
              </label>

              <Input
                id="backlogs"
                name="backlogs"
                type="number"
                min="0"
                step="1"
                value={formData.backlogs}
                onChange={handleChange}
                aria-invalid={Boolean(errors.backlogs)}
                aria-describedby={
                  errors.backlogs ? "backlogs-error" : undefined
                }
              />

              {errors.backlogs && (
                <p id="backlogs-error" className="mt-1 text-sm text-red-600">
                  {errors.backlogs}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="experience"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Experience Level
              </label>

              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Fresher">Fresher</option>
                <option value="Internship">Internship Experience</option>
                <option value="Experienced">Experienced</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="skills"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Skills
              </label>

              <Input
                id="skills"
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. C++, Python, HTML"
                aria-invalid={Boolean(errors.skills)}
                aria-describedby={errors.skills ? "skills-error" : undefined}
              />

              {errors.skills && (
                <p id="skills-error" className="mt-1 text-sm text-red-600">
                  {errors.skills}
                </p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Checking..." : "Check Eligibility"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900">
            Eligibility Results
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your results will appear here after you submit the form.
          </p>

          {!result && (
            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="font-medium text-gray-700">
                No results yet
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Complete the form to see which sample criteria you meet.
              </p>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-5">
              <div
                className={`rounded-xl p-5 ${
                  result.eligible
                    ? "border border-green-200 bg-green-50"
                    : "border border-red-200 bg-red-50"
                }`}
              >
                <h3
                  className={`text-lg font-semibold ${
                    result.eligible ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.eligible ? "Eligible (Sample)" : "Not Eligible (Sample)"}
                </h3>

                <p className="mt-2 text-sm text-gray-700">
                  {result.message}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Criteria Breakdown
                </h3>

                <div className="mt-3 space-y-3">
                  {result.criteria.map((criterion) => (
                    <div
                      key={criterion.label}
                      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
                    >
                      <span className="text-sm text-gray-700">
                        {criterion.label}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          criterion.passed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {criterion.passed ? "Passed" : "Not met"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <p className="text-sm text-gray-500">
        Demo only: eligibility is calculated using sample CGPA and backlog
        rules. Graduation year, experience, and skills are collected but are
        not yet used in the sample decision. Actual criteria must come from the
        job requirements or backend API.
      </p>
    </div>
  );
}

export default EligibilityChecker;