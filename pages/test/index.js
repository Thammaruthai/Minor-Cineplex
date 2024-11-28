import { useState } from "react";
import axios from "axios";

export default function TestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {

      const response = await axios.post("/api/logout");

      if (response.data.success) {

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Logout failed.");
      }
    } catch (error) {
      alert("Failed to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/test", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setData(result.data);
      } else {
        console.error("Error fetching data:", result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Test Supabase</h1>
      <button onClick={fetchData}>Fetch Data</button>
      {data && (
        <div>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button className="border border-red-500" onClick={handleLogout}>
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
