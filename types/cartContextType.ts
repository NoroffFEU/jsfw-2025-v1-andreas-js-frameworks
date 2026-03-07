import { Product } from "./product";

export interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  removeOneFromCart: (id: string) => void;
  clearCart: () => void;
  toastMessage?: string | null;
  clearToast?: () => void;
  showToast?: (message: string) => void;
}
