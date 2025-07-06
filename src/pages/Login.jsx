import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage(error.message);
      else navigate("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("signin succesfully! you can login now...");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-center bg-cover"
      style={{ backgroundImage: "url('loginpage.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          {isLogin ? "Login" : "sign-up"}
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          className="w-full px-4 py-2 border rounded"
        ></input>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Your Password"
          className="w-full px-4 py-2 border rounded"
        ></input>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isLogin ? "Login" : "sign-up"}
        </button>

        {message && (
          <p className="text-sm text-red-500 text-center">{message}</p>
        )}

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-700 text-center cursor-pointer"
        >
          {isLogin
            ? "Don't Have An Account? sign-up"
            : "Already Have An Account?  Login"}
        </p>
      </form>
    </div>
  );
};

export default Login;
