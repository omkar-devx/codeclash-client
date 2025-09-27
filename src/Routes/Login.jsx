import { userLogin } from "@/api/services/authService";
// // import { Button, Input, Label } from "@/components/index.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";

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
  // validating user data
  const validateUserData = ({ username, password }) => {
    if (!username || !password) return "Username and password are required";
    return null;
  };

  // useMutation for login
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
    <section className="bg-muted ">
      <div className="flex h-screen items-center justify-center">
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
            <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
              {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
              <Input
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username "
                className="text-sm"
                required
              />
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter you password"
                className="text-sm"
                required
              />
              <Button
                type="submit"
                className="w-full"
                disabled={handleLogin.isPending}
              >
                {handleLogin.isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </div>
            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{signupText}</p>
              <a
                href={signupUrl}
                className="text-primary font-medium hover:underline"
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
