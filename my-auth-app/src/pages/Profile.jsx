import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import "../ui/Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    photoURL: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || user.email || "",
            number: data.number || "",
            photoURL: data.photoURL || user.photoURL || "",
          });
        } else {
          setProfile({
            firstName: "",
            lastName: "",
            email: user.email || "",
            number: "",
            photoURL: user.photoURL || "",
          });
        }
      } catch (error) {
        console.error("Profile load error:", error);
        setMessage({ type: "error", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  function setField(key, value) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const maxWidth = 400;
          const maxHeight = 400;

          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };

        img.onerror = () => reject(new Error("Failed to process image."));
        img.src = event.target.result;
      };

      reader.onerror = () => reject(new Error("Failed to read image."));
      reader.readAsDataURL(file);
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage({ type: "", text: "" });

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file only." });
      return;
    }

    try {
      const compressedImage = await compressImage(file);

      setProfile((prev) => ({
        ...prev,
        photoURL: compressedImage,
      }));

      setMessage({ type: "success", text: "Image selected. Click Save Changes to apply it." });
    } catch (error) {
      console.error("Image processing error:", error);
      setMessage({ type: "error", text: "Failed to process image." });
    }
  }

  async function handleSave() {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          number: profile.number,
          photoURL: profile.photoURL || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      console.error("Save profile error:", error);
      setMessage({
        type: "error",
        text: "Failed to save profile. The image may still be too large.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "User";

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-photo-wrapper">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo placeholder">
                {(profile.firstName?.[0] || "U").toUpperCase()}
              </div>
            )}

            <label htmlFor="profileUpload" className="edit-avatar" title="Change profile picture">
              <Pencil size={16} />
            </label>

            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </div>

          <h2 className="profile-name">{fullName}</h2>
          <p className="profile-subtext">{profile.email}</p>
        </div>

        {message.text ? (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        ) : null}

        <div className="profile-form">
          <div className="profile-field">
            <label>First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label>Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <input
              type="text"
              value={profile.number}
              onChange={(e) => setField("number", e.target.value)}
            />
          </div>
        </div>

        <div className="profile-actions">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button className="back-btn" onClick={() => navigate("/dashboard")} disabled={saving}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}