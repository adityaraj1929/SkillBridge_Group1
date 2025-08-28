import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
    location: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        // only send skills if volunteer
        skills:
          form.role === "volunteer"
            ? form.skills.split(",").map((s) => s.trim()).filter((s) => s)
            : [],
      };

      await axios.post("http://localhost:5000/api/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-xl font-bold text-center text-gray-700 mb-4">Register</h2>
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-3">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 mt-0.5 border rounded-lg focus:ring focus:ring-green-200 text-sm"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-1.5 mt-0.5 border rounded-lg focus:ring focus:ring-green-200 text-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 mt-0.5 border rounded-lg focus:ring focus:ring-green-200 text-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-1.5 mt-0.5 border rounded-lg focus:ring focus:ring-green-200 text-sm"
            >
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          {/* Location (for both) */}
          <div>
            <label className="block text-xs font-medium text-gray-600">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-1.5 mt-0.5 border rounded-lg focus:ring focus:ring-green-200 text-sm"
              placeholder="Enter your city"
            />
          </div>

          {/* Skills (only for volunteers) */}
          {form.role === "volunteer" && (
            <div>
              <label className="block text-xs font-medium text-gray-600">Skills</label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full px-3 py-1.5 mt-0.5 border rounded-lg focus:ring focus:ring-green-200 text-sm"
                placeholder="e.g. React, Node, Communication"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-1.5 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition text-sm"
          >
            Register
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
