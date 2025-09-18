import React, { useState } from 'react'

export default function Change() {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [Name, setName] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const ValidateChange = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!Name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!username.trim()) {
            newErrors.username = "Email is required";
        }
        if (!password) {
            newErrors.password = "Password is required";
        }
        if (password !== password1) {
            newErrors.password1 = "Passwords do not match";
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:3000/api/users/change", {
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
                    alert("Password changed successfully");
                } else {
                    alert(data.message || "Change failed");
                }
            } catch (err) {
                console.error("Change error:", err);
                alert("An error occurred during change. Please try again.");
            }
            setLoading(false);
        }
    };

    return (
        <>
            <form
                className="flex flex-col items-center mt-4"
                onSubmit={ValidateChange}
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
                    {loading ? "Changing..." : "Change Password"}
                </button>
            </form>
        </>
    )
}
