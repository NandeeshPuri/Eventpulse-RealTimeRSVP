import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import { useAuth } from "../context/AuthContext";
import { CalendarClock, Calendar, Home, LogOut, UserCircle, PlusCircle } from "lucide-react";

export const NavBar: React.FC = () => {
  const { user, logout, isAuthenticated, isHost } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-10" data-id="s3inqjl2k" data-path="src/components/NavBar.tsx">
      <div className="container mx-auto px-4 py-3" data-id="o14w32xq9" data-path="src/components/NavBar.tsx">
        <div className="flex items-center justify-between" data-id="kn9ig7r0s" data-path="src/components/NavBar.tsx">
          <Link to="/" className="flex items-center space-x-2">
            <CalendarClock className="h-8 w-8 text-purple-600" />
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text" data-id="llyaa4me5" data-path="src/components/NavBar.tsx">
              EventPulse
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6" data-id="wizq2283n" data-path="src/components/NavBar.tsx">
            <Link to="/" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
              <Home className="h-5 w-5 mr-1" />
              <span data-id="67325k7l9" data-path="src/components/NavBar.tsx">Home</span>
            </Link>
            {isAuthenticated &&
            <>
                <Link to="/events" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span data-id="cgpz0vsfj" data-path="src/components/NavBar.tsx">My Events</span>
                </Link>
                {isHost &&
              <Link to="/events/create">
                    <Button variant="outline" className="flex items-center space-x-1">
                      <PlusCircle className="h-4 w-4" />
                      <span data-id="00k63yprq" data-path="src/components/NavBar.tsx">Create Event</span>
                    </Button>
                  </Link>
              }
              </>
            }
          </div>

          <div className="flex items-center" data-id="k0websscp" data-path="src/components/NavBar.tsx">
            {isAuthenticated ?
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0 overflow-hidden">
                    <UserCircle className="h-7 w-7 text-purple-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col" data-id="8hrxat0fg" data-path="src/components/NavBar.tsx">
                      <span data-id="xx9pm7xbn" data-path="src/components/NavBar.tsx">{user?.name}</span>
                      <span className="text-xs text-gray-500" data-id="y2p9r5olk" data-path="src/components/NavBar.tsx">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/events" className="cursor-pointer">My Events</Link>
                  </DropdownMenuItem>
                  {isHost &&
                <DropdownMenuItem asChild>
                      <Link to="/events/create" className="cursor-pointer">Create Event</Link>
                    </DropdownMenuItem>
                }
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> :

            <div className="flex space-x-2" data-id="t8bfrgbw6" data-path="src/components/NavBar.tsx">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button onClick={() => navigate("/register")}>Sign up</Button>
              </div>
            }
          </div>
        </div>
      </div>
    </nav>);

};