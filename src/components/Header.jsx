import { Link } from "@tanstack/react-router";
import React from "react";
import { Button } from ".";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userLogout } from "@/api/services/authService";
import checkAuth from "@/utils/checkAuth";
import toast from "react-hot-toast";

const Header = () => {
  const queryClient = useQueryClient();

  // logout functionality
  const handleLogout = useMutation({
    mutationFn: userLogout,
    onSuccess() {
      toast.success("User Logout");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  // user logged in check
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => checkAuth(),
    staleTime: 1 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
        {user ? (
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
