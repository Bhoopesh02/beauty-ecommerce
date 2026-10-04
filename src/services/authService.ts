import { User, Address } from "../types";
import { storage, STORAGE_KEYS } from "../utils/storage";

const initUsers = () => {
  const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    const defaultAdmin: User = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@derrume.com",
      password: "admin123", // very secure mock
      role: "admin",
      createdAt: new Date().toISOString()
    };
    storage.set(STORAGE_KEYS.USERS, [defaultAdmin]);
    return [defaultAdmin];
  }
  return users;
};

export const authService = {
  async login(email: string, password?: string): Promise<User> {
    const users = initUsers();
    const user = users.find(u => u.email === email && (!password || u.password === password));
    if (!user) throw new Error("Invalid credentials");
    storage.set(STORAGE_KEYS.SESSION, user);
    return user;
  },

  async register(name: string, email: string, password?: string): Promise<User> {
    const users = initUsers();
    if (users.find(u => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      role: "customer",
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);
    storage.set(STORAGE_KEYS.SESSION, newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    storage.remove(STORAGE_KEYS.SESSION);
  },

  async getCurrentUser(): Promise<User | null> {
    return storage.get<User | null>(STORAGE_KEYS.SESSION, null);
  },
  
  async getCustomers(): Promise<User[]> {
    const users = initUsers();
    return users.filter(u => u.role === "customer");
  },

  async resetPassword(email: string, newPassword?: string): Promise<boolean> {
    const users = initUsers();
    const user = users.find(u => u.email === email);
    if (!user) return false;
    user.password = newPassword || "reset123";
    storage.set(STORAGE_KEYS.USERS, users);
    return true;
  },
  
  async updateProfile(updates: Partial<User>): Promise<User | null> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("Not logged in");
    
    const users = initUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    storage.set(STORAGE_KEYS.USERS, users);
    storage.set(STORAGE_KEYS.SESSION, users[index]);
    return users[index];
  }
};
