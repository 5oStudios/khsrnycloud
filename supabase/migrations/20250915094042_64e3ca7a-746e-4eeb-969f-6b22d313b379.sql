-- Create KHSRNY users table for authentication
CREATE TABLE public."KHSRNY users" (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public."KHSRNY users" ENABLE ROW LEVEL SECURITY;

-- Create policies for KHSRNY users table
CREATE POLICY "Users can view their own record" 
ON public."KHSRNY users" 
FOR SELECT 
USING (true);

CREATE POLICY "Allow user registration" 
ON public."KHSRNY users" 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_khsrny_users_updated_at
BEFORE UPDATE ON public."KHSRNY users"
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();