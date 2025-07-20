import { userLogin } from "@/api/services/authService";
import { Button, Input, Label } from "@/components/index.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";

const Login = () => {
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
    <div>
      <form
        className="w-full flex flex-col items-center justify-center gap-4"
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
        <h1 className="">Login Page</h1>
        <div className="grid w-full max-w-sm items-center gap-3">
          <div>
            <Label htmlFor="email">Username</Label>
            <Input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username "
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter you password"
            />
          </div>
          <Button disabled={handleLogin.isPending}>
            {handleLogin.isPending ? (
              <>
                <LoaderCircle className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
