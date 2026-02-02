export function sanitizeUser(user: any): any {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function formatChangoResponse(chango: any): any {
  if (!chango) {
    return null;
  }

  return {
    id: chango.id,
    userId: chango.userId,
    items: chango.item || [],
    itemCount: (chango.item || []).length,
    updatedAt: chango.updatedAt,
  };
}

export function formatProductResponse(product: any): any {
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price.toString()),
    stock: parseInt(product.stock.toString(), 10),
    category: product.category,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function formatProductsResponse(products: any[]): any[] {
  return products.map(formatProductResponse);
}
