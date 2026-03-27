import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  addOneToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  removeOneFromCart: (id: string) => void;
  clearCart: () => void;
  toastMessage?: string | null;
  clearToast?: () => void;
  showToast?: (message: string) => void;
}
