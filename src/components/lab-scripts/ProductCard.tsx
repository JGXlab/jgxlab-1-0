import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  title: string;
  description: string;
  imagePath: string;
}

export const ProductCard = ({ title, description, imagePath }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
        <CardDescription className="text-muted">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => navigate(`/clinic/addnewlabscript/surgical-day-appliance`)}
          className="w-full group"
        >
          Select Design
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};