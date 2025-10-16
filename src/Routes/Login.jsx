import { userLogin } from "@/api/services/authService";
import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon, Code } from "lucide-react";

const Login = ({
  heading = "Login",
  logo = {
    url: "/",
    src: "/",
    alt: "logo",
    title: "CodeClash",
  },
  buttonText = "Login",
  signupText = "Need an account?",
  signupUrl = "/register",
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const validateUserData = ({ username, password }) => {
    if (!username || !password) return "Username and password are required";
    return null;
  };

  const handleLogin = useMutation({
    mutationFn: ({ username, password }) => userLogin({ username, password }),
    onSuccess: (res) => {
      console.log("login res", res);
      toast.success("user loggedin");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/" });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong during login");
    },
  });

  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  return (
    <section className="bg-slate-950 min-h-screen">
      <style>{`
        * {
          cursor: default;
        }
        button, [role="button"], .cursor-pointer {
          cursor: pointer;
        }
        input, textarea, select {
          cursor: text;
        }
        a {
          cursor: pointer;
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="flex h-screen items-center justify-center relative z-10">
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const error = validateUserData({ username, password });
              if (error) {
                toast.error(error);
                return;
              }
              handleLogin.mutate({ username, password });
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          <div className="flex flex-col items-center gap-6 lg:justify-start">
            <div className="min-w-sm bg-slate-900/50 backdrop-blur-sm flex w-full max-w-sm flex-col items-center gap-y-6 rounded-2xl border border-slate-800 px-8 py-10 shadow-2xl">
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 blur-lg opacity-50"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-2xl">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                </div>
                {heading && (
                  <h1 className="text-2xl font-bold text-white text-center">
                    {heading}
                  </h1>
                )}
                <p className="text-sm text-slate-400">
                  Welcome back to CodeClash
                </p>
              </div>

              <Input
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full text-sm bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
                required
              />

              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full text-sm bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
                required
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 transition-all py-2.5"
                disabled={handleLogin.isPending}
              >
                {handleLogin.isPending ? (
                  <>
                    <Loader2Icon className="animate-spin w-4 h-4 mr-2" />
                    Please wait
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </div>

            <div className="text-slate-400 flex justify-center gap-2 text-sm">
              <p>{signupText}</p>
              <a
                href={signupUrl}
                className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
              >
                Sign up
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
