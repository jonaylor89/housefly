export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string; // URL to an image
  rating: {
    rate: number;
    count: number;
  };
};

export type PaginatedResponse = {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
};
