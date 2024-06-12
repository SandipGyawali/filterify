import { SneakerProduct } from "@/db";
import Image from "next/image";

function Product({ product }: { product?: SneakerProduct }) {
  return (
    <div className="group relative cursor-pointer hover:scale-105 active:scale-95 transition transition-all linear duration-300">
      <div
        className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 
        lg:aspect-none group-hover:opacity-75 transition transition-all linear duration-175 lg:h-80"
      >
        <img
          src={product?.imgId}
          alt="product-image"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="mt-4 flex justify-center">
          <div>
            <h3 className="text-sm text-gray-700 dark:text-gray-300">
              {product?.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 font-semibold dark:text-gray-400">
              SIZE {product?.size.toUpperCase()}, {product?.color}
            </p>
          </div>
        </div>

        <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
          $ {product?.price}
        </p>
      </div>
    </div>
  );
}

export default Product;
