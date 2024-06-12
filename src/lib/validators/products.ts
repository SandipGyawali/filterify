import { z } from "zod";

const SIZES = ["S", "M", "L"] as const;
const COLORS = ["white", "black", "green", "purple", "blue", "yellow"] as const;
const SORT = ["none", "asc", "desc"] as const;

const ProductFilterValidator = z.object({
  size: z.array(z.enum(SIZES)),
  color: z.array(z.enum(COLORS)),
  sort: z.enum(SORT),
  price: z.tuple([z.number(), z.number()]),
});

export { ProductFilterValidator, SIZES, COLORS };
export type ProductState = Omit<
  z.infer<typeof ProductFilterValidator>,
  "price"
> & {
  price: {
    isCustom: boolean;
    range: [number, number];
  };
};
