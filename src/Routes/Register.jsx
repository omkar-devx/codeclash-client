import React, { useEffect, useState } from "react";
import { Button, Input, Label } from "@/components";
import { useNavigate } from "@tanstack/react-router";
import checkAuth from "@/utils/checkAuth";
import toast from "react-hot-toast";
import { userRegister } from "@/api/services/authService";
import { useMutation, useQuery } from "@tanstack/react-query";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmP, setConfirmP] = useState("");
  const [fullName, setFullName] = useState("");
  const [defaultAvatar, setDefaultAvatar] = useState(
    import.meta.env.VITE_DEFAULT_AVATAR
  );
  const [avatar, setAvatar] = useState(null);

  const validateUserData = ({
    fullName,
    username,
    email,
    password,
    confirmP,
  }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!fullName || !username || !email || !password || !confirmP) {
      throw new Error("fill all the required field");
    }

    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (password !== confirmP) {
      throw new Error("Both the password must be same");
    }

    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include at least one letter and one number"
      );
    }
  };

  const handleRegister = useMutation({
    mutationFn: ({
      fullName,
      username,
      email,
      password,
      avatar,
      defaultAvatar,
    }) =>
      userRegister({
        fullName,
        username,
        email,
        password,
        avatar,
        defaultAvatar,
      }),

    onSuccess(res) {
      setUsername("");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmP("");
      setAvatar(null);
      toast.success("User is Register");
      navigate({ to: "/login" });
    },
    onError(error) {
      toast.error(error.message);
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
    return <h1>loading.....</h1>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Register Page</h1>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          try {
            validateUserData({
              fullName,
              username,
              email,
              password,
              confirmP,
            });
            handleRegister.mutate({
              fullName,
              username,
              email,
              password,
              avatar,
              defaultAvatar,
            });
          } catch (error) {
            toast.error(error.message);
          }
        }}
      >
        <div className="grid w-full max-w-sm items-center gap-3">
          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              onChange={(e) => setAvatar(e.target.files[0])}
              type="file"
              id="avatar"
              accept="image/*"
            />
          </div>
          <div>
            <Label htmlFor="fullname">Full Name: </Label>
            <Input
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              id="fullname"
              required
            />
          </div>
          <div>
            <Label htmlFor="username">Username: </Label>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email: </Label>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
          </div>
          <small className="text-gray-600">
            Password must be 8+ characters with a number
          </small>
          <div>
            <Label htmlFor="password">Password: </Label>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm Password: </Label>
            <Input
              onChange={(e) => setConfirmP(e.target.value)}
              type="password"
              id="confirm-password"
              required
            />
          </div>
          <Button disabled={handleRegister.isPending}>
            {handleRegister.isPending ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
