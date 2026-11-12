import { api } from "./api";

const JOBS_ENDPOINT = "/api/jobs";
const APPLICATIONS_ENDPOINT = "/api/applications";
const RESUMES_ENDPOINT = "/api/resumes";
const PROFILE_ENDPOINT = "/api/profile";

export const eligibilityService = {
  // Fetch all available jobs
  getJobs: async () => {
    const response = await api.get(JOBS_ENDPOINT);
    return response.data.jobs || [];
  },

  // Fetch logged-in user's applications
  getApplications: async () => {
    const response = await api.get(APPLICATIONS_ENDPOINT);
    return response.data.applications || [];
  },

  // Fetch logged-in user's resumes
  getResumes: async () => {
    const response = await api.get(RESUMES_ENDPOINT);
    return response.data.resumes || [];
  },

  // Fetch logged-in user's profile
  getProfile: async () => {
    const response = await api.get(PROFILE_ENDPOINT);
    return response.data.profile || null;
  },

  // Fetch skills required for a particular job
  getJobSkills: async (jobId) => {
    const response = await api.get(
      `${JOBS_ENDPOINT}/${encodeURIComponent(jobId)}/skills`
    );

    return response.data.skills || [];
  },

  // Fetch skills associated with a particular resume
  getResumeSkills: async (resumeId) => {
    const response = await api.get(
      `${RESUMES_ENDPOINT}/${encodeURIComponent(resumeId)}/skills`
    );

    return response.data.skills || [];
  },
};