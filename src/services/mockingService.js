import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

const SALT_ROUNDS = 10;

export async function hashCoderPassword() {
  const plain = "coder123";
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

export function generateMockUserObject(hashedPassword) {
  const roles = ["user", "admin"];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const _id = new mongoose.Types.ObjectId();

  // ⚠️ Cambiado a faker.person.*
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email(firstName, lastName).toLowerCase();

  return {
    _id,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    pets: []
  };
}

export async function generateMockUsers(n = 50) {
  const hashed = await hashCoderPassword();
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(generateMockUserObject(hashed));
  }
  return arr;
}

export function generateMockPetObject() {
  const _id = new mongoose.Types.ObjectId();
  const names = ["Luna", "Max", "Loki", "Milo", "Bella", "Nala", "Coco", "Simba"];
  const species = ["cat", "dog", "bird", "hamster"];
  const name = names[Math.floor(Math.random() * names.length)];
  const specie = species[Math.floor(Math.random() * species.length)];
  const age = Math.floor(Math.random() * 12);
  return {
    _id,
    name,
    species: specie,
    age,
    owner: null
  };
}

export function generateMockPets(n = 10) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(generateMockPetObject());
  return arr;
}
