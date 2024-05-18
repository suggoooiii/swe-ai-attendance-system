// src/CheckIn.jsx
import { useState } from "react";
import axios from "axios";

const CheckIn = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/checkin",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(
        response.data.status === "success"
          ? "Check-in successful!"
          : "Check-in failed: " + response.data.reason
      );
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div>
      <h1>Student Check-In</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Check In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CheckIn;
