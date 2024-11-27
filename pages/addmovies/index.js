import { useState } from "react";
import axios from "axios";

const inputStyle =
  "w-full border border-gray-700 bg-[#21263F] py-2 px-4 rounded text-sm text-white";
const labelStyle = "text-sm font-medium text-gray-400";
const buttonStyle =
  "w-full bg-[#4E7BEE] py-2 text-sm font-semibold rounded mt-4";
const formContainerStyle = "flex flex-col gap-y-6";

export default function AddMovie() {
  const [formData, setFormData] = useState({
    title: "",
    language: "",
    release_date: "",
    description: "",
    genres: "",
    poster: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make API call to add the movie
      const response = await axios.post("/api/add-movie", formData);

      setMessage(response.data.message);
      setError("");
      setFormData({
        title: "",
        language: "",
        release_date: "",
        description: "",
        genres: "",
        poster: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred while adding the movie."
      );
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-[#070C1B] px-4 text-white">
      <div className="w-full max-w-lg bg-[#070C1B] rounded-lg">
        <h1 className="text-4xl text-center font-bold mb-6">Add Movie</h1>
        <form onSubmit={handleSubmit} className={formContainerStyle}>
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className={labelStyle}>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          {/* Language */}
          <div className="flex flex-col gap-1">
            <label htmlFor="language" className={labelStyle}>
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={inputStyle}
              placeholder="e.g., EN, TH, EN/TH"
              required
            />
          </div>

          {/* Release Date */}
          <div className="flex flex-col gap-1">
            <label htmlFor="release_date" className={labelStyle}>
              Release Date
            </label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className={labelStyle}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`${inputStyle} resize-none h-24`}
              required
            ></textarea>
          </div>

          {/* Genres */}
          <div className="flex flex-col gap-1">
            <label htmlFor="genres" className={labelStyle}>
              Genres (comma-separated, e.g., Action, Drama)
            </label>
            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              className={inputStyle}
              placeholder="e.g., Action, Drama"
              required
            />
          </div>

          {/* Poster */}
          <div className="flex flex-col gap-1">
            <label htmlFor="poster" className={labelStyle}>
              Poster URL
            </label>
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className={buttonStyle}>
            Add Movie
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