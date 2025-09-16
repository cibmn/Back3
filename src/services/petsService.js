import { faker } from "@faker-js/faker";
import PetDao from "../daos/petDao.js";

const petDao = new PetDao();

export function generateMockPets(n = 10) {
  const categories = ["Electronics", "Clothing", "Books", "Toys"];
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      _id: faker.database.mongodbObjectId(),
      name: faker.commerce.productName(), 
      category: categories[Math.floor(Math.random() * categories.length)],
      price: parseFloat(faker.commerce.price()),
      stock: Math.floor(Math.random() * 50),
    });
  }
  return arr;
}

export async function insertMockPets(pets) {
  return petDao.insertMany(pets);
}
