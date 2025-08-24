import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login"); // redirect if not logged in
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // prevent flicker

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">🌍 SkillBridge Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome, {user.name}! 👋
        </h2>
        <p className="text-gray-600 mb-6">You are logged in as <b>{user.role}</b>.</p>

        {/* Conditional UI */}
        {user.role === "volunteer" ? (
          <div className="space-y-4">
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold">Available Opportunities</h3>
              <p className="text-gray-500">Browse and apply to NGO opportunities.</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => navigate("/opportunities")}
              >
                View Opportunities
              </button>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold">My Applications</h3>
              <p className="text-gray-500">Track your application status.</p>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                onClick={() => navigate("/my-applications")}
              >
                View Applications
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold">Post Opportunities</h3>
              <p className="text-gray-500">Create volunteer opportunities for NGOs.</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => navigate("/create-opportunity")}
              >
                Create Opportunity
              </button>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold">View Applications</h3>
              <p className="text-gray-500">Review and manage volunteer applications.</p>
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                onClick={() => navigate("/ngo-applications")}
              >
                Manage Applications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
