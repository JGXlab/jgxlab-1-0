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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";

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
      <div className="flex flex-col max-w-[1200px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
                <p className="text-sm text-gray-500">View our service pricing and packages</p>
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
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
};

export default Pricing;