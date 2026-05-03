import { useGetGuide, useUpdateGuide, getGetGuideQueryKey } from "@workspace/api-client-react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import GuideForm from "@/components/guides/guide-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function GuideEditor() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0", 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: guide, isLoading, error } = useGetGuide(id, {
    query: { enabled: !!id, queryKey: getGetGuideQueryKey(id) }
  });

  const updateGuide = useUpdateGuide();

  const handleSubmit = async (data: any) => {
    try {
      await updateGuide.mutateAsync({ id, data });
      queryClient.invalidateQueries({ queryKey: getGetGuideQueryKey(id) });
      toast.success("Guide updated successfully!");
      setLocation(`/guides/${id}`);
    } catch (error) {
      toast.error("Failed to update guide");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32 glass-panel" />
        <Skeleton className="h-[400px] glass-panel" />
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white">Guide not found</h2>
        <Button variant="link" onClick={() => setLocation("/guides")} className="text-blue-400 mt-4">
          Return to guides
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => setLocation(`/guides/${id}`)} className="glass-panel border-white/10 text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-white">Edit Guide</h1>
      </div>
      
      <GuideForm 
        initialData={guide} 
        onSubmit={handleSubmit} 
        isSaving={updateGuide.isPending} 
      />
    </div>
  );
}
