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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
      } catch {
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddressList(res.data.addresses || []);
      } catch {
        toast.error("Failed to load addresses");
      }
    };
    fetchAddresses();
  }, [activeTab]);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

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

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <div style={styles.sidebar}>
        <h3 style={{ marginBottom: 20,}} >Hello,<span style={}>{user.firstName}</span> </h3>

        <div
          style={styles.link}
          onClick={() => navigate("/my-orders")}
        >
          MY ORDERS
        </div>

        <div style={{ marginTop: 20 }}>
          <b>ACCOUNT SETTINGS</b>

          <div
            style={{
              ...styles.subLink,
              color: activeTab === "profile" ? "#00796b" : "#000",
            }}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </div>

          <div
            style={{
              ...styles.subLink,
              color: activeTab === "address" ? "#00796b" : "#000",
            }}
            onClick={() => setActiveTab("address")}
          >
            Manage Addresses
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={styles.content}>
        {/* ===== PROFILE TAB ===== */}
        {activeTab === "profile" && (
          <>
            <h2>
              Personal Information{" "}
              <span
                style={styles.editLink}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit"}
              </span>
            </h2>

            <div style={styles.row}>
              <input
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                readOnly={!editMode}
                placeholder="First Name"
                style={styles.input}
              />
              <input
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                readOnly={!editMode}
                placeholder="Last Name"
                style={styles.input}
              />
            </div>

            <div style={{ margin: "15px 0" }}>
              Gender:
              <label style={{ marginLeft: 15 }}>
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
              <label style={{ marginLeft: 15 }}>
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

            <input value={user.email} readOnly style={styles.input} />
            <input
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              readOnly={!editMode}
              style={styles.input}
            />

            {editMode && (
              <button style={styles.primaryBtn} onClick={handleSave}>
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
              <div key={addr._id} style={styles.addressCard}>
                <div>
                  <b>{addr.name}</b>
                  <span style={styles.typeBadge}>{addr.type}</span>
                </div>

                <p style={{ margin: "6px 0" }}>
                  {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                  <b>{addr.pincode}</b>
                </p>

                <p>📞 {addr.phone}</p>

                <div style={styles.addressActions}>
                  <span
                    style={styles.editLink}
                    onClick={() =>
                      navigate("/add-address", {
                        state: { address: addr, isEdit: true },
                      })
                    }
                  >
                    Edit
                  </span>

                  <span
                    style={styles.deleteLink}
                    onClick={async () => {
                      if (!window.confirm("Delete this address?")) return;
                      const token = localStorage.getItem("token");
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
                </div>
              </div>
            ))}

            <button
              style={{ ...styles.primaryBtn, marginTop: 10 }}
              onClick={() => navigate("/add-address")}
            >
              + Add New Address
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ================= INLINE STYLES ================= */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f3f6",
    flexWrap: "wrap",
  },
  sidebar: {
    width: "260px",
    padding: 20,
    background: "#fff",
    borderRight: "1px solid #ddd",
  },
  content: {
    flex: 1,
    padding: 30,
    minWidth: "300px",
  },
  link: {
    cursor: "pointer",
    fontWeight: 600,
    marginBottom: 10,
  },
  subLink: {
    cursor: "pointer",
    marginTop: 8,
    fontWeight: 500,
  },
  editLink: {
    color: "#00796b",
    cursor: "pointer",
    fontSize: 14,
    marginLeft: 10,
  },
  deleteLink: {
    color: "red",
    cursor: "pointer",
    marginLeft: 20,
  },
  row: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  input: {
    padding: 10,
    width: "100%",
    maxWidth: 300,
    marginBottom: 10,
  },
  primaryBtn: {
    background: "#00796b",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: 4,
  },
  addressCard: {
    border: "1px solid #ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 6,
    background: "#fff",
  },
  typeBadge: {
    marginLeft: 10,
    background: "#e0f2f1",
    padding: "2px 8px",
    fontSize: 12,
    borderRadius: 12,
  },
  addressActions: {
    marginTop: 10,
  },
};

export default ProfilePage;
