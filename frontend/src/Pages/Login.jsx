import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  UserCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import axios from "axios";


import Toast from "./ToastAnimation/Toast";
import { useToast } from "./ToastAnimation/useToast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const submitHandler = async () => {
    setUploading(true);

    if (!email || !password) {
      showToast("Fill all the fields", "error");
      setUploading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );
      showToast("Login Successful ✅", "success");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUploading(false);
      navigate("/chats");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed. Try again.", "error");
      setUploading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[rgb(13,17,60)] via-[rgb(13,17,60)]/95 to-[rgb(13,17,60)] flex items-center justify-center font-sans relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

     
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="bg-[rgb(13,17,60)]/20 backdrop-blur-xl border border-blue-500/20 p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4 relative z-10 animate-slideUp">
       
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl mb-4 animate-bounce-slow">
            <LogIn size={32} className="text-blue-300 animate-pulse" />
            <Sparkles
              size={14}
              className="absolute -top-1 -right-1 text-blue-400 animate-ping"
            />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 tracking-wider drop-shadow-lg animate-fadeInUp">
            Welcome Back
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-2 animate-expandWidth"></div>
        </div>

        
        <div
          className="mb-6 animate-slideInLeft"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400"
            />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-4 bg-[rgb(13,17,60)]/30 backdrop-blur-sm text-white rounded-xl border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 placeholder-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        
        <div
          className="mb-8 animate-slideInRight"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400"
            />
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full pl-12 pr-4 py-4 bg-[rgb(13,17,60)]/30 backdrop-blur-sm text-white rounded-xl border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 placeholder-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

       
        <button
          className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-base rounded-xl shadow-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 animate-slideInUp overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          onClick={submitHandler}
          disabled={uploading}
          style={{ animationDelay: "0.8s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-300/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          <div className="relative flex items-center justify-center gap-2">
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </>
            )}
          </div>
        </button>

        
        <button
          className="group relative w-full py-4 px-6 bg-gradient-to-r from-[rgb(13,17,60)]/60 to-[rgb(13,17,60)]/40 hover:from-blue-600/60 hover:to-blue-500/60 text-white font-bold text-base rounded-xl shadow-xl border-2 border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/50 animate-slideInUp overflow-hidden mb-6"
          onClick={() => {
            setEmail("guest@gmail.com");
            setPassword("123456");
          }}
          style={{ animationDelay: "1s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-300/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          <div className="relative flex items-center justify-center gap-2">
            <UserCheck size={18} />
            <span>Login As Guest</span>
          </div>
        </button>

        {/* Register Link */}
        <p
          className="text-blue-200 text-sm text-center animate-fadeInUp"
          style={{ animationDelay: "1.2s" }}
        >
          Don't have an account?
          <Link
            to="/register"
            className="ml-2 text-blue-300 hover:text-white font-semibold transition-colors duration-300 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 5rem;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-expandWidth {
          animation: expandWidth 1s ease-out forwards 0.8s;
          width: 0;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;