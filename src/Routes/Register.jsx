import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { userRegister } from "@/api/services/authService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon, Code, Upload } from "lucide-react";

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
    return <Loader2Icon className="animate-spin text-blue-400 w-6 h-6" />;
  }

  return (
    <section className="bg-slate-950 min-h-max ">
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

      <div className="fixed inset-0 overflow-hidden pointer-events-none w-screen ">
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

      <div className="flex min-h-screen flex-col w-full py-6 items-center justify-center relative z-10">
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
                  Join CodeCollab community
                </p>
              </div>

              <div className="text-center w-full">
                <div className="flex items-center justify-center mb-3">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {avatar ? (
                    <Avatar className="w-20 h-20 border-2 border-blue-600/50">
                      <AvatarImage src={preview} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                        {fullName.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer rounded-2xl w-20 h-20 bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-blue-600 flex items-center justify-center transition-all group"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                          Upload
                        </span>
                      </div>
                    </label>
                  )}
                </div>
                {avatar && (
                  <p className="text-xs text-slate-400 text-center truncate max-w-[8rem] mx-auto">
                    {avatar.name}
                  </p>
                )}
              </div>

              <Input
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                id="fullname"
                placeholder="Full Name"
                className="w-full text-sm bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
                required
              />

              <Input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                placeholder="Username"
                className="w-full text-sm bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
                required
              />

              <Input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full text-sm bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
                required
              />

              <Input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="w-full text-sm bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
                required
              />

              <Input
                onChange={(e) => setConfirmP(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="w-full text-sm bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-lg focus:ring-blue-600/50 focus:border-blue-600"
                required
              />

              <Button
                disabled={handleRegister.isPending}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 transition-all py-2.5"
              >
                {handleRegister.isPending ? (
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
