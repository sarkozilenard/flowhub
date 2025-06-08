import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { createClient } from '@/util/supabase/component';
import { User, Provider } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/router';

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  name?: string;
  profilePicture?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  createUser: (user: User, username?: string) => Promise<void>;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { name?: string; username?: string }) => Promise<void>;
  initializing: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  createUser: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  signInWithMagicLink: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  initializing: false
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchUserProfile(user.id);
      }
      setInitializing(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setTimeout(async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setInitializing(false);
      }, 0);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const createUser = async (user: User, username?: string) => {
    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          username: username,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          profilePicture: user.user_metadata?.avatar_url || null,
        })
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user profile",
      });
    }
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    // First try to sign in with email
    let { data, error } = await supabase.auth.signInWithPassword({ 
      email: emailOrUsername, 
      password 
    });

    // If that fails and the input doesn't contain @, try to find email by username
    if (error && !emailOrUsername.includes('@')) {
      try {
        const response = await fetch('/api/user/find-by-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: emailOrUsername })
        });

        if (response.ok) {
          const userData = await response.json();
          const result = await supabase.auth.signInWithPassword({ 
            email: userData.email, 
            password 
          });
          data = result.data;
          error = result.error;
        }
      } catch (usernameError) {
        console.error('Error finding user by username:', usernameError);
      }
    }

    if (!error && data.user) {
      await createUser(data.user);
    }
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    } else {
      toast({
        title: "Success",
        description: "You have successfully signed in",
      });
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (data.user) {
      await createUser(data.user, username);
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    } else {
      toast({
        title: "Success",
        description: "Sign up successful! Please login to continue.",
      });
    }
  };

  const signInWithMagicLink = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (!error && data.user) {
      await createUser(data.user);
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    } else {
      toast({
        title: "Success",
        description: "Check your email for the login link",
      });
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google' as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setUserProfile(null);
      toast({
        title: "Success",
        description: "You have successfully signed out",
      });
      router.push('/');
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    } else {
      toast({
        title: "Success",
        description: "Check your email for the password reset link",
      });
    }
  };

  const updateProfile = async (data: { name?: string; username?: string }) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      createUser,
      signIn,
      signUp,
      signInWithMagicLink,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateProfile,
      initializing,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);