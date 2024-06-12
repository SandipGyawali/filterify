import { Index } from "@upstash/vector";
import * as dotenv from "dotenv";

dotenv.config();
export type SneakerProduct = {
  id: string;
  imgId: string;
  name: string;
  size: "S" | "M" | "L";
  color: "white" | "black" | "green" | "purple" | "blue" | "yellow";
  price: number;
};

export const db = new Index<SneakerProduct>();
