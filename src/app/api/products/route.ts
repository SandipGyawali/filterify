import { PRICE_FILTERS } from "@/data";
import { db } from "@/db";
import { ProductFilterValidator } from "@/lib/validators/products";
import { timeStamp } from "console";
import { NextRequest } from "next/server";

class Filter {
  private filters: Map<string, string[]> = new Map();

  hasFilter() {
    return this.filters.size > 0;
  }

  add(key: string, operator: string, value: string | number) {
    const filter = this.filters.get(key) || [];

    filter.push(
      `${key} ${operator} ${typeof value === "number" ? value : `"${value}"`}`
    );
    this.filters.set(key, filter);
  }

  addRaw(key: string, rawFilter: string) {
    this.filters.set(key, [rawFilter]);
  }

  get() {
    const parts: string[] = [];
    this.filters.forEach((filter) => {
      const values = filter.join(` OR `);
      parts.push(`(${values})`);
    });

    return parts.join(` AND `);
  }
}

const avg_product_price = 25;

const handler = async (req: NextRequest) => {
  try {
    const requestBody = await req.json();

    const { color, price, size, sort } = ProductFilterValidator.parse(
      requestBody.filter
    );

    const filter = new Filter();
    color.forEach((color) => filter.add("color", "=", color));
    size.forEach((size) => filter.add("size", "=", size));
    filter.addRaw("price", `price >= ${price[0]} AND price <= ${price[1]}`);

    const products = await db.query({
      topK: 25,
      vector: [
        0,
        0,
        sort === "none" ? avg_product_price : sort === "asc" ? 0 : 50,
      ],
      includeMetadata: true,
      filter: filter.hasFilter() ? filter.get() : undefined,
    });

    return new Response(JSON.stringify(products));
  } catch (err: any) {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};

export { handler as GET, handler as POST };
