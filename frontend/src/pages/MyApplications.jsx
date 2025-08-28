import { useEffect, useState } from "react";
import axios from "axios";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-700">My Applications</h2>
      <div className="grid gap-6">
        {applications.map((app) => (
          <div key={app._id} className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">{app.opportunityId?.title}</h3>
            <p className="text-gray-600">{app.opportunityId?.description}</p>
            <p className="text-sm mt-2">📍 {app.opportunityId?.location} | ⏳ {app.opportunityId?.duration}</p>
            <p className={`mt-2 font-semibold ${app.status === "accepted" ? "text-green-600" : app.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>
              Status: {app.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
