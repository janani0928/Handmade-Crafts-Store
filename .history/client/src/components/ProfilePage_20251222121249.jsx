// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save profile
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          mobile: user.mobile,
          email
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", backgroundColor: "#f5f5f5", padding: "20px" }}>
        <h3>Hello, {user.firstName}</h3>

        <div style={{ marginTop: "30px" }}>
          <div  onClick={() =>
              navigate("/my-orders")}><b>MY ORDERS</b></div>

          <div style={{ marginTop: "15px" }}>
            <b>ACCOUNT SETTINGS</b>
            <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
              <div>Profile Information</div>
              <div onClick={() =>
              navigate("/saved-address")}><span>
              Manage Addresses </span></div>
              <div>PAN Card Information</div>
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <b>PAYMENTS</b>
            <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
              <div>Gift Cards</div>
              <div>Saved UPI</div>
              <div>Saved Cards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>
          Personal Information{" "}
          <span
            style={{ color: "blue", cursor: "pointer", fontSize: "14px" }}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </span>
        </h2>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            readOnly={!editMode}
            placeholder="First Name"
            style={{ marginRight: "10px" }}
          />

          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            readOnly={!editMode}
            placeholder="Last Name"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          Gender:
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={user.gender === "Male"}
              onChange={handleChange}
              disabled={!editMode}
            />{" "}
            Male
          </label>

          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={user.gender === "Female"}
              onChange={handleChange}
              disabled={!editMode}
            />{" "}
            Female
          </label>
        </div>

        <h3>Email Address</h3>
        <input
          type="email"
          value={user.email}
          readOnly
          style={{ marginBottom: "10px", backgroundColor: "#eee" }}
        />

        <h3>Mobile Number</h3>
        <input
          type="text"
          name="mobile"
          value={user.mobile}
          onChange={handleChange}
          readOnly={!editMode}
        />

        {editMode && (
          <div style={{ marginTop: "20px" }}>
            <button onClick={handleSave} style={{ padding: "10px 20px" }}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
