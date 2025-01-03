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
import { PaymentButton } from "@/components/lab-scripts/PaymentButton";
import { useToast } from "@/hooks/use-toast";

const pricingData = [
  {
    service: "Surgical day appliance (Night guard included)",
    price: 275.00,
    stripe_price_id: "price_1OvKYyKuudEiZepQPMqPzLZq"
  },
  {
    service: "Implant detection (IDID)",
    price: 100.00,
    stripe_price_id: "price_1OvKZbKuudEiZepQxgTrWxDp"
  },
  {
    service: "Further Revisions (PTIs)",
    price: 100.00,
    stripe_price_id: "price_1OvKa3KuudEiZepQKXx9Xp8Y"
  },
  {
    service: "Nightguard",
    price: 50.00,
    stripe_price_id: "price_1OvKaQKuudEiZepQbvEEXtxR"
  },
  {
    service: "Final DLZ (Zi / PMMA)",
    price: 100.00,
    stripe_price_id: "price_1OvKanKuudEiZepQGxfyPGWB"
  },
  {
    service: "Final Ti-bar & SS",
    price: 250.00,
    stripe_price_id: "price_1OvKbBKuudEiZepQxdxVxR8Y"
  },
  {
    service: "Ti-Bar Design",
    price: 250.00,
    stripe_price_id: "price_1OvKbYKuudEiZepQPgpbxR8Y"
  },
  {
    service: "Express design (in 24 hours)",
    price: 50.00,
    stripe_price_id: "price_1OvKbvKuudEiZepQPMqPzLZq"
  }
];

const Pricing = () => {
  const { toast } = useToast();

  const handlePayment = async (stripe_price_id: string, service: string) => {
    try {
      console.log('Creating checkout session for price:', stripe_price_id);
      
      const response = await fetch('/functions/v1/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems: [{
            price: stripe_price_id,
            quantity: 1
          }]
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      console.log('Redirecting to checkout URL:', url);
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "There was a problem initiating the payment. Please try again.",
      });
    }
  };

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
                  <TableHead className="w-[50%] font-bold text-primary/90 text-base">
                    Service
                  </TableHead>
                  <TableHead className="text-right font-bold text-primary/90 text-base">
                    Price
                  </TableHead>
                  <TableHead className="w-[20%]"></TableHead>
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
                    <TableCell className="text-right">
                      <PaymentButton
                        onClick={() => handlePayment(item.stripe_price_id, item.service)}
                      />
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