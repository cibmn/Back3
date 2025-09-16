import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import UserModel from "../daos/models/userModel.js";  

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
    products: []
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


export async function insertMockUsers(n = 50) {
  const users = await generateMockUsers(n);
  return UserModel.insertMany(users, { ordered: false });
}
