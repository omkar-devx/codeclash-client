import { userLogin } from "@/api/services/authService";
import { Button, Input, Label } from "@/components/index.js";
import checkAuth from "@/utils/checkAuth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // validating user data
  const validateUserData = ({ username, password }) => {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
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

  const { data, isPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: checkAuth,
    staleTime: 1 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (data) {
      navigate({ to: "/" });
    }
  }, [data, navigate]);

  if (isPending) {
    return <h1>Loading ...</h1>;
  }

  return (
    <div>
      <form
        className="w-full flex flex-col items-center justify-center gap-4"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          try {
            validateUserData({ username, password });
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
            {handleLogin.isPending ? "Logging in...." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
