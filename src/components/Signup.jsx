import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [Name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const ValidateSignup = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Name) {
      newErrors.name = "Name is required";
    }
    if (!username) {
      newErrors.username = "Email is required";
    } else if (!emailRegex.test(username)) {
      newErrors.username = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!password1) {
      newErrors.password1 = "Please confirm your password";
    } else if (password !== password1) {
      newErrors.password1 = "Passwords do not match";
    }

    setErrors(newErrors);

    // If validation fails, stop
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Name,
          email: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful!");
        navigate("/"); // redirect to homepage
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-6xl text-white font-medium italic text-center p-10">
        Notes
      </h1>
      <div className="max-w-md mx-auto bg-[#a4c0cf] p-6 rounded-lg shadow-lg">
        <h2 className="font-semibold text-3xl flex justify-center">
          Create an Account
        </h2>
        <form
          className="flex flex-col items-center mt-4"
          onSubmit={ValidateSignup}
        >
          {/* Name */}
          <div className="flex flex-col min-w-80 mb-4">
            <label htmlFor="Name">Name:</label>
            <input
              type="text"
              id="Name"
              placeholder="enter name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded"
            />
            {errors.name && (
              <span className="text-red-600 text-sm">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col min-w-80 mb-4">
            <label htmlFor="username">Email:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded"
            />
            {errors.username && (
              <span className="text-red-600 text-sm">{errors.username}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col min-w-80 mb-4">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded"
            />
            {errors.password && (
              <span className="text-red-600 text-sm">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col min-w-80 mb-4">
            <label htmlFor="password1">Confirm Password:</label>
            <input
              type="password"
              id="password1"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded"
            />
            {errors.password1 && (
              <span className="text-red-600 text-sm">{errors.password1}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 min-w-48 text-white p-2 rounded mt-4 hover:cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
