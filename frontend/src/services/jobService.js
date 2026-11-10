
import { api } from "./api";

export const jobService = {
  getAllJobs: async () => {
    const response = await api.get("/api/jobs");
    return response.data.jobs || [];
  },
};
