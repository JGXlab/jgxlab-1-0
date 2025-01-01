import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Mail, Phone } from "lucide-react";

interface Designer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export const DesignersTable = () => {
  const { data: designers, isLoading } = useQuery({
    queryKey: ["designers"],
    queryFn: async () => {
      console.log("Fetching designers...");
      const { data, error } = await supabase
        .from("designers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching designers:", error);
        throw error;
      }

      console.log("Fetched designers:", data);
      return data as Designer[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!designers?.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto mb-4" />
          <p>No designers found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-600">Name</TableHead>
            <TableHead className="font-semibold text-gray-600">Email</TableHead>
            <TableHead className="font-semibold text-gray-600">Phone</TableHead>
            <TableHead className="font-semibold text-gray-600">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {designers.map((designer) => (
            <TableRow 
              key={designer.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <TableCell className="flex items-center gap-3 py-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">
                  {designer.first_name} {designer.last_name}
                </span>
              </TableCell>
              <TableCell className="flex items-center gap-3 py-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <span>{designer.email}</span>
              </TableCell>
              <TableCell className="flex items-center gap-3 py-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <span>{designer.phone}</span>
              </TableCell>
              <TableCell className="text-gray-600">
                {new Date(designer.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};