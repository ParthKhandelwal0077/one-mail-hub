import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import EmailList from "@/components/dashboard/EmailList";
import FilterBar from "@/components/dashboard/FilterBar";
import { EmailCategory, EmailFilter } from "@/types/email";

const Dashboard = () => {
  const [filters, setFilters] = useState<EmailFilter>({
    category: null,
    searchQuery: "",
    sender: "",
    dateFrom: null,
    dateTo: null,
  });

  const handleFilterChange = (newFilters: Partial<EmailFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        <EmailList filters={filters} />
      </main>
    </div>
  );
};

export default Dashboard;
