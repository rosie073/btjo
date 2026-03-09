import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    async function loadProfileImage() {
      const user = auth.currentUser;

      if (!user) {
        setPhotoURL("");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          const data = snap.data();
          setPhotoURL(data.photoURL || "");
        } else {
          setPhotoURL(user.photoURL || "");
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
        setPhotoURL(user.photoURL || "");
      }
    }

    loadProfileImage();
  }, [location.pathname]);

  function goToProfile() {
    navigate("/profile");
  }

  return (
    <div className="profile-wrapper">
      <button
        className="icon-btn profile-icon-btn"
        onClick={goToProfile}
        type="button"
        aria-label="Go to profile"
        title="Profile"
      >
        {photoURL ? (
          <img src={photoURL} alt="Profile" className="topbar-profile-img" />
        ) : (
          <User size={18} strokeWidth={2.2} />
        )}
      </button>
    </div>
  );
}