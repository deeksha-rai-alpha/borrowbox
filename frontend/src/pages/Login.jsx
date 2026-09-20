import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getErrorMessage } from "../utils/helpers";
import "./AuthPages.css";

const Login = () => {
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
      const res = await api.post("/auth/login", data);
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
        <h2>Welcome back</h2>
        <p className="text-muted">Log in to manage your items and borrowings.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="bb-auth__form">
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
            placeholder="••••••••"
            error={errors.password?.message}
            registration={register("password", { required: "Password is required" })}
          />

          {serverError && <p className="bb-auth__error">{serverError}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="bb-auth__switch">
          New to BorrowBox? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
