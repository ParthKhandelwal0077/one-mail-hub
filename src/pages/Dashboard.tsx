import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import EmailList from "@/components/dashboard/EmailList";
import FilterBar from "@/components/dashboard/FilterBar";
import UserProfileCard from "@/components/dashboard/UserProfileCard";
import { EmailCategory, EmailFilter } from "@/types/email";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <Tabs defaultValue="emails" className="flex-1 flex flex-col">
          <div className="border-b border-border">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="emails" className="flex-1 flex flex-col m-0">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            <EmailList filters={filters} />
          </TabsContent>
          
          <TabsContent value="profile" className="flex-1 overflow-auto p-6">
            <UserProfileCard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
