import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Plan = {
  all: async () => {
    return fetch(`${API_BASE}/plans`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.plans || [])
      .catch(() => []);
  },
  change: async (planId) => {
    return fetch(`${API_BASE}/plans/change/${planId}`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },
};

export default Plan;
