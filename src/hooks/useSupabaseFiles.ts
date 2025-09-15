import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseFile {
  file: File;
  url: string;
  name: string;
}

export const useSupabaseFiles = (type: "images" | "sounds") => {
  const [files, setFiles] = useState<SupabaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const bucketId = type === "images" ? "khsrny-images" : "khsrny-sounds";

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from(bucketId)
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error("Error loading files:", error);
        return;
      }

      if (data) {
        const filePromises = data.map(async (item) => {
          const { data: urlData } = supabase.storage
            .from(bucketId)
            .getPublicUrl(item.name);

          // Create a mock File object since we can't recreate the original File
          const mockFile = new File([], item.name, {
            type: type === "images" ? "image/jpeg" : "audio/mpeg"
          });

          return {
            file: mockFile,
            url: urlData.publicUrl,
            name: item.name
          };
        });

        const loadedFiles = await Promise.all(filePromises);
        setFiles(loadedFiles);
      }
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [type]);

  const addFiles = (newFiles: SupabaseFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove) {
      // Delete from Supabase storage
      supabase.storage
        .from(bucketId)
        .remove([fileToRemove.name])
        .then(({ error }) => {
          if (error) {
            console.error("Error deleting file:", error);
          }
        });
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    files,
    isLoading,
    addFiles,
    removeFile,
    reloadFiles: loadFiles
  };
};