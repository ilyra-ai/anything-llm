import React, { useState } from "react";
import { API_BASE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import showToast from "@/utils/toast";

export default function AuthRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .catch(() => ({ user: null }));
    setLoading(false);
    if (res?.user) {
      showToast("Registration successful", "success");
      navigate("/auth/login");
    } else {
      showToast(res?.error || "Registration failed", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className="border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Password"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white rounded p-2"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
