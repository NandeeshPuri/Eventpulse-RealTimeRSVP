import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock } from "lucide-react";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"host" | "attendee">("attendee");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name, role);
      toast({
        title: "Account created!",
        description: "You have successfully registered and are now logged in."
      });
      navigate("/events");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4" data-id="i8s6rnhnh" data-path="src/pages/RegisterPage.tsx">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center space-x-2 mb-2" data-id="gs6seyuw5" data-path="src/pages/RegisterPage.tsx">
            <CalendarClock className="h-8 w-8 text-purple-600" />
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text" data-id="rkcozmpog" data-path="src/pages/RegisterPage.tsx">
              EventPulse
            </span>
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your information to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-id="ngfjch1pw" data-path="src/pages/RegisterPage.tsx">
            <div className="space-y-2" data-id="du51cg5yn" data-path="src/pages/RegisterPage.tsx">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required />

            </div>
            <div className="space-y-2" data-id="b7ayfhaqv" data-path="src/pages/RegisterPage.tsx">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required />

            </div>
            <div className="space-y-2" data-id="ln6xib41m" data-path="src/pages/RegisterPage.tsx">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required />

            </div>
            <div className="space-y-2" data-id="j0cs7djks" data-path="src/pages/RegisterPage.tsx">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required />

            </div>
            <div className="space-y-2" data-id="pu0558odn" data-path="src/pages/RegisterPage.tsx">
              <Label>I want to use EventPulse as a:</Label>
              <RadioGroup defaultValue={role} onValueChange={(value) => setRole(value as "host" | "attendee")}>
                <div className="flex items-center space-x-2" data-id="gh66pkwmf" data-path="src/pages/RegisterPage.tsx">
                  <RadioGroupItem value="host" id="host" />
                  <Label htmlFor="host" className="cursor-pointer">Host (create and manage events)</Label>
                </div>
                <div className="flex items-center space-x-2" data-id="rbf4w6yvc" data-path="src/pages/RegisterPage.tsx">
                  <RadioGroupItem value="attendee" id="attendee" />
                  <Label htmlFor="attendee" className="cursor-pointer">Attendee (participate in events)</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600" data-id="8d7iztye4" data-path="src/pages/RegisterPage.tsx">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>);

};

export default RegisterPage;