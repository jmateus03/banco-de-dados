import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yloxoanlhukelyszzvzp.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsb3hvYW5saHVrZWx5c3p6dnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDI5ODIsImV4cCI6MjA5MjUxODk4Mn0.m61Vd9l3NIWn9BOT0vN7EGq2d2LvLhB_hGWpz2ziG3w"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);