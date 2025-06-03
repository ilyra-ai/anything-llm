import React, { useEffect, useState } from "react";
import Plan from "@/models/plan";
import showToast from "@/utils/toast";

interface PlanType {
  id: number;
  name: string;
  price?: number;
  description?: string;
}

export default function PlanManager() {
  const [plans, setPlans] = useState<PlanType[]>([]);

  useEffect(() => {
    async function fetchPlans() {
      const results = await Plan.all();
      setPlans(results);
    }
    fetchPlans();
  }, []);

  const handleUpgrade = async (id: number) => {
    const { success, error } = await Plan.change(id);
    if (success) {
      showToast("Plan updated", "success");
    } else {
      showToast(error || "Failed to update plan", "error");
    }
  };

  return (
    <div className="space-y-4">
      {plans.map((p) => (
        <div
          key={p.id}
          className="border p-4 rounded flex items-center justify-between"
        >
          <div>
            <div className="font-bold">{p.name}</div>
            {p.description && (
              <div className="text-sm opacity-80">{p.description}</div>
            )}
            {typeof p.price === "number" && (
              <div className="text-sm">${p.price}</div>
            )}
          </div>
          <button
            onClick={() => handleUpgrade(p.id)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Upgrade
          </button>
        </div>
      ))}
    </div>
  );
}
