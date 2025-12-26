// src/types/index.ts

/**
 * Represents the authenticated user within the Canyon LLC portal.
 * This interface links the internal user identity to the corresponding
 * Zoho CRM/Books contact ID, which is essential for API calls.
 */
export interface AuthenticatedUser {
  uid: string; // Internal unique identifier (e.g., from a local user database or auth provider)
  name: string; // User's full name for display purposes
  email: string; // User's login email
  zohoContactId: string; // The primary key for fetching customer-specific data from Zoho
}

/**
 * Defines the shape of the authentication context provided to the app.
 * This includes the current user state and the methods to update it.
 */
export interface AuthContextType {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}