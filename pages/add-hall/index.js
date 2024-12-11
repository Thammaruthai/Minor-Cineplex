import { useState, useEffect } from "react";
import axios from "axios";

const inputStyle =
  "w-full border border-gray-700 bg-[#21263F] py-3 px-4 rounded text-sm text-white";
const labelStyle = "text-sm font-medium text-gray-400";
const buttonStyle =
  "w-full bg-[#4E7BEE] py-2 text-sm font-semibold rounded mt-4";
const formContainerStyle = "flex flex-col gap-y-6";

export default function AddHall() {
  // for selector
  const [cities, setCities] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  // Form data
  const [formData, setFormData] = useState({
    city: "",
    cinema: "",
  });

  // Status is New one?
  const [createNewCity, setCreateNewCity] = useState(false);
  const [createNewCinema, setCreateNewCinema] = useState(false);

  //Input for new one!
  const [newCity, setNewCity] = useState("");
  const [newCinema, setNewCinema] = useState("");
  const [newHall, setNewHall] = useState("");
  const [newSeatCapacity, setNewSeatCapacity] = useState("");

  // Status
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing cities on page load
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/add-hall/cities");
        setCities(response.data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // Fetch cinemas when a city is selected
  useEffect(() => {
    if (formData.city && !createNewCity) {
      const fetchCinemas = async () => {
        try {
          const response = await axios.get(
            `/api/add-hall/cinemas?cityName=${formData.city}`
          );
          setCinemas(response.data);
        } catch (err) {
          console.error("Error fetching cinemas:", err);
        }
      };
      fetchCinemas();
    } else {
      setCinemas([]); // Clear cinemas when creating a new city
    }
  }, [formData.city, createNewCity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    if (name === "city") {
      if (value === "create_new") {
        setCreateNewCity(true);
        setNewCity("");
        setNewCinema("");
        setFormData((prev) => ({ ...prev, city: "", cinema: "" }));
      } else {
        setCreateNewCity(false);
        setFormData((prev) => ({ ...prev, city: value, cinema: "" }));
      }
    } else if (name === "cinema") {
      if (value === "create_new") {
        setCreateNewCinema(true);
        setNewCinema("");
        setFormData((prev) => ({ ...prev, cinema: "" }));
      } else {
        setCreateNewCinema(false);
        setFormData((prev) => ({ ...prev, cinema: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddHall = async (e) => {
    e.preventDefault();

    // Validation for new city/cinema/hall creation
    if (
      createNewCity &&
      (!newCity || !newCinema || !newHall || !newSeatCapacity)
    ) {
      setError(
        "Please fill in all required fields for City, Cinema, Hall, and Seat Capacity."
      );
      return;
    }

    if (
      !createNewCity &&
      createNewCinema &&
      (!newCinema || !newHall || !newSeatCapacity)
    ) {
      setError(
        "Please fill in all required fields for Cinema, Hall, and Seat Capacity."
      );
      return;
    }

    if (
      !createNewCity &&
      !createNewCinema &&
      (!formData.city || !formData.cinema || !newHall || !newSeatCapacity)
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const data = {
        city: createNewCity ? newCity : formData.city,
        cinema: createNewCity || createNewCinema ? newCinema : formData.cinema,
        hall: newHall,
        seatCapacity: newSeatCapacity,
        createdBy: 7, // Admin user ID
      };
      console.log(data);

      const response = await axios.post("/api/addhall/add-hall", data);

      setMessage(response.data.message);
      setError("");
      setFormData({ city: "", cinema: "", hall: "", seatCapacity: "" });
      setNewCity("");
      setNewCinema("");
      setNewHall("");
      setNewSeatCapacity("");
      setCreateNewCity(false);
      setCreateNewCinema(false);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-[#070C1B] px-4 text-white pt-12 min-h-[690px] pb-6">
      <div className="w-full max-w-lg rounded-lg p-6">
        <h1 className="text-4xl text-center font-bold mb-6">Add Hall</h1>
        <form onSubmit={handleAddHall} className={formContainerStyle}>
          {/* City */}
          <div className="flex flex-col gap-1">
            <label htmlFor="city" className={labelStyle}>
              City
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_name}>
                  {city.city_name}
                </option>
              ))}
              <option value="create_new">Create New</option>
            </select>
            {createNewCity && (
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className={`${inputStyle} mt-2`}
                placeholder="Enter new city name"
                required
              />
            )}
          </div>

          {/* Cinema */}
          <div className="flex flex-col gap-1">
            <label htmlFor="cinema" className={labelStyle}>
              Cinema
            </label>
            {(!createNewCity || !createNewCinema) && (
              <select
                name="cinema"
                value={formData.cinema}
                onChange={handleChange}
                className={inputStyle}
                disabled={!formData.city}
              >
                <option value="">Select a cinema</option>
                {cinemas.map((cinema) => (
                  <option key={cinema.cinema_id} value={cinema.name}>
                    {cinema.name}
                  </option>
                ))}
                <option value="create_new">Create New</option>
              </select>
            )}
            {(createNewCity || createNewCinema) && (
              <input
                type="text"
                value={newCinema}
                onChange={(e) => setNewCinema(e.target.value)}
                className={`${inputStyle} mt-2`}
                placeholder="Enter new cinema name"
                required
              />
            )}
          </div>

          {/* Hall */}
          <div className="flex flex-col gap-1">
            <label htmlFor="hall" className={labelStyle}>
              Hall Name
            </label>
            <input
              type="text"
              value={newHall}
              onChange={(e) => setNewHall(e.target.value)}
              className={inputStyle}
              placeholder="Enter hall name"
              required
            />
          </div>

          {/* Seat Capacity */}
          <div className="flex flex-col gap-1">
            <label htmlFor="seatCapacity" className={labelStyle}>
              Seat Capacity
            </label>
            <input
              type="number"
              value={newSeatCapacity}
              onChange={(e) => {
                setNewSeatCapacity(e.target.value);
              }}
              className={inputStyle}
              placeholder="Enter seat capacity"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className={buttonStyle}>
            Add Hall
          </button>

          {/* Messages */}
          {message && (
            <p className="text-green-400 text-center mt-4">{message}</p>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}
