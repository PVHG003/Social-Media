// Custom event system for user profile updates
class UserProfileEventManager {
  private static instance: UserProfileEventManager;
  private listeners: Array<() => void> = [];

  static getInstance(): UserProfileEventManager {
    if (!UserProfileEventManager.instance) {
      UserProfileEventManager.instance = new UserProfileEventManager();
    }
    return UserProfileEventManager.instance;
  }

  // Subscribe to user profile updates
  subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all subscribers that user profile was updated
  notify(): void {
    this.listeners.forEach(callback => callback());
  }
}

export const userProfileEvents = UserProfileEventManager.getInstance();