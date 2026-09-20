import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getErrorMessage } from "../utils/helpers";
import "./AuthPages.css";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bb-auth">
      <div className="bb-auth__card">
        <h2>Create your account</h2>
        <p className="text-muted">Join BorrowBox to start lending and borrowing.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="bb-auth__form">
          <Input
            label="Full name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            registration={register("name", { required: "Name is required" })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            registration={register("email", { required: "Email is required" })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            registration={register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="9876543210"
            error={errors.phone?.message}
            registration={register("phone", { required: "Phone number is required" })}
          />
          <Input
            label="Location"
            placeholder="Mangalore, Karnataka"
            error={errors.location?.message}
            registration={register("location", { required: "Location is required" })}
          />

          {serverError && <p className="bb-auth__error">{serverError}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="bb-auth__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
