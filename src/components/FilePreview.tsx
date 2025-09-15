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

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("=== DOWNLOAD CLICKED ===");
    
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

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("=== PLAY/PAUSE CLICKED ===");
    console.log("Play/Pause button clicked, isPlaying:", isPlaying);
    console.log("Audio element:", audioRef.current);
    
    if (!audioRef.current) {
      console.error("Audio element not found");
      return;
    }
    
    try {
      if (isPlaying) {
        console.log("Pausing audio");
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log("Playing audio");
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio play failed:", err);
      toast({
        title: "Playback Error",
        description: "Unable to play audio file",
        variant: "destructive",
      });
    }
  };

  const handleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("=== MUTE CLICKED ===");
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
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Force load metadata
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [url]);

  return (
    <div className="cyber-border rounded-xl p-2 sm:p-3 md:p-4 bg-card/80 backdrop-blur-sm animate-fade-in w-full flex flex-col">
      <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col min-h-0">
        {type === "images" ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted flex-1">
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
          <div className="space-y-2 sm:space-y-3 flex-1">
            {/* Audio Player Header */}
            <div className="flex items-center justify-center p-2 sm:p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 rounded-full bg-neon-purple/20 border border-neon-purple/30">
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 text-neon-purple" />
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm font-medium text-neon-cyan">🎵 Audio File</div>
                  <div className="text-xs text-muted-foreground">
                    {isPlaying ? "Playing..." : "Ready to play"}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Audio Controls Container */}
            <div className="bg-card/50 rounded-lg p-2 sm:p-3 md:p-4 border border-neon-cyan/20 space-y-2 sm:space-y-3">
              {/* Hidden audio element with proper setup */}
              <audio 
                ref={audioRef}
                src={url}
                preload="metadata"
                className="hidden"
                crossOrigin="anonymous"
              />

              {/* Progress Bar */}
              <div className="space-y-1 sm:space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 sm:h-2 cursor-pointer touch-manipulation" 
                     onClick={(e) => {
                       if (audioRef.current && duration > 0) {
                         const rect = e.currentTarget.getBoundingClientRect();
                         const x = e.clientX - rect.left;
                         const percentage = x / rect.width;
                         const newTime = percentage * duration;
                         audioRef.current.currentTime = newTime;
                       }
                     }}>
                  <div 
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan h-1.5 sm:h-2 rounded-full transition-all duration-150"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons Row */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 pt-1 relative z-10">
                {/* Play/Pause Button - Larger for mobile */}
                <button
                  onClick={handlePlayPause}
                  className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neon-purple/20 hover:bg-neon-purple/30 active:bg-neon-purple/40 border border-neon-purple/50 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                  type="button"
                  aria-label={isPlaying ? "Pause" : "Play"}
                  style={{ pointerEvents: 'all' }}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-neon-purple pointer-events-none" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 text-neon-purple ml-0.5 pointer-events-none" />
                  )}
                </button>

                {/* Mute Button */}
                <button
                  onClick={handleMute}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neon-cyan/20 hover:bg-neon-cyan/30 active:bg-neon-cyan/40 border border-neon-cyan/50 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                  type="button"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  style={{ pointerEvents: 'all' }}
                >
                  {isMuted ? (
                    <VolumeX className="h-3 w-3 sm:h-4 sm:w-4 text-neon-cyan pointer-events-none" />
                  ) : (
                    <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 text-neon-cyan pointer-events-none" />
                  )}
                </button>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-500/20 hover:bg-green-500/30 active:bg-green-500/40 border border-green-500/50 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                  type="button"
                  aria-label="Download"
                  style={{ pointerEvents: 'all' }}
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 pointer-events-none" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* File Info and Actions - Always at bottom */}
        <div className="space-y-2 sm:space-y-3 mt-auto pt-2">
          <div className="px-1">
            <div className="text-sm font-medium truncate break-all">{file.name}</div>
            <div className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
            {uploadedAt && (
              <div className="text-xs text-muted-foreground">
                Uploaded: {uploadedAt.toLocaleDateString()} {uploadedAt.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex space-x-1.5 sm:space-x-2">
            <button
              onClick={handleCopyUrl}
              className="flex-1 inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-neon-cyan/30 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 h-8 sm:h-9 px-2 sm:px-3 cursor-pointer bg-background text-foreground touch-manipulation"
              type="button"
            >
              <Copy className="h-3 w-3 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Copy URL</span>
              <span className="sm:hidden">Copy</span>
            </button>

            {type === "sounds" && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 h-8 sm:h-9 px-2 sm:px-3 cursor-pointer bg-background text-green-400 touch-manipulation"
                type="button"
              >
                <Download className="h-3 w-3" />
              </button>
            )}
            
            <button
              onClick={handleRemove}
              className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 sm:h-9 px-2 sm:px-3 cursor-pointer touch-manipulation"
              type="button"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;