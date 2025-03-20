import { supabase } from "@/lib/supabase";

export interface AuthResponse {
  user: any;
  error: Error | null;
}

export const registerUser = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return {
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      user: null,
      error: error as Error,
    };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    console.log("Attempting login with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }

    console.log("Auth successful, fetching user data");
    // Get additional user data from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }

    console.log("User data fetched successfully");
    return {
      user: {
        ...data.user,
        ...userData,
      },
      error: null,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      user: null,
      error: error as Error,
    };
  }
};

export const logoutUser = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: error as Error };
  }
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    if (!user) {
      return { user: null, error: null };
    }

    // Get additional user data from the users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;

    return {
      user: {
        ...user,
        ...userData,
      },
      error: null,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return { user: null, error: error as Error };
  }
};
