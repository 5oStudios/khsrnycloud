import { useState } from "react";
import { Calendar, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DateFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  onClear: () => void;
  totalCount: number;
  filteredCount: number;
  type: "images" | "sounds";
}

const DateFilter = ({ 
  startDate, 
  endDate, 
  onDateChange, 
  onClear, 
  totalCount, 
  filteredCount,
  type 
}: DateFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onDateChange(startDate, date);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const hasActiveFilter = startDate || endDate;

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 bg-card/50 backdrop-blur-sm border-neon-cyan/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4 text-neon-cyan" />
            Filter {type} by upload date
            {hasActiveFilter && (
              <span className="text-xs bg-neon-purple/20 px-2 py-1 rounded-full border border-neon-purple/30">
                {filteredCount} of {totalCount}
              </span>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-neon-cyan hover:bg-neon-cyan/10"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  From Date
                </label>
                <Input
                  type="date"
                  value={formatDate(startDate)}
                  onChange={handleStartDateChange}
                  className="border-neon-cyan/30 focus:border-neon-cyan/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  To Date
                </label>
                <Input
                  type="date"
                  value={formatDate(endDate)}
                  onChange={handleEndDateChange}
                  className="border-neon-cyan/30 focus:border-neon-cyan/50"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Showing {filteredCount} of {totalCount} {type}
              </div>
              {hasActiveFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClear}
                  className="border-neon-purple/30 hover:border-neon-purple/50 hover:bg-neon-purple/10"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DateFilter;