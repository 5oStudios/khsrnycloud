import { useState, useRef, useEffect } from "react";
import { Copy, Play, Pause, X, Download, Volume2, VolumeX } from "lucide-react";
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
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "File download has been initiated",
    });
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.error("Audio play failed:", err);
        toast({
          title: "Playback Error",
          description: "Unable to play audio file",
          variant: "destructive",
        });
      });
      setIsPlaying(true);
    }
  };

  const handleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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
          <div className="space-y-3">
            {/* Audio Player Header */}
            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-neon-purple/20 border border-neon-purple/30">
                  <Play className="h-4 w-4 text-neon-purple" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-neon-cyan">🎵 Audio File</div>
                  <div className="text-xs text-muted-foreground">
                    {isPlaying ? "Playing..." : "Ready to play"}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Audio Controls */}
            <div className="bg-card/50 rounded-lg p-3 border border-neon-cyan/20">
              {/* Hidden audio element */}
              <audio 
                ref={audioRef}
                src={url}
                preload="metadata"
                className="hidden"
              />

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan h-1 rounded-full transition-all duration-300"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-3">
                {/* Play/Pause Button */}
                <button
                  onClick={handlePlayPause}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 transition-colors"
                  type="button"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-neon-purple" />
                  ) : (
                    <Play className="h-4 w-4 text-neon-purple ml-0.5" />
                  )}
                </button>

                {/* Mute Button */}
                <button
                  onClick={handleMute}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan/50 transition-colors"
                  type="button"
                >
                  {isMuted ? (
                    <VolumeX className="h-3 w-3 text-neon-cyan" />
                  ) : (
                    <Volume2 className="h-3 w-3 text-neon-cyan" />
                  )}
                </button>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 transition-colors"
                  type="button"
                >
                  <Download className="h-3 w-3 text-green-400" />
                </button>
              </div>
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
              <span className="hidden sm:inline">Copy URL</span>
              <span className="sm:hidden">Copy</span>
            </button>

            {type === "sounds" && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 h-9 px-3 cursor-pointer bg-background text-green-400"
                type="button"
              >
                <Download className="h-3 w-3" />
              </button>
            )}
            
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