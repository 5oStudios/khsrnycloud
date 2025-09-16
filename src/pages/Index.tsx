import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import FileUpload from "@/components/FileUpload";
import FilePreview from "@/components/FilePreview";
import DateFilter from "@/components/DateFilter";
import FilePagination from "@/components/FilePagination";
import { useSupabaseFiles } from "@/hooks/useSupabaseFiles";

type TabType = "images" | "sounds";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("images");
  
  const { 
    files: uploadedImages, 
    isLoading: imagesLoading, 
    addFiles: addImages, 
    removeFile: removeImage,
    dateFilter: imagesDateFilter,
    updateDateFilter: updateImagesDateFilter,
    clearDateFilter: clearImagesDateFilter,
    totalCount: totalImagesCount,
    filteredCount: filteredImagesCount,
    currentPage: imagesCurrentPage,
    itemsPerPage: imagesItemsPerPage,
    handlePageChange: handleImagesPageChange,
    handleItemsPerPageChange: handleImagesItemsPerPageChange
  } = useSupabaseFiles("images");
  
  const { 
    files: uploadedSounds, 
    isLoading: soundsLoading, 
    addFiles: addSounds, 
    removeFile: removeSound,
    dateFilter: soundsDateFilter,
    updateDateFilter: updateSoundsDateFilter,
    clearDateFilter: clearSoundsDateFilter,
    totalCount: totalSoundsCount,
    filteredCount: filteredSoundsCount,
    currentPage: soundsCurrentPage,
    itemsPerPage: soundsItemsPerPage,
    handlePageChange: handleSoundsPageChange,
    handleItemsPerPageChange: handleSoundsItemsPerPageChange
  } = useSupabaseFiles("sounds");

  const handleFilesUploaded = (files: { file: File; url: string; name: string; uploadedAt: Date; size: number }[]) => {
    if (activeTab === "images") {
      addImages(files);
    } else {
      addSounds(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    if (activeTab === "images") {
      removeImage(index);
    } else {
      removeSound(index);
    }
  };

  const currentFiles = activeTab === "images" ? uploadedImages : uploadedSounds;
  const isLoading = activeTab === "images" ? imagesLoading : soundsLoading;
  const currentDateFilter = activeTab === "images" ? imagesDateFilter : soundsDateFilter;
  const currentTotalCount = activeTab === "images" ? totalImagesCount : totalSoundsCount;
  const currentFilteredCount = activeTab === "images" ? filteredImagesCount : filteredSoundsCount;
  const currentPage = activeTab === "images" ? imagesCurrentPage : soundsCurrentPage;
  const currentItemsPerPage = activeTab === "images" ? imagesItemsPerPage : soundsItemsPerPage;
  const handlePageChange = activeTab === "images" ? handleImagesPageChange : handleSoundsPageChange;
  const handleItemsPerPageChange = activeTab === "images" ? handleImagesItemsPerPageChange : handleSoundsItemsPerPageChange;

  const handleDateFilterChange = (startDate: Date | null, endDate: Date | null) => {
    if (activeTab === "images") {
      updateImagesDateFilter(startDate, endDate);
    } else {
      updateSoundsDateFilter(startDate, endDate);
    }
  };

  const handleClearDateFilter = () => {
    if (activeTab === "images") {
      clearImagesDateFilter();
    } else {
      clearSoundsDateFilter();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <FileUpload type={activeTab} onFilesUploaded={handleFilesUploaded} />
        
        <DateFilter
          startDate={currentDateFilter.startDate}
          endDate={currentDateFilter.endDate}
          onDateChange={handleDateFilterChange}
          onClear={handleClearDateFilter}
          totalCount={currentTotalCount}
          filteredCount={currentFilteredCount}
          type={activeTab}
        />
        
        <div className="w-full max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-neon-cyan">Loading {activeTab}...</div>
            </div>
          ) : currentFilteredCount > 0 ? (
            <>
              {/* Header with total count */}
              <div className="mb-6 text-center space-y-2">
                <h2 className="text-xl font-semibold">
                  <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                    Uploaded {activeTab === "images" ? "Images" : "Sounds"}
                  </span>
                </h2>
                <div className="text-sm text-muted-foreground">
                  Total: {currentTotalCount} {activeTab}
                  {currentFilteredCount !== currentTotalCount && (
                    <span className="ml-2 text-neon-cyan">
                      ({currentFilteredCount} filtered)
                    </span>
                  )}
                </div>
              </div>
              
              {/* Files Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
                {currentFiles.map((fileData, index) => {
                  // Calculate the actual index in the filtered array for proper removal
                  const actualIndex = (currentPage - 1) * currentItemsPerPage + index;
                  return (
                    <FilePreview
                      key={`${fileData.name}-${actualIndex}`}
                      file={fileData.file}
                      url={fileData.url}
                      name={fileData.name}
                      type={activeTab}
                      onRemove={() => handleRemoveFile(actualIndex)}
                      uploadedAt={fileData.uploadedAt}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              <FilePagination
                totalItems={currentFilteredCount}
                itemsPerPage={currentItemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                type={activeTab}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">
                {activeTab === "images" ? "📷" : "🎵"}
              </div>
              <p className="text-muted-foreground">
                {currentTotalCount === 0 
                  ? `No ${activeTab} uploaded yet. Drop some files above to get started!`
                  : `No ${activeTab} match the current filter. Try adjusting your date range.`
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;