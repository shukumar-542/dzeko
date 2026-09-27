"use client";
import Image from "next/image";
import { Eye } from "lucide-react";
import Titlebar from "../common/Titlebar";
import { useGetProductsQuery } from "@/store/apis";
import Link from "next/link";
import { ROUTES } from "@/constants";

const products = [
  {
    name: "Academic Textbook Collection",
    price: "€29.99",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Scientific Calculator",
    price: "€24.99",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Premium Study Backpack",
    price: "€49.99",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Engineering Tool Set",
    price: "€34.99",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=900&q=80",
  },
];

function Marketplace() {

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    page: 1,
    limit: 4,

  });

  console.log(data?.data)

  return (
    <section className="py-16 md:py-20">
      <div className="app-container">
        <Titlebar
          title="Study Materials Marketplace"
          description="Browse physical study materials, books, and resources to enhance your preparation"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {data?.data?.map((product: any) => (
            <div
              key={product.slug}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image src={product?.images[0]} alt={product?.name || "Product image"}  fill className="object-cover" />
              </div>

              <div className="p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h3>

                <p className="text-primary mt-2 text-xl font-bold">€ {product.price}</p>
                <Link href={`${ROUTES.MARKETPLACE}/${product.slug}`}>
                  <button className="border-primary text-primary hover:bg-primary/5 mt-4 flex w-full items-center justify-center gap-2 rounded-md border bg-white px-4 py-2.5 text-sm font-medium transition">
                    <Eye className="h-4 w-4" />
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">

          <Link href={ROUTES.MARKETPLACE} className="border-primary text-primary hover:bg-primary/5 rounded-md border bg-white px-7 py-3 text-sm font-medium transition">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Marketplace;
