import { useState } from "react";

import Footer from "./Footer";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "./AuthImagePattern";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../toast/showToast";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();
const navigate = useNavigate();
  const validateForm = () => {
    if (!formData.fullName.trim())
      return showToast("Username is required", true);
    if (!formData.email.trim()) return showToast("Email is required", true);
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return showToast("Invalid email format", true);
    if (!formData.password) return showToast("Password is required", true);
    if (formData.password.length < 6)
      return showToast("Password must be at least 6 characters", true);

    return true;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const success = validateForm();

  if (success === true) {
    try {
      const result = await signup(formData);

      if (result?.success) {
        

        // ✅ Redirect
        navigate("/get-started");

        showToast("Registration successful! Welcome aboard!", false);
      }
    } catch (error) {
      showToast("Registration failed. Please try again.", true);
    }
  }
};



  return (
    <>
      <div className=" grid lg:grid-cols-2 mt-20 pb-10">
        {/* left side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8 text-pink">
            Mautamuhub
            {/* LOGO */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-pink" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">
                  Get started with your free account
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="Pretty Jane"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-10`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary text-white bg-pink hover:bg-coralPink w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="text-pink underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* right side */}

        <AuthImagePattern
          title="Join our escort community"
          subtitle="Connect with escorts, share great moments , send naughty stuffs😜 ."
        />
      </div>
      <Footer />
    </>
  );
};
export default Register;
