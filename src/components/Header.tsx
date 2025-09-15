import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
const Header = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSignOut = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate("/signin");
  };
  return <header className="w-full p-4 md:p-6 border-b border-border bg-card/50 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-glow bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-glow-pulse">KHSRNY cloud</h1>
        </div>
        
        {/* Sign Out Button */}
        <Button onClick={handleSignOut} variant="outline" size="sm" className="flex items-center gap-2 bg-background/50 border-border/50 hover:bg-background/80 text-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
      
      <p className="text-center text-muted-foreground mt-2 text-xs md:text-sm tracking-wider">
        UPLOAD • PREVIEW • SHARE
      </p>
    </header>;
};
export default Header;