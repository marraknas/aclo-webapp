import { useEffect } from "react";
import ProductGrid from "../components/products/ProductGrid";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchProducts,
  fetchProductVariants,
} from "../redux/slices/productsSlice";
import Navbar from "../components/common/Navbar";

const CollectionPage = () => {
  const dispatch = useAppDispatch();

  const { products, productVariants, loading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await dispatch(fetchProducts()).unwrap();
        const ids = products.map((product) => product._id);

        if (ids.length > 0) {
          dispatch(fetchProductVariants({ productIds: ids })).unwrap();
        }
      } catch (error) {
        console.error("Failed to fetch initial products:", error);
      }
    };

    if (!loading) loadData();
  }, [dispatch]);

  const towers = products.filter((p) => p.category === "Learning Tower");

  const others = products.filter(
    (p) => p.category === "Utensils" || p.category === "Accessories"
  );

  return (
    <div>
      <Navbar />

      <div className="flex flex-col lg:flex-row">
        <div className="grow p-4 px-10">
          <h2 className="text-4xl mb-8 text-center text-acloblue">
            All products
          </h2>

          <p className="text-2xl text-ink font-extralight p-4">
            Learning towers
          </p>
          <ProductGrid
            products={towers}
            productVariants={productVariants}
            loading={loading}
            error={error}
          />

          <p className="text-2xl mt-12 text-ink font-extralight p-4">
            Kids’ kitchen tools & accessories
          </p>
          <ProductGrid
            products={others}
            productVariants={productVariants}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
