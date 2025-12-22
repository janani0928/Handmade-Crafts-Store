// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  // ---------------- STATES ----------------
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "addresses"

  // Addresses
  const [addressList, setAddressList] = useState([]);
  const [visibleAddresses, setVisibleAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Price details
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // ---------------- FETCH ADDRESSES ----------------
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/users/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddressList(res.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  // ---------------- VISIBLE ADDRESSES ----------------
  useEffect(() => {
    if (showAll) setVisibleAddresses(addressList);
    else setVisibleAddresses(addressList.slice(0, 2));
  }, [showAll, addressList]);

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- SAVE PROFILE ----------------
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
          email: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // ---------------- HELPER ----------------
  const formatPrice = (amount) => amount.toLocaleString("en-IN");

  const goNext = () => {
    toast.success("Deliver here clicked!");
    // Logic for proceeding to checkout
  };

  if (loading) return <div>Loading...</div>;

  // ---------------- RENDER ----------------
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", backgroundColor: "#f5f5f5", padding: "20px" }}>
        <h3>Hello, {user.firstName || "User"}</h3>

        <div style={{ marginTop: "30px" }}>
          <div
            onClick={() => navigate("/my-orders")}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            MY ORDERS
          </div>

          <div style={{ marginTop: "15px" }}>
            <b>ACCOUNT SETTINGS</b>
            <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
              <div
                onClick={() => setActiveTab("profile")}
                style={{
                  cursor: "pointer",
                  color: activeTab === "profile" ? "blue" : "black",
                  marginBottom: "5px",
                }}
              >
                Profile Information
              </div>
              <div
                onClick={() => setActiveTab("addresses")}
                style={{
                  cursor: "pointer",
                  color: activeTab === "addresses" ? "blue" : "black",
                  marginBottom: "5px",
                }}
              >
                Manage Addresses
              </div>
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
        {/* ---------- PROFILE TAB ---------- */}
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
          </>
        )}

        {/* ---------- ADDRESSES TAB ---------- */}
    {/* ---------- ADDRESSES TAB ---------- */}
{activeTab === "addresses" && (
  <>
    <h2>Manage Addresses</h2>
    {visibleAddresses.map((a, index) => {
      const isSelected = selected === index;
      return (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            backgroundColor: isSelected ? "#e0f7fa" : "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setSelected(index)}
        >
          <div>
            <strong>{a.name}</strong> ({a.phone})
            <div>
              {a.address}, {a.city}, {a.state} – <strong>{a.pincode}</strong>
            </div>
          </div>

          {isSelected && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={(e) => { e.stopPropagation(); goNext(); }}>
                DELIVER HERE
              </button>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/add-address", {
                    state: { address: addressList[selected], isEdit: true },
                  });
                }}
                style={{ color: "#ff4081", cursor: "pointer", fontWeight: 600 }}
              >
                EDIT
              </span>
            </div>
          )}
        </div>
      );
    })}

    {!showAll && addressList.length > 2 && (
      <div
        style={{ cursor: "pointer", color: "blue", marginBottom: "10px" }}
        onClick={() => setShowAll(true)}
      >
        ▼ View all {addressList.length} addresses
      </div>
    )}

    <div
      style={{ cursor: "pointer", color: "green" }}
      onClick={() => navigate("/add-address")}
    >
      + Add a new address
    </div>
  </>
)}

    </div>
  );
};

export default ProfilePage;
