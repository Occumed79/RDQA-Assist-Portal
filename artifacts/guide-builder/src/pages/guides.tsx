import { useState } from "react";
import { useListGuides, useDeleteGuide, getListGuidesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, PlusCircle, BookOpen, Clock, MoreVertical, Trash2, Edit2, Eye, ListOrdered } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function GuidesList() {
  const { data: guides, isLoading } = useListGuides();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  
  const deleteGuide = useDeleteGuide();
  const queryClient = useQueryClient();

  const categories = ["All", ...new Set(guides?.map(g => g.category).filter(Boolean) || [])];

  const filteredGuides = guides?.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(search.toLowerCase()) || 
                          guide.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || guide.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleDelete = async (id: number) => {
    try {
      await deleteGuide.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListGuidesQueryKey() });
      toast.success("Guide deleted successfully");
    } catch (error) {
      toast.error("Failed to delete guide");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 glass-panel bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                  categoryFilter === category 
                    ? "bg-primary/20 text-blue-300 border-blue-500/30" 
                    : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 glass-panel rounded-xl" />
          ))}
        </div>
      ) : filteredGuides.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-white mb-2">No guides found</h3>
            <p className="text-muted-foreground">Get started by creating your first workflow guide.</p>
          </div>
          <Link href="/guides/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Guide
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide, i) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-panel glass-panel-hover h-full flex flex-col rounded-xl overflow-hidden group">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-blue-300">
                      {guide.category || "Uncategorized"}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-white hover:bg-white/10">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-panel border-white/10 bg-[#0a101d]/95 backdrop-blur-xl text-white">
                        <Link href={`/guides/${guide.id}`}>
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                            <Eye className="w-4 h-4 mr-2" /> View
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/guides/${guide.id}/edit`}>
                          <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-red-400/20 hover:text-red-300" onClick={() => handleDelete(guide.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    <Link href={`/guides/${guide.id}`} className="hover:text-blue-400 transition-colors">
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                    {guide.description || "No description provided."}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>{guide.steps?.length || 0} steps</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{format(new Date(guide.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
