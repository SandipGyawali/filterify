import { type SneakerProduct, db } from ".";

const getRandomPrice = () => {
  const PRICES = [9.99, 19.99, 29.99, 39.99, 49.99];
  return PRICES[Math.floor(Math.random() * PRICES.length)];
};

const COLORS = ["white", "black", "green", "purple", "blue", "yellow"] as const;
const SIZES = ["S", "M", "L"] as const;

const seed = async () => {
  const products: SneakerProduct[] = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < COLORS.length; j++) {
      for (let k = 0; k < SIZES.length; k++) {
        const size = SIZES[k];
        const color = COLORS[j];
        products.push({
          id: `${color}-${size}-${i + 1}`,
          imgId: `/${color}${i + 1}.png`,
          color,
          name: `${
            color.slice(0, 1).toUpperCase() + color.slice(1)
          } sneaker ${i}`,
          size,
          price: getRandomPrice(),
        });
      }
    }
  }

  const SIZE_MAP = {
    S: 0,
    M: 1,
    L: 2,
  };

  const COLOR_MAP = {
    white: 0,
    black: 1,
    green: 2,
    purple: 3,
    blue: 4,
    yellow: 5,
  };

  await db.upsert(
    products.map((product) => ({
      id: product.id,
      vector: [COLOR_MAP[product.color], SIZE_MAP[product.size], product.price],
      metadata: product,
    }))
  );
};

seed();
