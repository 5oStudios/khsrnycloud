import { useState } from "react";
import { Copy, Play, Pause, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FilePreviewProps {
  file: File;
  url: string;
  name: string;
  type: "images" | "sounds";
  onRemove: () => void;
}

const FilePreview = ({ file, url, name, type, onRemove }: FilePreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleCopyUrl = async () => {
    console.log("Copy button clicked, URL:", url);
    try {
      if (!navigator.clipboard) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: "URL Copied!",
          description: "KHSRNY storage URL copied to clipboard",
        });
        console.log("Copied URL using fallback method:", url);
        return;
      }

      await navigator.clipboard.writeText(url);
      toast({
        title: "URL Copied!",
        description: "KHSRNY storage URL copied to clipboard",
      });
      console.log("Successfully copied URL:", url);
    } catch (err) {
      console.error("Copy failed:", err);
      console.log("Failed to copy URL:", url);
      
      // Try fallback method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: "URL Copied!",
          description: "KHSRNY storage URL copied to clipboard (fallback method)",
        });
        console.log("Copied URL using fallback after error:", url);
      } catch (fallbackErr) {
        console.error("Fallback copy also failed:", fallbackErr);
        toast({
          title: "Failed to copy",
          description: "Could not copy URL to clipboard",
          variant: "destructive",
        });
      }
    }
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
            <div className="text-xs text-muted-foreground mt-1 break-all">
              URL: {url}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Copy button clicked!");
                handleCopyUrl();
              }}
              size="sm"
              variant="outline"
              className="flex-1 border-neon-cyan/30 hover:border-neon-cyan/50 hover:bg-neon-cyan/10"
              type="button"
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy URL
            </Button>
            
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Delete button clicked!");
                onRemove();
              }}
              size="sm"
              variant="destructive"
              className="px-3"
              type="button"
            >
              ×
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;