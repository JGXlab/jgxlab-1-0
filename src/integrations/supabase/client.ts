// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zuwhzwfdourrvrwhrajj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1d2h6d2Zkb3VycnZyd2hyYWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2ODIyODcsImV4cCI6MjA1MTI1ODI4N30.dDKL1yz2oPE00YiG0agm8gwK8rPrlThAHbXOhOKkIpQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);