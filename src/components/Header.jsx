import { Link } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { Button } from ".";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userLogout } from "@/api/services/authService";
import checkAuth from "@/utils/checkAuth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeUserData, setUserData } from "@/features/auth/authSlice";
import { Loader } from "lucide-react";

const Header = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  console.log(user);
  // user logged in check

  const { data: userData, isPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => checkAuth(),
    enabled: !user,
    staleTime: 1 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData.user));
    }
  }, [userData]);

  // logout functionality
  const handleLogout = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      toast.success("User Logout");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      dispatch(removeUserData());
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  return (
    <div>
      <ul className="flex gap-x-4 ">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/problemset">Problems</Link>
        </li>
        {isPending ? (
          <Loader className="animate-spin text-black-500 w-6 h-6" />
        ) : user ? (
          <li>
            <Button onClick={() => handleLogout.mutate()}>Logout</Button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
