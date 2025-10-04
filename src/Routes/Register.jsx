import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
// import { Button, Input, Label } from "@/components";
import { useNavigate } from "@tanstack/react-router";
import checkAuth from "@/utils/checkAuth";
import toast from "react-hot-toast";
import { userRegister } from "@/api/services/authService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";

const Register = ({
  heading = "Signup",
  buttonText = "Create Account",
  signupText = "Already a user?",
  signupUrl = "/login",
}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmP, setConfirmP] = useState("");
  const [fullName, setFullName] = useState("");
  const [preview, setPreview] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  if (user) {
    return <Loader className="animate-spin text-blue-500 w-6 h-6" />;
  }

  return (
    <section className="bg-muted h-max">
      <div className="flex  h-max py-4 items-center justify-center">
        {/* Logo */}
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
          <div className="flex flex-col items-center gap-6 lg:justify-start">
            <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
              {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {avatar ? (
                    <Avatar className="w-[4rem] h-[4rem]">
                      <AvatarImage src={preview} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  ) : (
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer rounded-full w-[4rem] h-[4rem] bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted/60 transition"
                    >
                      Upload Avatar
                    </label>
                  )}
                </div>
                {avatar && (
                  <p className="text-sm mt-2 text-muted-foreground text-center truncate max-w-[8rem]">
                    {avatar.name}
                  </p>
                )}
              </div>

              <Input
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                id="fullname"
                placeholder="Full Name"
                required
              />
              <Input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                placeholder="Username"
                required
              />

              <Input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="text-sm"
                required
              />
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="text-sm"
                required
              />
              <Input
                onChange={(e) => setConfirmP(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="text-sm"
                required
              />
              <Button
                disabled={handleRegister.isPending}
                type="submit"
                className="w-full"
              >
                {handleRegister.isPending ? (
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
                Login
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
