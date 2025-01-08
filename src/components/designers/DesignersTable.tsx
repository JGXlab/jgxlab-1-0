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
import { User, Mail, Phone, Calendar } from "lucide-react";

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
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Name</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Created At</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {designers.map((designer) => (
            <TableRow 
              key={designer.id}
              className="hover:bg-gray-50/50 transition-colors duration-200"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {designer.first_name} {designer.last_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ID: {designer.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{designer.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{designer.phone}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(designer.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};