// src/components/Protected.js
import { useEffect, useState } from "react";
import axios from "../axiosConfig";

const Protected = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/protected");
        setMessage(response.data.logged_in_as.username);
      } catch (error) {
        console.error("Error fetching protected data", error);
      }
    };

    fetchData();
  }, []);

  return <h2>Protected Content: {message}</h2>;
};

export default Protected;
