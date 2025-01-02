import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pricingData = [
  {
    service: "Surgical day appliance (Night guard included)",
    price: 275.00
  },
  {
    service: "Implant detection (IDID)",
    price: 100.00
  },
  {
    service: "Further Revisions (PTIs)",
    price: 100.00
  },
  {
    service: "Nightguard",
    price: 50.00
  },
  {
    service: "Final DLZ (Zi / PMMA)",
    price: 100.00
  },
  {
    service: "Final Ti-bar & SS",
    price: 250.00
  },
  {
    service: "Ti-Bar Design",
    price: 250.00
  },
  {
    service: "Express design (in 24 hours)",
    price: 50.00
  }
];

const Pricing = () => {
  return (
    <ClinicLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            Pricing
          </h1>
        </div>
        
        <Card className="animate-fade-in bg-gradient-to-br from-white to-accent/30 border-none shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Service Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/50 border-b-2 border-primary/10">
                  <TableHead className="w-[70%] font-bold text-primary/90 text-base">
                    Service
                  </TableHead>
                  <TableHead className="text-right font-bold text-primary/90 text-base">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((item, index) => (
                  <TableRow 
                    key={index}
                    className="hover:bg-white/80 transition-all duration-200 cursor-default border-b border-accent"
                  >
                    <TableCell className="font-medium py-4 text-foreground/80">
                      {item.service}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary py-4">
                      ${item.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClinicLayout>
  );
};

export default Pricing;