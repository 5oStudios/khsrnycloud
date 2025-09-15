import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import FileUpload from "@/components/FileUpload";
import FilePreview from "@/components/FilePreview";

type TabType = "images" | "sounds";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("images");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedSounds, setUploadedSounds] = useState<File[]>([]);

  const handleFilesUploaded = (files: File[]) => {
    if (activeTab === "images") {
      setUploadedImages(prev => [...prev, ...files]);
    } else {
      setUploadedSounds(prev => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (activeTab === "images") {
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setUploadedSounds(prev => prev.filter((_, i) => i !== index));
    }
  };

  const currentFiles = activeTab === "images" ? uploadedImages : uploadedSounds;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <FileUpload type={activeTab} onFilesUploaded={handleFilesUploaded} />
        
        {currentFiles.length > 0 && (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">
              <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                Uploaded {activeTab === "images" ? "Images" : "Sounds"}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFiles.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${index}`}
                  file={file}
                  type={activeTab}
                  onRemove={() => handleRemoveFile(index)}
                />
              ))}
            </div>
          </div>
        )}
        
        {currentFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">
              {activeTab === "images" ? "📷" : "🎵"}
            </div>
            <p className="text-muted-foreground">
              No {activeTab} uploaded yet. Drop some files above to get started!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
