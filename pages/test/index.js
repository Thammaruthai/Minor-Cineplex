import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from("halls").select("*");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Data fetched:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div>
      <h1>Test Supabase</h1>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
