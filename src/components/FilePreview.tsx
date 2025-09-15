import { useState } from "react";
import { Copy, Play, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FilePreviewProps {
  file: File;
  url: string;
  name: string;
  type: "images" | "sounds";
  onRemove: () => void;
  uploadedAt?: Date;
}

const FilePreview = ({ file, url, name, type, onRemove, uploadedAt }: FilePreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleCopyUrl = () => {
    console.log("=== COPY BUTTON CLICKED ===");
    console.log("URL to copy:", url);
    
    if (!url) {
      console.error("No URL to copy!");
      toast({
        title: "Error",
        description: "No URL available to copy",
        variant: "destructive",
      });
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          console.log("✅ Successfully copied via clipboard API");
          toast({
            title: "URL Copied!",
            description: "KHSRNY storage URL copied to clipboard",
          });
        }).catch((err) => {
          console.error("Clipboard API failed:", err);
          fallbackCopy();
        });
      } else {
        console.log("Clipboard API not available, using fallback");
        fallbackCopy();
      }
    } catch (err) {
      console.error("Copy error:", err);
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log("✅ Successfully copied via fallback method");
        toast({
          title: "URL Copied!",
          description: "KHSRNY storage URL copied to clipboard",
        });
      } else {
        throw new Error("Fallback copy failed");
      }
    } catch (err) {
      console.error("❌ All copy methods failed:", err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleRemove = () => {
    console.log("=== DELETE BUTTON CLICKED ===");
    console.log("Removing file:", name);
    onRemove();
  };

  const handlePlayPause = () => {
    if (!audioElement) {
      const audio = new Audio(url);
      audio.addEventListener("ended", () => setIsPlaying(false));
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="cyber-border rounded-xl p-4 bg-card/80 backdrop-blur-sm animate-fade-in">
      <div className="space-y-4">
        {type === "images" ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={url}
              alt={file.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image load error:", e);
                console.log("Failed URL:", url);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayPause}
                size="sm"
                className="neon-glow bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div className="text-center">
                <div className="text-sm font-medium text-neon-cyan">🎵 Audio File</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isPlaying ? "Playing..." : "Ready to play"}
                </div>
              </div>
              <audio 
                controls 
                className="w-full max-w-xs" 
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={url} type={file.type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
            {uploadedAt && (
              <div className="text-xs text-muted-foreground">
                Uploaded: {uploadedAt.toLocaleDateString()} {uploadedAt.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 relative z-10">
            <button
              onClick={handleCopyUrl}
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-neon-cyan/30 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 h-9 px-3 cursor-pointer bg-background text-foreground"
              type="button"
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy URL
            </button>
            
            <button
              onClick={handleRemove}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-3 cursor-pointer"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;