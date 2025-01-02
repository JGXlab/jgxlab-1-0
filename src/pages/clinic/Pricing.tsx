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
  }
];

const Pricing = () => {
  return (
    <ClinicLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Pricing</h1>
        </div>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-center text-primary">
              Service Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-accent/50">
                  <TableHead className="w-[70%] font-semibold">Service</TableHead>
                  <TableHead className="text-right font-semibold">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((item, index) => (
                  <TableRow 
                    key={index}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <TableCell className="font-medium">{item.service}</TableCell>
                    <TableCell className="text-right">
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