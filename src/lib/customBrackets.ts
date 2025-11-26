export type CustomBracketMode = 8 | 10 | 12;

export interface CustomBracket {
  id: string;
  name: string;
  mode: CustomBracketMode;
  options: string[];
  mustStart: string[]; // 1 or 2 options that always start first
}

// Database schema type (what comes from Supabase)
export interface CustomBracketDB {
  id: string;
  user_id: string;
  name: string;
  mode: CustomBracketMode;
  options: string[];
  must_start: string[];
  created_at?: string;
  updated_at?: string;
}

const STORAGE_KEY = "custom-brackets";

// Convert DB format to app format
const dbToApp = (db: CustomBracketDB): CustomBracket => ({
  id: db.id,
  name: db.name,
  mode: db.mode,
  options: db.options,
  mustStart: db.must_start || [],
});

// Get brackets from API (syncs across devices)
export const getCustomBrackets = async (): Promise<CustomBracket[]> => {
  if (typeof window === "undefined") return [];
  
  try {
    const response = await fetch("/api/brackets");
    if (response.ok) {
      const { brackets } = await response.json();
      return brackets.map(dbToApp);
    }
  } catch (error) {
    console.error("Failed to fetch brackets from API:", error);
  }
  
  // Fallback to localStorage if API fails or user not logged in
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save bracket to API (syncs across devices)
export const saveCustomBracket = async (bracket: CustomBracket): Promise<void> => {
  if (typeof window === "undefined") return;
  
  try {
    const response = await fetch("/api/brackets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bracket),
    });
    
    if (response.ok) {
      // Also save to localStorage as backup
      try {
        const existing = await getCustomBrackets();
        const updated = [...existing.filter((b) => b.id !== bracket.id), bracket];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return;
    }
  } catch (error) {
    console.error("Failed to save bracket to API:", error);
  }
  
  // Fallback to localStorage if API fails
  try {
    const existing = getCustomBracketsSync();
    const updated = [...existing.filter((b) => b.id !== bracket.id), bracket];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save custom bracket:", error);
  }
};

// Delete bracket from API
export const deleteCustomBracket = async (id: string): Promise<void> => {
  if (typeof window === "undefined") return;
  
  try {
    const response = await fetch(`/api/brackets?id=${id}`, {
      method: "DELETE",
    });
    
    if (response.ok) {
      // Also remove from localStorage
      try {
        const existing = getCustomBracketsSync();
        const updated = existing.filter((b) => b.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }
      return;
    }
  } catch (error) {
    console.error("Failed to delete bracket from API:", error);
  }
  
  // Fallback to localStorage
  try {
    const existing = getCustomBracketsSync();
    const updated = existing.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to delete custom bracket:", error);
  }
};

// Synchronous version for backwards compatibility (uses localStorage only)
export const getCustomBracketsSync = (): CustomBracket[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const generateBracketId = (): string => {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


