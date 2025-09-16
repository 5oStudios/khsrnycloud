import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FilePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  type: "images" | "sounds";
}

const FilePagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  type
}: FilePaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              isActive={currentPage === i}
              className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
            isActive={currentPage === 1}
            className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis className="w-8 h-8 sm:w-10 sm:h-10" />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              isActive={currentPage === i}
              className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis className="w-8 h-8 sm:w-10 sm:h-10" />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
              isActive={currentPage === totalPages}
              className="w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (totalItems === 0) return null;

  return (
    <div className="space-y-4 mt-6">
      {/* Stats and Items per page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Showing {startItem}-{endItem} of {totalItems} {type}
        </div>
        
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Items per page:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent className="gap-1 sm:gap-2">
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2 sm:h-10 sm:px-3"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Previous</span>
              </Button>
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2 sm:h-10 sm:px-3"
              >
                <span className="hidden sm:inline mr-1">Next</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default FilePagination;