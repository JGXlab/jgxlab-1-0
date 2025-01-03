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
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ServicePrice {
  id: string;
  service_name: string;
  price: number;
  stripe_price_id: string;
}

const fetchPrices = async () => {
  console.log('Fetching service prices from Supabase...');
  const { data, error } = await supabase
    .from('service_prices')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }

  console.log('Fetched prices:', data);
  return data;
};

const Pricing = () => {
  const { toast } = useToast();
  
  const { data: pricingData, isLoading, error } = useQuery({
    queryKey: ['servicePrices'],
    queryFn: fetchPrices,
  });

  const handlePayment = async (stripe_price_id: string, service: string) => {
    try {
      console.log('Creating checkout session for price:', stripe_price_id);
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          lineItems: [{
            price: stripe_price_id,
            quantity: 1
          }]
        }
      });

      if (error) {
        console.error('Payment error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "There was a problem initiating the payment. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <ClinicLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ClinicLayout>
    );
  }

  if (error) {
    return (
      <ClinicLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Error loading pricing data. Please try again later.</div>
        </div>
      </ClinicLayout>
    );
  }

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
                {pricingData?.map((item: ServicePrice) => (
                  <TableRow 
                    key={item.id}
                    className="hover:bg-white/80 transition-all duration-200 cursor-default border-b border-accent"
                  >
                    <TableCell className="font-medium py-4 text-foreground/80">
                      {item.service_name}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary py-4">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <PaymentButton
                        onClick={() => handlePayment(item.stripe_price_id, item.service_name)}
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