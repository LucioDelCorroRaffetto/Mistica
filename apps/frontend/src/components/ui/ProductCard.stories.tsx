import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductCard } from "./ProductCard";
import type { Product } from "@domain/entities/Products";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "../../context/auth-context-context";

const queryClient = new QueryClient();

const meta: Meta<typeof ProductCard> = {
  component: ProductCard,
  title: "Components/ProductCard",
  decorators: [
    (Story) => (
      <Router>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider
            value={{
              isAuthenticated: true,
              user: null,
              token: "mock-token",
              login: () => Promise.resolve(),
              logout: () => {},
              register: () => Promise.resolve(),
              isLoading: false,
            }}
          >
            <Story />
          </AuthContext.Provider>
        </QueryClientProvider>
      </Router>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProductCard>;

const mockProduct: Product = {
  id: "1",
  name: "Cien años de soledad",
  description: "Novela icónica de Gabriel García Márquez, considerada una obra maestra de la literatura latinoamericana.",
  price: 3200,
  stock: 5,
  category: "Libros",
  imageUrl:
    "https://images.cdn1.buscalibre.com/fit-in/360x360/0b/7c/0b7c7e7e6e2e2e2e2e2e2e2e2e2e2e2e.jpg",
  createdAt: new Date("2022-01-15T10:00:00Z"),
  updatedAt: new Date("2023-03-10T15:30:00Z"),
};

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      name: "Cien años de soledad (Sin Stock)",
      stock: 0,
    },
  },
};

export const AddingToCart: Story = {
  args: {
    product: mockProduct,
  },
  parameters: {
    msw: {
      handlers: {
        post: {
          url: "/api/cart",
          delay: 1000,
          response: {
            payload: {
              items: [{ productId: "1", quantity: 1 }],
            },
          },
        },
      },
    },
  },
};