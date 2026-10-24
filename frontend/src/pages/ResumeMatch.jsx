import { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const mockResumeMatch = {
  candidateName: "Your Profile",
  jobTitle: "Frontend Developer",
  company: "Sample Company",
  matchScore: 75,
  matchedSkills: [
    { name: "HTML", level: "Matched" },
    { name: "CSS", level: "Matched" },
    { name: "JavaScript", level: "Matched" },
    { name: "React", level: "Matched" },
    { name: "Git & GitHub", level: "Matched" },
  ],
  missingSkills: [
    { name: "TypeScript", importance: "High" },
    { name: "Testing", importance: "Medium" },
    { name: "Accessibility", importance: "Medium" },
  ],
};

function ResumeMatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchData, setMatchData] = useState(mockResumeMatch);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);

    // Temporary mock-data refresh.
    // Replace this with an API request when the backend is ready.
    setMatchData({ ...mockResumeMatch });
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <p className="text-center text-gray-600">
            Loading resume match...
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div role="alert" className="text-center">
            <p className="font-medium text-red-600">{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="p-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-800">
            No resume match available
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Add your resume and select a job to view your skill match.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Workspace / Resume Match
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Resume Match
          </h1>
          <p className="mt-2 text-gray-500">
            Compare your skills with the selected job requirements.
          </p>
        </div>

        <Button onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? "Refreshing..." : "Refresh Match"}
        </Button>
      </div>

      {/* Job information and match score */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <p className="text-sm font-medium text-gray-500">
            Selected Job
          </p>

          <h2 className="mt-2 text-xl font-semibold text-gray-900">
            {matchData.jobTitle}
          </h2>

          <p className="mt-1 text-gray-600">{matchData.company}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              {matchData.matchedSkills.length} matched skills
            </span>

            <span className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">
              {matchData.missingSkills.length} missing skills
            </span>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-medium text-gray-500">
            Overall Match Score
          </p>

          <p className="mt-3 text-4xl font-bold text-blue-600">
            {matchData.matchScore}%
          </p>

          <div
            className="mt-4 h-2 w-full rounded-full bg-gray-200"
            role="progressbar"
            aria-label="Resume match score"
            aria-valuenow={matchData.matchScore}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${matchData.matchScore}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Mock score for UI development
          </p>
        </Card>
      </div>

      {/* Skills sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Matched skills */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Matched Skills
            </h2>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              {matchData.matchedSkills.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Skills identified as matching the job requirements.
          </p>

          <div className="mt-5 space-y-3">
            {matchData.matchedSkills.length > 0 ? (
              matchData.matchedSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <span className="font-medium text-gray-800">
                    {skill.name}
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    {skill.level}
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                No matched skills found.
              </p>
            )}
          </div>
        </Card>

        {/* Missing skills */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Missing Skills
            </h2>

            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
              {matchData.missingSkills.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Skills you may need to develop for this role.
          </p>

          <div className="mt-5 space-y-3">
            {matchData.missingSkills.length > 0 ? (
              matchData.missingSkills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
                >
                  <span className="font-medium text-gray-800">
                    {skill.name}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      skill.importance === "High"
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {skill.importance} Priority
                  </span>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                No missing skills identified.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-gray-500">
        This page currently uses sample data for UI development. Skill matches
        and scores are not generated from a real resume or job description.
      </p>
    </div>
  );
}

export default ResumeMatch;