import type { Meta, StoryObj } from "@storybook/react-vite";
import { DetailProduct } from "./DetailProduct";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "../context/auth-context-context";
import { http, HttpResponse } from "msw";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

const mockProduct = {
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

const meta: Meta<typeof DetailProduct> = {
  component: DetailProduct,
  title: "Pages/DetailProduct",
  decorators: [
    (Story, context) => {
      const productId =
        context.parameters?.reactRouter?.routeParams?.productId || "1";

      return (
        <QueryClientProvider client={createQueryClient()}>
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
            <MemoryRouter initialEntries={[`/products/${productId}`]}>
              <Routes>
                <Route path="/products/:productId" element={<Story />} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DetailProduct>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", ({ params }) => {
          const { productId } = params;
          console.log("MSW intercepted relative URL for productId:", productId);
          if (productId === mockProduct.id) {
            return HttpResponse.json({ payload: mockProduct });
          }
          return HttpResponse.json(
            { error: "Product not found" },
            { status: 404 }
          );
        }),
        http.get(
          "http://localhost:3000/api/products/:productId",
          ({ params }) => {
            const { productId } = params;
            console.log(
              "MSW intercepted absolute URL for productId:",
              productId
            );
            if (productId === mockProduct.id) {
              return HttpResponse.json({ payload: mockProduct });
            }
            return HttpResponse.json(
              { error: "Product not found" },
              { status: 404 }
            );
          }
        ),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ payload: mockProduct });
        }),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", () => {
          return new HttpResponse("Internal Server Error", { status: 500 });
        }),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export const ProductNotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", () => {
          return new HttpResponse("Product not found", { status: 404 });
        }),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "999" },
    },
  },
};