import { Address } from "../types";
import { storage } from "../utils/storage";
import { authService } from "./authService";

// We store addresses in a key mapped by userId
const getAddressKey = (userId: string) => `derrume_addresses_${userId}`;

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const user = await authService.getCurrentUser();
    if (!user) return [];
    return storage.get<Address[]>(getAddressKey(user.id), []);
  },

  async addAddress(addressData: Omit<Address, "id">): Promise<Address> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error("Must be logged in to add address");
    
    const addresses = await this.getAddresses();
    
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    
    if (newAddress.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    } else if (addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    addresses.push(newAddress);
    storage.set(getAddressKey(user.id), addresses);
    return newAddress;
  },

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    const user = await authService.getCurrentUser();
    if (!user) return null;
    
    const addresses = await this.getAddresses();
    const index = addresses.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    if (updates.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    
    addresses[index] = { ...addresses[index], ...updates };
    storage.set(getAddressKey(user.id), addresses);
    return addresses[index];
  },

  async deleteAddress(id: string): Promise<boolean> {
    const user = await authService.getCurrentUser();
    if (!user) return false;
    
    let addresses = await this.getAddresses();
    const deletedWasDefault = addresses.find(a => a.id === id)?.isDefault;
    
    addresses = addresses.filter(a => a.id !== id);
    
    if (deletedWasDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }
    
    storage.set(getAddressKey(user.id), addresses);
    return true;
  },

  async setDefaultAddress(id: string): Promise<boolean> {
    return !!(await this.updateAddress(id, { isDefault: true }));
  }
};
