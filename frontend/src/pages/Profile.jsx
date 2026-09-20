import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import { Textarea } from "../components/ui/FormFields";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import { getInitials, getErrorMessage } from "../utils/helpers";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
      location: user?.location,
      bio: user?.bio,
    },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get(`/users/${user._id}`);
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) loadStats();
  }, [user]);

  const onSubmit = async (data) => {
    setSuccess("");
    setServerError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("location", data.location);
      formData.append("bio", data.bio || "");
      if (newImage) formData.append("profileImage", newImage);

      const res = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data.user);
      setSuccess("Profile updated successfully.");
      setNewImage(null);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <section className="section container bb-profile">
      <h2>Your profile</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Update how other members see you.
      </p>

      {stats && (
        <div className="grid grid-cols-4 bb-profile__stats">
          <StatCard label="Items Listed" value={stats.itemsListed} tone="purple" />
          <StatCard label="Items Lent" value={stats.itemsLent} tone="success" />
          <StatCard label="Items Borrowed" value={stats.itemsBorrowed} tone="orange" />
          <StatCard label="Rating" value={user.rating?.average > 0 ? `★ ${user.rating.average}` : "—"} />
        </div>
      )}

      <div className="bb-profile__grid">
        <div className="bb-profile__avatar-block">
          <button
            type="button"
            className="bb-profile__avatar"
            onClick={() => fileInputRef.current?.click()}
          >
            {newImage ? (
              <img src={URL.createObjectURL(newImage)} alt="New avatar" />
            ) : user.profileImage?.url ? (
              <img src={user.profileImage.url} alt={user.name} />
            ) : (
              <span>{getInitials(user.name)}</span>
            )}
            <span className="bb-profile__avatar-edit">Change</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bb-profile__form">
          <Input
            label="Full name"
            error={errors.name?.message}
            registration={register("name", { required: "Name is required" })}
          />
          <Input
            label="Phone number"
            error={errors.phone?.message}
            registration={register("phone", { required: "Phone number is required" })}
          />
          <Input
            label="Location"
            error={errors.location?.message}
            registration={register("location", { required: "Location is required" })}
          />
          <Textarea
            label="Bio"
            placeholder="A short line about you..."
            registration={register("bio")}
          />

          {success && <p className="bb-profile__msg bb-profile__msg--success">{success}</p>}
          {serverError && <p className="bb-profile__msg bb-profile__msg--error">{serverError}</p>}

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
