// models/supabase-auth.model.ts

export interface SupabaseUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: Record<string, unknown>;
  identities: SupabaseIdentity[];
  created_at: string;
  updated_at: string;
}

export interface SupabaseIdentity {
  identity_id : string;
  id: string;
  user_id: string;
  identity_data: Record<string, unknown>;
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}

// Response shape for /auth/v1/token (sign in)
export interface SupabaseSignInResponse {
  access_token: string;
  token_type: string;         // always "bearer"
  expires_in: number;         // seconds
  expires_at: number;         // unix timestamp
  refresh_token: string;
  user: SupabaseUser;
}

// Response shape for /auth/v1/signup
export interface SupabaseSignUpResponse {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  confirmation_sent_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: Record<string, unknown>;
  identities: SupabaseIdentity[];
  created_at: string;
  updated_at: string;
  // access_token is only present if email confirmation is disabled
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
}