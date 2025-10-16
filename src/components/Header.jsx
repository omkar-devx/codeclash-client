import { Book, Menu, Sunset, Trees, Zap, Code } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userLogout } from "@/api/services/authService";
import checkAuth from "@/utils/checkAuth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeUserData, setUserData } from "@/features/auth/authSlice";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = ({
  logo = {
    url: "/",
    src: "/",
    alt: "logo",
    title: "CodeClash",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Problems",
      url: "/problemset",
    },
    {
      title: "About Us",
      url: "/aboutus",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/register" },
    logout: { title: "Logout" },
  },
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // user logged in check
  const { data: userData, isPending } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => checkAuth(),
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    console.log(userData);
    if (userData) {
      dispatch(setUserData(userData));
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
    <section className="border-b z-20 border-slate-800/50 backdrop-blur-xl bg-slate-950">
      <div className="container mx-auto px-6 py-3">
        <nav className="hidden lg:flex items-center justify-between">
          <a href={logo.url} className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-md opacity-40"></div>
              <div className="relative w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-xl">
                <Code className="w-4 h-4 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Code<span className="text-blue-600">Clash</span>
            </span>
          </a>

          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3">
            {isPending ? (
              <Loader className="animate-spin text-blue-400 w-5 h-5" />
            ) : userData ? (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleLogout.mutate()}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium bg-transparent hover:bg-slate-800/50 border-0 h-9"
                  size="sm"
                >
                  {auth.logout.title}
                </Button>
                <Avatar
                  onClick={() => navigate({ to: `/user/${userData.username}` })}
                  className="w-9 h-9 border-2 border-blue-600/50 cursor-pointer"
                >
                  <AvatarImage
                    className="cursor-pointer"
                    src={userData.avatarUrl}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
                    {userData.username?.charAt(0).toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <>
                <Button
                  asChild
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium bg-transparent hover:bg-transparent border-0 h-9"
                  size="sm"
                >
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button
                  asChild
                  className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all font-medium shadow-lg shadow-blue-600/30 text-white h-9"
                  size="sm"
                >
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </>
            )}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 blur-md opacity-40"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-xl">
                  <Code className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Code<span className="text-blue-600">Clash</span>
              </span>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white h-9 w-9"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto bg-slate-900 border-slate-800 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white">
                    <a href={logo.url} className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        Code<span className="text-blue-600">Clash</span>
                      </span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    {isPending ? (
                      <Loader className="animate-spin text-blue-400 w-5 h-5" />
                    ) : userData ? (
                      <div className="flex flex-col gap-3">
                        <Avatar
                          onClick={() =>
                            navigate({ to: `/user/${userData.username}` })
                          }
                          className="w-9 h-9 border-2 border-blue-600/50 cursor-pointer"
                        >
                          <AvatarImage
                            className="cursor-pointer"
                            src={userData.avatarUrl}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
                            {userData.username?.charAt(0).toUpperCase() || "CN"}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          onClick={() => handleLogout.mutate()}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-white h-9 text-sm"
                          size="sm"
                        >
                          {auth.logout.title}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          asChild
                          className="w-full border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white h-9 text-sm"
                          variant="outline"
                          size="sm"
                        >
                          <a href={auth.login.url}>{auth.login.title}</a>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
                          size="sm"
                        >
                          <a href={auth.signup.url}>{auth.signup.title}</a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className="bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white font-medium transition-colors text-sm h-9">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-slate-800/50"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-b border-slate-800"
      >
        <AccordionTrigger className="text-md py-2 font-semibold hover:no-underline text-white hover:text-blue-400">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className="text-md font-semibold text-slate-300 hover:text-white transition-colors py-2 block"
    >
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }) => {
  return (
    <a
      className="flex flex-row gap-3 rounded-lg p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-slate-800/50 group"
      href={item.url}
    >
      <div className="text-blue-400 text-sm">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
          {item.title}
        </div>
        {item.description && (
          <p className="text-xs leading-snug text-slate-400 mt-1">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export default Header;
