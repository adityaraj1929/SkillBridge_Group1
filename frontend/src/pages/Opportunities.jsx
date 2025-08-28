import { useEffect, useState } from "react";
import axios from "axios";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/api/opportunities");
      setOpportunities(res.data);
    };
    fetchData();
  }, []);

  const apply = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/applications/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Available Opportunities</h2>
      <div className="grid gap-6">
        {opportunities.map((op) => (
          <div key={op._id} className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{op.title}</h3>
            <p className="text-gray-600">{op.description}</p>
            <p className="text-sm text-gray-500 mt-2">📍 {op.location} | ⏳ {op.duration}</p>
            <button
              onClick={() => apply(op._id)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
