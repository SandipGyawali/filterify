"use client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QueryResult } from "@upstash/vector";
import { SneakerProduct } from "@/db";
import Product from "@/components/products/product";
import ProductSkeleton from "@/components/products/skeleton";
import { Button } from "@/components/ui/button";
import {
  AccordionItem,
  AccordionContent,
  Accordion,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  OPTIONS_SORT,
  SUB_CATEGORIES,
  COLOR_FILTERS,
  SIZE_FILTERS,
  PRICE_FILTERS,
  minimumPrice,
  maximumPrice,
} from "@/data/index";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductState } from "@/lib/validators/products";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const num_range_default = [0, 100] as [number, number];
export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    color: [],
    sort: "none",
    price: {
      isCustom: false,
      range: num_range_default,
    },
    size: ["L", "M", "S"],
  });

  const {
    data: sneakerProducts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.post<QueryResult<SneakerProduct>[]>(
        "/api/products",
        {
          filter: {
            sort: filter.sort,
            color: filter.color,
            price: filter.price.range,
            size: filter.size,
          },
        }
      );

      return res.data;
    },
    retry: 4,
  });

  //submit the filter to get the product
  const submitFilter = () => refetch();

  useEffect(() => {
    submitFilter();
  }, [filter, submitFilter]);

  //color filter for the checkbox option
  const applyFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const filterApplied = filter[category].includes(value as never);

    if (filterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <Link
          href="/"
          className="text-4xl font-bold tracking-tight dark:text-gray-200 text-gray-500"
        >
          Filterify
        </Link>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">Sort</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 relative right-[78px]">
              <DropdownMenuLabel>Options:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filter.sort === "asc"}
                onCheckedChange={() => {
                  setFilter((prev) => ({
                    ...prev,
                    sort: "asc",
                  }));
                }}
              >
                Ascending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.sort === "desc"}
                onCheckedChange={() => {
                  setFilter((prev) => ({
                    ...prev,
                    sort: "desc",
                  }));
                }}
              >
                Descending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.sort === "none"}
                onCheckedChange={() => {
                  setFilter((prev) => ({
                    ...prev,
                    sort: "none",
                  }));
                }}
              >
                Normal
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* filters */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUB_CATEGORIES.map((category, index) => (
                <li key={index}>
                  <Button variant="link" disabled={!category.selected}>
                    {category.name}
                  </Button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple" className="animate-none">
              {/* color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 px-3 text-sm dark:text-gray-300 text-gray-600">
                  Color
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4 ml-4">
                    {COLOR_FILTERS.options.map((color, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <Checkbox
                          type="button"
                          id={`color-${index}`}
                          onClick={() => {
                            console.log("Hello");
                            applyFilter({
                              category: "color",
                              value: color.value,
                            });
                          }}
                          checked={filter.color.includes(color.value)}
                        />
                        <label
                          htmlFor={`color-${index}`}
                          className="ml-3 text-sm text-gray-500 dark:text-gray-400 font-medium"
                        >
                          {color.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* size filter */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 px-3 text-sm dark:text-gray-300 text-gray-600">
                  Size
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4 ml-4">
                    {SIZE_FILTERS.options.map((size, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <Checkbox
                          type="button"
                          id={`size-${index}`}
                          onClick={() => {
                            applyFilter({
                              category: "size",
                              value: size.value,
                            });
                          }}
                          checked={filter.size.includes(size.value)}
                        />
                        <label
                          htmlFor={`color-${index}`}
                          className="ml-3 text-sm text-gray-500 dark:text-gray-400 font-medium"
                        >
                          {size.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* price filter */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 px-3 te text-sm dark:text-gray-300 text-gray-600">
                  Price
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4 ml-4">
                    {PRICE_FILTERS.options.map((price, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <Checkbox
                          type="button"
                          id={`price-${index}`}
                          onClick={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...price.value],
                              },
                            }));
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === price.value[0] &&
                            filter.price.range[1] === price.value[1]
                          }
                        />
                        <label
                          htmlFor={`color-${index}`}
                          className="ml-3 text-sm text-gray-500 dark:text-gray-400 font-medium"
                        >
                          {price.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex justify-center flex-col gap-3">
                      <div>
                        <Checkbox
                          type="button"
                          id="price-filter-custom"
                          onClick={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100],
                              },
                            }));
                          }}
                          checked={filter.price.isCustom}
                        />
                        <label className="ml-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                          Custom
                        </label>
                      </div>

                      <div className="flex justify-between mt-2">
                        <p className="font-medium">Price</p>
                        <div>
                          {filter.price.isCustom
                            ? minimumPrice(
                                filter.price.range[0],
                                filter.price.range[1]
                              ).toFixed(0)
                            : filter.price.range[0].toFixed(0)}{" "}
                          $ -{" "}
                          {filter.price.isCustom
                            ? maximumPrice(
                                filter.price.range[0],
                                filter.price.range[1]
                              ).toFixed(0)
                            : filter.price.range[1].toFixed(0)}{" "}
                          $
                        </div>
                      </div>

                      <span className="text-xs mt-3 text-gray-300 font-medium">
                        Filter Range:
                      </span>
                      <div className="flex items-center justify-center gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          min={0}
                          max={100}
                          onChange={(e) => {
                            if (
                              Number(e.target.value) > 100 ||
                              Number(e.target.value) < 0
                            )
                              return;

                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: prev.price.isCustom,
                                range: [
                                  Number(e.target.value),
                                  prev.price.range[1],
                                ],
                              },
                            }));
                          }}
                          disabled={!filter.price.isCustom}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          min={0}
                          max={100}
                          onChange={(e) => {
                            if (
                              Number(e.target.value) > 100 ||
                              Number(e.target.value) < 0
                            )
                              return;

                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: prev.price.isCustom,
                                range: [
                                  prev.price.range[0],
                                  Number(e.target.value),
                                ],
                              },
                            }));
                          }}
                          disabled={!filter.price.isCustom}
                        />
                      </div>
                      <span className="text-red-500 text-xs dark:text-red-400">
                        Note: Range cannot exceed from 0$ to 100$
                      </span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((data, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : sneakerProducts?.length === 0 ? (
              <div className="empty relative mx-auto">
                <h1 className="text-xl font-bold">Product Not Found.</h1>
              </div>
            ) : (
              sneakerProducts?.map((product, index) => (
                <Product product={product.metadata} key={index} />
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
