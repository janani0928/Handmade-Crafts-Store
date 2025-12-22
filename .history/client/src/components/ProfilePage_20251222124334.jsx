import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
  });

  const [addressList, setAddressList] = useState([]);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login");
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
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    if (activeTab !== "address") return;

    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          "http://localhost:5000/api/address/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAddressList(res.data.addresses || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load addresses");
      }
    };

    fetchAddresses();
  }, [activeTab]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      setEditMode(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* ================= SIDEBAR ================= */}
      <div style={{ width: "260px", background: "#f5f5f5", padding: "20px" }}>
        <h3>Hello, {user.firstName}</h3>

        <div style={{ marginTop: "30px" }}>
          <div
            style={{ cursor: "pointer", marginBottom: "10px" }}
            onClick={() => navigate("/my-orders")}
          >
            <b>MY ORDERS</b>
          </div>

          <b>ACCOUNT SETTINGS</b>
          <div style={{ paddingLeft: "10px" }}>
            <div
              style={{ cursor: "pointer", color: activeTab === "profile" ? "blue" : "" }}
              onClick={() => setActiveTab("profile")}
            >
              Profile Information
            </div>
            <div
              style={{ cursor: "pointer", color: activeTab === "address" ? "blue" : "" }}
              onClick={() => setActiveTab("address")}
            >
              Manage Addresses
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div style={{ flex: 1, padding: "30px" }}>
        {/* ===== PROFILE TAB ===== */}
        {activeTab === "profile" && (
          <>
            <h2>
              Personal Information{" "}
              <span
                style={{ color: "blue", cursor: "pointer", fontSize: "14px" }}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit"}
              </span>
            </h2>

            <input
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder="First Name"
            />
            <input
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder="Last Name"
              style={{ marginLeft: "10px" }}
            />

            <div style={{ marginTop: "10px" }}>
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

            <h4>Email</h4>
            <input value={user.email} readOnly />

            <h4>Mobile</h4>
            <input
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              readOnly={!editMode}
            />

            {editMode && (
              <button onClick={handleSave} style={{ marginTop: "15px" }}>
                Save Changes
              </button>
            )}
          </>
        )}

        {/* ===== ADDRESS TAB ===== */}
       {activeTab === "address" && (
  <>
    <h2>Manage Addresses</h2>

    {addressList.map((addr) => (
      <div
        key={addr._id}
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        <b>{addr.name}</b>
        <p>
          {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
        </p>
        <p>📞 {addr.phone}</p>

        {/* EDIT */}
        <span
          style={{ color: "blue", cursor: "pointer", marginRight: "15px" }}
          onClick={() =>
            navigate("/add-address", {
              state: { address: addr, isEdit: true },
            })
          }
        >
          Edit
        </span>

        {/* DELETE */}
        <span
          style={{ color: "red", cursor: "pointer" }}
          onClick={async () => {
            const token = localStorage.getItem("token");
            if (!window.confirm("Delete this address?")) return;

            await axios.delete(
              `http://localhost:5000/api/address/delete/${addr._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            setAddressList(addressList.filter((a) => a._id !== addr._id));
            toast.success("Address deleted");
          }}
        >
          Delete
        </span>
        {a.type && (
  <span
    style={{
      marginLeft: "8px",
      background: "#e0e0e0",
      padding: "2px 6px",
      fontSize: "11px",
      borderRadius: "4px",
    }}
  >
    {a.type}
  </span>
)}

      </div>
    ))}

    {/* ADD NEW */}
    <button onClick={() => navigate("/add-address")}>
      + Add New Address
    </button>
  </>
)}
</div>
    </div>
  );
};

export default ProfilePage;
