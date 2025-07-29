import { v4 as uuidv4 } from "uuid";

export const defaultData = [
  {
    id: uuidv4(),
    name: "Samyang Spicy Ramen",
    price: 55,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Noodles",
  },
  {
    id: uuidv4(),
    name: "Banana Milk",
    price: 35,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
  {
    id: uuidv4(),
    name: "Choco Pie",
    price: 20,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Snacks",
  },
  {
    id: uuidv4(),
    name: "Pepero Almond",
    price: 40,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Snacks",
  },
  {
    id: uuidv4(),
    name: "Soju (Green Grape)",
    price: 95,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
  {
    id: uuidv4(),
    name: "Melona Ice Cream",
    price: 30,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Frozen",
  },
  {
    id: uuidv4(),
    name: "Binggrae Yogurt Drink",
    price: 25,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
  {
    id: uuidv4(),
    name: "Topokki (Rice Cake) Pack",
    price: 70,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Food",
  },
  {
    id: uuidv4(),
    name: "Gim Seaweed Snack",
    price: 18,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Snacks",
  },
  {
    id: uuidv4(),
    name: "Corn Tea",
    price: 45,
    stock: Math.floor(Math.random() * 40) + 1,
    category: "Drinks",
  },
];
