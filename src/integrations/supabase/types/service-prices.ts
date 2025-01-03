export type ServicePrices = {
  Row: {
    id: string;
    service_name: string;
    price: number;
    created_at: string;
    stripe_product_id: string | null;
    stripe_price_id: string | null;
    is_addon: boolean;
    addon_type: string | null;
  };
  Insert: {
    id?: string;
    service_name: string;
    price: number;
    created_at?: string;
    stripe_product_id?: string | null;
    stripe_price_id?: string | null;
    is_addon?: boolean;
    addon_type?: string | null;
  };
  Update: {
    id?: string;
    service_name?: string;
    price?: number;
    created_at?: string;
    stripe_product_id?: string | null;
    stripe_price_id?: string | null;
    is_addon?: boolean;
    addon_type?: string | null;
  };
};