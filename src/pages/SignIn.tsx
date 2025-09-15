import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, signIn } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Query the KHSRNY users table for authentication
      const {
        data,
        error
      } = await supabase.from("KHSRNY users").select("*").eq("username", username).single();
      if (error || !data) {
        toast({
          title: "Error",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return;
      }

      // In a real app, you'd verify the password hash here
      // For now, we'll do a simple comparison (not secure for production)
      if (data.password_hash === password) {
        // Use the auth context to sign in
        signIn(username, password);
        toast({
          title: "Success",
          description: "Signed in successfully"
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: "An error occurred during sign in",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-glow bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-glow-pulse">KHSRNY Cloud</h1>
        </div>

        {/* Sign In Form */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
          <CardHeader className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">Sign In</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  Username
                </Label>
                <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="bg-background/50 border-border/50" placeholder="Enter your username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-background/50 border-border/50" placeholder="Enter your password" />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-purple/80 hover:to-neon-cyan/80 text-white font-medium">
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default SignIn;