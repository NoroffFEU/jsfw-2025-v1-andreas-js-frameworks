import { Product } from "./product";

export interface SearchProps {
  query: string;
  setQuery: (q: string) => void;
  filtered: Product[];
  loading: boolean;
}
