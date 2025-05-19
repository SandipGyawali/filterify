import { SUB_CATEGORIES_TYPE, OPTIONS_SORT_TYPE } from "./interfaces";

const SUB_CATEGORIES: SUB_CATEGORIES_TYPE[] = [
  { name: "Sneakers", selected: true, href: "#" },
];

const OPTIONS_SORT: OPTIONS_SORT_TYPE[] = [
  { name: "None", value: "none" },
  { name: "Low to High", value: "price-asc" },
  { name: "High to Low", value: "price-desc" },
];

const COLOR_FILTERS = {
  id: "color",
  name: "color",
  options: [
    { value: "white", label: "White" },
    { value: "black", label: "Black" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "blue", label: "Blue" },
    { value: "yellow", label: "Yellow" },
  ] as const,
};

const SIZE_FILTERS = {
  id: "size",
  name: "size",
  options: [
    { value: "S", label: "Small" },
    {
      value: "L",
      label: "Large",
    },
    {
      value: "M",
      label: "Medium",
    },
  ] as const,
};

const PRICE_FILTERS = {
  id: "price",
  name: "price",
  options: [
    { value: [0, 100], label: "Any Range Price" },
    {
      value: [0, 20],
      label: "Under 20$",
    },
    {
      value: [0, 40],
      label: "Under 30$",
    },

    // custom option definition
  ],
} as const;

function minimumPrice(num1: number, num2: number): number {
  return Math.min(num1, num2);
}

function maximumPrice(num1: number, num2: number): number {
  return Math.max(num1, num2);
}

export {
  OPTIONS_SORT,
  SUB_CATEGORIES,
  COLOR_FILTERS,
  SIZE_FILTERS,
  PRICE_FILTERS,
  minimumPrice,
  maximumPrice,
};
