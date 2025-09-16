import { faker } from "@faker-js/faker";
import ProductDao from "../daos/productDao.js";

const productDao = new ProductDao();

export function generateMockProducts(n = 10) {
  const categories = ["Electronics", "Clothing", "Books", "Toys"];
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(),
      category: categories[Math.floor(Math.random() * categories.length)],
      price: parseFloat(faker.commerce.price()),
      stock: Math.floor(Math.random() * 50)
    });
  }
  return arr;
}

export async function insertMockProducts(products) {
  return productDao.insertMany(products);
}
