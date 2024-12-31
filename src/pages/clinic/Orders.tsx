import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";

const Orders = () => {
  return (
    <>
      <ClinicSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            View and manage your laboratory test orders
          </p>
        </div>
      </main>
    </>
  );
};

export default Orders;