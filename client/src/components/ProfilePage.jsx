import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ===== MOBILE DETECTION ===== */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          `${API}/api/users/profile`,
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
          `${API}/api/address/list`,
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
        `${API}/api/users/profile`,
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
    <div
      style={{
        ...styles.container,
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          ...styles.sidebar,
          width: isMobile ? "100%" : "260px",
          borderRight: isMobile ? "none" : "1px solid #ddd",
          borderBottom: isMobile ? "1px solid #ddd" : "none",
        }}
      >
        <h3
          style={{
            marginBottom: 20,
            marginTop: 15,
            fontSize: isMobile ? 20 : 25,
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Hello,{" "}
          <span style={{ color: "#ff4081" }}>{user.firstName}</span>
        </h3>

        <div style={styles.link} onClick={() => navigate("/my-orders")}>
          MY ORDERS
        </div>

        <div style={{ marginTop: 20 }}>
          <b style={styles.sectionTitle}>ACCOUNT SETTINGS</b>

          <div
            style={{
              ...styles.subLink,
              color: activeTab === "profile" ? "#ff4081" : "#000",
            }}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </div>

          <div
            style={{
              ...styles.subLink,
              color: activeTab === "address" ? "#ff4081" : "#000",
            }}
            onClick={() => setActiveTab("address")}
          >
            Manage Addresses
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ ...styles.content, padding: isMobile ? 15 : 30 }}>
        {/* ===== PROFILE TAB ===== */}
        {activeTab === "profile" && (
          <>
            <h2 style={styles.pageTitle}>
              Personal Information
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
              {["Male", "Female"].map((g) => (
                <label key={g} style={{ marginLeft: 15 }}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={user.gender === g}
                    onChange={handleChange}
                    disabled={!editMode}
                  />{" "}
                  {g}
                </label>
              ))}
            </div>

            <input value={user.email} readOnly style={styles.input} />
            <input
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              readOnly={!editMode}
              placeholder="Mobile Number"
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
            <h2 style={styles.pageTitle}>Manage Addresses</h2>

            {addressList.map((addr) => (
              <div key={addr._id} style={styles.addressCard}>
                <b>{addr.name}</b>
                <span style={styles.typeBadge}>{addr.type}</span>

                <p>
                  {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                  <b>{addr.pincode}</b>
                </p>

                <p>📞 {addr.phone}</p>

                <div>
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
                        `${API}/api/address/delete/${addr._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setAddressList(
                        addressList.filter((a) => a._id !== addr._id)
                      );
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

/* ================= STYLES ================= */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f3f6",
  },
  sidebar: {
    padding: 20,
    background: "#fff",
  },
  content: {
    flex: 1,
  },
  link: {
    cursor: "pointer",
    fontWeight: 800,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#00796b",
    fontWeight: 900,
    fontSize: 18,
  },
  subLink: {
    cursor: "pointer",
    marginTop: 8,
  },
  pageTitle: {
    color: "#00796b",
    fontWeight: 900,
    fontSize: 26,
    marginBottom: 20,
  },
  editLink: {
    color: "#ff4081",
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
    padding: 12,
    width: "100%",
    maxWidth: 320,
    marginBottom: 10,
  },
  primaryBtn: {
    background: "#00796b",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: 4,
    width: "100%",
    maxWidth: 320,
  },
  addressCard: {
    background: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  typeBadge: {
    marginLeft: 10,
    background: "#e0f2f1",
    padding: "2px 8px",
    fontSize: 12,
    borderRadius: 12,
  },
};

export default ProfilePage;
