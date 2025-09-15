import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseFile {
  file: File;
  url: string;
  name: string;
  uploadedAt: Date;
  size: number;
}

export const useSupabaseFiles = (type: "images" | "sounds") => {
  const [allFiles, setAllFiles] = useState<SupabaseFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SupabaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const bucketId = type === "images" ? "khsrny-images" : "khsrny-sounds";

  // Filter files based on date range
  useEffect(() => {
    let filtered = [...allFiles];
    
    if (dateFilter.startDate && dateFilter.endDate) {
      filtered = allFiles.filter(file => {
        const fileDate = file.uploadedAt;
        return fileDate >= dateFilter.startDate! && fileDate <= dateFilter.endDate!;
      });
    } else if (dateFilter.startDate) {
      filtered = allFiles.filter(file => file.uploadedAt >= dateFilter.startDate!);
    } else if (dateFilter.endDate) {
      filtered = allFiles.filter(file => file.uploadedAt <= dateFilter.endDate!);
    }
    
    // Sort by upload date (newest first)
    filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    
    setFilteredFiles(filtered);
  }, [allFiles, dateFilter]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from(bucketId)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
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
            name: item.name,
            uploadedAt: new Date(item.created_at || Date.now()),
            size: item.metadata?.size || 0
          };
        });

        const loadedFiles = await Promise.all(filePromises);
        setAllFiles(loadedFiles);
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
    setAllFiles(prev => [...newFiles, ...prev]); // Add new files at the beginning
  };

  const removeFile = (index: number) => {
    const fileToRemove = filteredFiles[index];
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
    // Remove from both arrays
    setAllFiles(prev => prev.filter(f => f.name !== fileToRemove.name));
    setFilteredFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateDateFilter = (startDate: Date | null, endDate: Date | null) => {
    setDateFilter({ startDate, endDate });
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: null, endDate: null });
  };

  return {
    files: filteredFiles,
    allFiles,
    isLoading,
    addFiles,
    removeFile,
    reloadFiles: loadFiles,
    dateFilter,
    updateDateFilter,
    clearDateFilter,
    totalCount: allFiles.length,
    filteredCount: filteredFiles.length
  };
};