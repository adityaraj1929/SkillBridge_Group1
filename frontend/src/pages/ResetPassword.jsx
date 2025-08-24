import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMsg("Passwords do not match");
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMsg("Password updated! Redirecting to login…");
      setTimeout(()=>navigate("/login"), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">Set a new password</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-emerald-200"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-emerald-200"
            />
          </div>
          <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Update password</button>
        </form>
        {msg && <p className="mt-4 text-sm text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}
