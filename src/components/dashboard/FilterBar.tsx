import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { EmailCategory, EmailFilter } from "@/types/email";

interface FilterBarProps {
  filters: EmailFilter;
  onFilterChange: (filters: Partial<EmailFilter>) => void;
}

const categories: { value: EmailCategory; label: string; color: string }[] = [
  { value: "interested", label: "Interested", color: "bg-category-interested" },
  { value: "meeting", label: "Meeting Booked", color: "bg-category-meeting" },
  { value: "not-interested", label: "Not Interested", color: "bg-category-not-interested" },
  { value: "spam", label: "Spam", color: "bg-category-spam" },
  { value: "ooo", label: "Out of Office", color: "bg-category-ooo" },
  { value: "uncategorized", label: "Uncategorized", color: "bg-category-uncategorized" },
];

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  return (
    <div className="bg-card border-b border-border p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-text-tertiary" />
        <Input
          placeholder="Search emails..."
          className="pl-10"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.category === null ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange({ category: null })}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={filters.category === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange({ category: cat.value })}
            className="relative"
          >
            <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${cat.color}`} />
            <span className="pl-3">{cat.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
