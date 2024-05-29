// src/components/Admin.js
import { useEffect, useState } from "react";
import axios from "../axiosConfig";

const Admin = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin");
        setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    };

    fetchData();
  }, []);

  return <h2>{message}</h2>;
};

export default Admin;
