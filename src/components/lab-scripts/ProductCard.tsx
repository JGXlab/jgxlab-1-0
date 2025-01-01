import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  title: string;
  description: string;
  imagePath: string;
}

export const ProductCard = ({ title, description, imagePath }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={imagePath}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-6">
          {description}
        </CardDescription>
        <Button 
          onClick={() => navigate(`/clinic/addnewlabscript/surgical-day-appliance`)}
          className="w-full group/btn flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Design
          <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};