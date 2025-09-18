import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validateLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ save user
        navigate("/home");
      } else {
        alert(data.message || "Login failed");
      }

    }
    catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login. Please try again.");
    }
  }
  return (
    <>
      <h1 className="text-6xl text-white font-medium italic text-center p-10">
        Notes
      </h1>
      <div className="max-w-md mx-auto bg-[#a4c0cf] p-6 rounded-lg shadow-lg">
        <h2 className="font-semibold text-3xl flex justify-center">Login</h2>
        <form action="post" className="flex flex-col items-center mt-4" onSubmit={validateLogin}>
          <div className="flex flex-col min-w-80 mb-4">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              className="border-2 border-gray-300 p-2 rounded"
            />
          </div>
          <div className="flex flex-col min-w-80 mb-4">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-2 border-gray-300 p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 min-w-48 text-white p-2 rounded mt-4"
          >
            Login
          </button>
        </form>
        <p className="text-center" onClick={()=>navigate("/change")}>forgot password</p>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </>
  );
}