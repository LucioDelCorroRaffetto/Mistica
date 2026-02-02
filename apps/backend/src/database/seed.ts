import { pool } from './postgres';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seeding...');

    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM reviews');
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM wishlist');
    await client.query('DELETE FROM coupons');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM users');

    console.log('👥 Seeding users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const userId1 = uuidv4();
    const userId2 = uuidv4();
    const userId3 = uuidv4();

    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [userId1, 'Juan García', 'juan@example.com', passwordHash, 'customer']
    );
    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [userId2, 'María López', 'maria@example.com', passwordHash, 'customer']
    );
    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [userId3, 'Admin User', 'admin@example.com', passwordHash, 'admin']
    );

    console.log('📚 Seeding products...');
    const products = [
      { name: 'El Aleph', author: 'Jorge Luis Borges', category: 'Ficción', price: 35.99, stock: 50 },
      { name: 'Ficciones', author: 'Jorge Luis Borges', category: 'Ficción', price: 32.50, stock: 45 },
      { name: 'Cien Años de Soledad', author: 'Gabriel García Márquez', category: 'Ficción', price: 38.00, stock: 60 },
      { name: 'El Coronel no tiene quien le escriba', author: 'Gabriel García Márquez', category: 'Ficción', price: 28.99, stock: 40 },
      { name: 'La Casa de los Espíritus', author: 'Isabel Allende', category: 'Ficción', price: 36.50, stock: 35 },
      { name: 'Paula', author: 'Isabel Allende', category: 'Memorias', price: 42.00, stock: 25 },
      { name: 'Don Quijote', author: 'Miguel de Cervantes', category: 'Clásicos', price: 45.99, stock: 30 },
      { name: 'La Metamorfosis', author: 'Franz Kafka', category: 'Ficción', price: 18.99, stock: 55 },
      { name: 'El Proceso', author: 'Franz Kafka', category: 'Ficción', price: 22.50, stock: 40 },
      { name: 'Crimen y Castigo', author: 'Fiódor Dostoyevski', category: 'Clásicos', price: 48.00, stock: 35 },
      { name: 'Anna Karénina', author: 'Lev Tolstói', category: 'Clásicos', price: 52.99, stock: 28 },
      { name: 'El Gran Gatsby', author: 'F. Scott Fitzgerald', category: 'Ficción', price: 25.99, stock: 50 },
      { name: 'Orgullo y Prejuicio', author: 'Jane Austen', category: 'Ficción Clásica', price: 20.99, stock: 45 },
      { name: 'Jane Eyre', author: 'Charlotte Brontë', category: 'Ficción Clásica', price: 24.99, stock: 38 },
      { name: 'Wuthering Heights', author: 'Emily Brontë', category: 'Ficción Clásica', price: 23.50, stock: 32 },
    ];

    const productIds: { [key: string]: string } = {};

    for (const product of products) {
      const productId = uuidv4();
      productIds[product.name] = productId;
      
      await client.query(
        `INSERT INTO products (id, name, description, author, price, category, stock, image_url, rating, review_count, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [
          productId,
          product.name,
          `Una obra maestra literaria: ${product.name} por ${product.author}. Disfruta de esta novela clásica y sumérgete en historias cautivadoras.`,
          product.author,
          product.price,
          product.category,
          product.stock,
          `https://via.placeholder.com/200x300?text=${encodeURIComponent(product.name)}`,
          Math.floor(Math.random() * 2) + 4, // Rating 4-5
          Math.floor(Math.random() * 100) + 20, // 20-120 reviews
        ]
      );
    }

    console.log('⭐ Seeding reviews...');
    const booksWithReviews = Object.keys(productIds).slice(0, 5);
    
    for (const bookName of booksWithReviews) {
      for (let i = 0; i < 3; i++) {
        await client.query(
          `INSERT INTO reviews (id, product_id, user_id, rating, comment, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          [
            uuidv4(),
            productIds[bookName],
            [userId1, userId2, userId3][i % 3],
            Math.floor(Math.random() * 2) + 4,
            `Excelente libro, muy recomendado. ${i + 1} personas lo disfrutaron.`,
          ]
        );
      }
    }

    console.log('❤️ Seeding wishlist...');
    const wishlistItems = Object.keys(productIds).slice(0, 3);
    for (const bookName of wishlistItems) {
      await client.query(
        `INSERT INTO wishlist (id, user_id, product_id, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [
          uuidv4(),
          userId1,
          productIds[bookName],
        ]
      );
    }

    console.log('📦 Seeding orders...');
    const orderId1 = uuidv4();
    const orderId2 = uuidv4();

    await client.query(
      `INSERT INTO orders (id, user_id, status, total_amount, payment_status, stripe_payment_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [orderId1, userId1, 'processing', 99.98, 'paid', 'pi_test_123456', ]
    );

    await client.query(
      `INSERT INTO orders (id, user_id, status, total_amount, payment_status, stripe_payment_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [orderId2, userId2, 'delivered', 61.49, 'paid', 'pi_test_789012']
    );

    console.log('🛒 Seeding order items...');
    const orderItems = [
      { orderId: orderId1, productName: 'El Aleph', quantity: 2 },
      { orderId: orderId1, productName: 'Ficciones', quantity: 1 },
      { orderId: orderId2, productName: 'Cien Años de Soledad', quantity: 1 },
      { orderId: orderId2, productName: 'La Casa de los Espíritus', quantity: 1 },
    ];

    for (const item of orderItems) {
      const product = products.find(p => p.name === item.productName);
      if (product) {
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            uuidv4(),
            item.orderId,
            productIds[item.productName],
            item.quantity,
            product.price,
          ]
        );
      }
    }

    console.log('🎫 Seeding coupons...');
    await client.query(
      `INSERT INTO coupons (id, code, discount_percentage, discount_amount, expiry_date, usage_limit, usage_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        uuidv4(),
        'WELCOME10',
        10,
        null,
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        100,
        5,
      ]
    );

    await client.query(
      `INSERT INTO coupons (id, code, discount_percentage, discount_amount, expiry_date, usage_limit, usage_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        uuidv4(),
        'SAVE5',
        null,
        5,
        new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        200,
        25,
      ]
    );

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('  - 3 users created');
    console.log('  - 15 products created');
    console.log('  - 15 reviews created');
    console.log('  - 3 wishlist items created');
    console.log('  - 2 orders created with 4 order items');
    console.log('  - 2 coupons created');
    console.log('\n💡 Test Account:');
    console.log('  Email: juan@example.com');
    console.log('  Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding
seedDatabase().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
