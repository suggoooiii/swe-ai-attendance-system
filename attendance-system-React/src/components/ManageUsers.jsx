// src/components/ManageUsers.js
import { useState, useEffect } from "react";
import axios from "../axiosConfig";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  const updateRole = async (username, role) => {
    try {
      const response = await axios.post("/update_role", { username, role });
      setMessage(response.data.message);
      const updatedUsers = users.map((user) => {
        if (user.username === username) {
          return { ...user, role };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating role", error);
      setMessage("Error updating role");
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      {message && <p>{message}</p>}
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            {user.username} - {user.role}
            <select
              onChange={(e) => updateRole(user.username, e.target.value)}
              value={user.role}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
