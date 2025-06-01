import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const artworkUploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.number().min(1900).max(2030),
  medium: z.string().min(1, "Medium is required"),
  size: z.string().min(1, "Size is required"),
  description: z.string().optional(),
  availability: z.enum(["available", "sold", "not-for-sale"]),
  tags: z.string().optional(),
  featured: z.boolean().default(false),
});

type ArtworkUploadData = z.infer<typeof artworkUploadSchema>;

export function ArtworkUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ArtworkUploadData>({
    resolver: zodResolver(artworkUploadSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      medium: "",
      size: "",
      description: "",
      availability: "available",
      tags: "",
      featured: false,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: ArtworkUploadData & { image: File }) => {
      const formData = new FormData();
      formData.append('image', data.image);
      formData.append('title', data.title);
      formData.append('year', data.year.toString());
      formData.append('medium', data.medium);
      formData.append('size', data.size);
      if (data.description) formData.append('description', data.description);
      formData.append('availability', data.availability);
      if (data.tags) formData.append('tags', data.tags);
      formData.append('featured', data.featured.toString());

      const response = await fetch('/api/admin/paintings', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Artwork uploaded successfully.",
      });
      form.reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/paintings"] });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArtworkUploadData) => {
    if (!selectedFile) {
      toast({
        title: "Image required",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ ...data, image: selectedFile });
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="font-serif text-xl font-semibold text-deep-charcoal mb-6">
        Add New Artwork
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artwork Image
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragOver ? 'border-deep-charcoal bg-gray-50' : 'border-light-border hover:border-deep-charcoal'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              {selectedFile ? (
                <div>
                  <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
                  <p className="text-gray-600 font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input 
                id="file-input"
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileInput}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Artwork title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1900} 
                      max={2030}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <FormControl>
                    <Input placeholder="Oil on canvas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="80 × 100 cm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={4}
                    placeholder="Describe the artwork, inspiration, technique..."
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="not-for-sale">Not for Sale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="abstract, contemporary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-end space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">
                    Mark as New
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-deep-charcoal text-white hover:bg-gray-800"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Uploading...
              </>
            ) : (
              <>
                Add Artwork to Gallery
                <i className="fas fa-plus ml-2"></i>
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
