
import { api } from "./api";

// API endpoint backend team ke contract ke mutabik set karna hai.
const ELIGIBILITY_ENDPOINT = "/api/eligibility";

export const eligibilityService = {
  check: (profileData) =>
    api.post(ELIGIBILITY_ENDPOINT, profileData),

  getMyEligibility: () =>
    api.get(ELIGIBILITY_ENDPOINT),
};
