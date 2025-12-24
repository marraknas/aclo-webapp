import { useEffect, useRef, useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import { FaFilter } from "react-icons/fa6";
import FilterSidebar from "../components/products/FilterSidebar";
import SortOptions from "../components/products/SortOptions";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts, fetchProductVariants } from "../redux/slices/productsSlice";
import Navbar from "../components/common/Navbar";

const CollectionPage = () => {
  const dispatch = useAppDispatch();
  // productVariants is of the form = { 
  // "id1": [variant1, variant2], "id2": [variant1, variant2, variant3], ... 
  // }
  const { products, productVariants, loading, error } = useAppSelector(
    (state) => state.products
  );

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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
              // Handle error if needed (e.g., show a toast notification)
          }
      };

    if (!loading) {
        loadData();
    }
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    // close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    // clean event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col lg:flex-row">
        {/* Mobile filter button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden border border-gray-200 p-2 flex justify-center items-center"
        >
          <FaFilter className="mr-2" /> Filters
        </button>
        {/* Filter sidebar */}
        <div
          ref={sidebarRef}
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 
                lg:static lg:translate-x-0`}
        >
          <FilterSidebar />
        </div>
        <div className="grow p-4">
          <h2 className="text-2xl uppercase mb-4">All Collection</h2>
          {/* Sort options */}
          <SortOptions />
          {/* Product Grid */}
          <ProductGrid products={products} productVariants={productVariants} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
