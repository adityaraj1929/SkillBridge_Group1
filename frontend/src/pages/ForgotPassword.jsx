import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [resetURL, setResetURL] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setResetURL("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMsg(data.message || "If that email exists, a reset link has been sent.");
      if (data.resetURL) setResetURL(data.resetURL); // dev convenience
    } catch {
      setMsg("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">Forgot Password</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200"
              placeholder="you@example.com"
            />
          </div>
          <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Send reset link</button>
        </form>

        {msg && <p className="mt-4 text-sm text-gray-700">{msg}</p>}
        {resetURL && (
          <a href={resetURL} className="mt-2 block text-sm text-blue-600 underline break-all">
            Open reset link (dev)
          </a>
        )}

        <p className="mt-6 text-center text-sm">
          <a href="/login" className="text-gray-600 hover:underline">Back to login</a>
        </p>
      </div>
    </div>
  );
}
