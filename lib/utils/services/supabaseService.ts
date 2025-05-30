import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://vdsbcwohawqfqhwefthv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkc2Jjd29oYXdxZnFod2VmdGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjQ1NzAsImV4cCI6MjA2MjIwMDU3MH0.Au_IE19mSeR6Dg4HpPxIrn-l12KclNXL2nStNTl6-uc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
