import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartPage } from "./CartPage";
import { MemoryRouter } from "react-router-dom";
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

const mockProducts = [
  {
    id: "libro-001",
    name: "El Aleph",
    price: 3500,
    description: "Libro de cuentos de Jorge Luis Borges.",
    stock: 8,
    category: "Ficción",
    imageUrl: "https://ejemplo.com/aleph.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "libro-002",
    name: "Rayuela",
    price: 4200,
    description: "Novela de Julio Cortázar.",
    stock: 5,
    category: "Novela",
    imageUrl: "https://ejemplo.com/rayuela.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCart = {
  items: [
    { productId: "libro-001", quantity: 1 },
    { productId: "libro-002", quantity: 2 },
  ],
};

const meta: Meta<typeof CartPage> = {
  component: CartPage,
  title: "Pages/CartPage",
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/cart"]}>
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
            <Story />
          </AuthContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CartPage>;

export const FilledCart: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", () => {
          console.log("MSW: FilledCart - intercepted cart request");
          return HttpResponse.json({ payload: mockCart });
        }),
        http.get("/api/products", ({ request }) => {
          console.log("MSW: FilledCart - intercepted products request");
          const url = new URL(request.url);
          const ids = url.searchParams.get("ids");
          console.log(`Requested product IDs: ${ids}`);
          return HttpResponse.json({ payload: mockProducts });
        }),
        http.get("http://localhost:3000/api/cart", () => {
          console.log("MSW: FilledCart - intercepted absolute cart request");
          return HttpResponse.json({ payload: mockCart });
        }),
        http.get("http://localhost:3000/api/products", ({ request }) => {
          console.log(
            "MSW: FilledCart - intercepted absolute products request"
          );
          const url = new URL(request.url);
          const ids = url.searchParams.get("ids");
          console.log(`Requested product IDs (absolute): ${ids}`);
          return HttpResponse.json({ payload: mockProducts });
        }),
      ],
    },
  },
};

export const EmptyCart: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", () => {
          console.log("MSW: EmptyCart - intercepted cart request");
          return HttpResponse.json({ payload: { items: [] } });
        }),
        http.get("http://localhost:3000/api/cart", () => {
          console.log("MSW: EmptyCart - intercepted absolute cart request");
          return HttpResponse.json({ payload: { items: [] } });
        }),
      ],
    },
  },
};

export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", async () => {
          console.log("MSW: LoadingState - delaying cart request...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ payload: mockCart });
        }),
        http.get("http://localhost:3000/api/cart", async () => {
          console.log("MSW: LoadingState - delaying absolute cart request...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ payload: mockCart });
        }),
      ],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", () => {
          console.log("MSW: ErrorState - returning 500 error");
          return HttpResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }),
        http.get("http://localhost:3000/api/cart", () => {
          console.log("MSW: ErrorState - returning 500 error (absolute)");
          return HttpResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }),
      ],
    },
  },
};