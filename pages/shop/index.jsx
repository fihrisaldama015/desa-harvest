import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Category from "../../components/atom/category";
import Product from "../../components/molecule/product";
import CheckoutForm from "../../components/organism/checkoutform";
import SearchSection from "../../components/organism/searchsection";
import Sellersection from "../../components/organism/shoppage/sellersection";
import { fetchProductsAsync } from "../../store/products/produtcs.action";
import { selectIsLoadingProducts, selectProducts } from "../../store/products/products.selector";
import { selectFormVis } from "../../store/transaction/transaction.selector";
export default function Shop() {
  const checkoutFormVis = useSelector(selectFormVis);
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  let [selectedCategory, setSelectedCategory] = useState("");
  let [searchWord, setSearchWord] = useState("");
  const [selectedProducts, setSelectedProducts] = useState("");
  const categories = ["Sayur", "Buah", "Minuman", "Sembako", "Makanan", "Obat", "Bumbu", "Perlengkapan", "lainnya"];
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);
  useEffect(() => {
    setSelectedProducts(products);
  }, [products]);
  const handleCategory = (category) => {
    if (selectedCategory == category) {
      selectedCategory = "";
      setSelectedCategory("");
    } else {
      selectedCategory = category;
      setSelectedCategory(category);
    }

    setSelectedProducts(filterProducts(category));
  };
  const filterProducts = () => {
    let filteredProducts;
    if (selectedCategory == "") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter((p) => {
        let length = 0;
        p.product_category.forEach((c) => {
          if (c == selectedCategory) {
            length++;
          }
        });
        if (length > 0) {
          return true;
        } else {
          return false;
        }
      });
    }
    filteredProducts = filteredProducts.filter((p) => p.name.toLowerCase().includes(searchWord.toLowerCase()));
    return filteredProducts;
  };
  const handleSearch = (e) => {
    searchWord = e.target.value;
    setSearchWord(e.target.value);
    setSelectedProducts(filterProducts());
  };
  const productsIsLoading = useSelector(selectIsLoadingProducts);
  const fakeArr = [1, 2, 3, 4, 5, 6, 7, 8];
  //
  return (
    <div className="flex justify-center ">
      <div className="w-screen max-w-md  bg-mygreen  relative border border-gray-200">
        {/* checkout form */}
        {checkoutFormVis && <CheckoutForm />}
        {/* notif etc */}
        <div className="px-5 py-4">
          <Sellersection />
        </div>
        {/* search section */}
        <div className="my-4 px-5">
          <SearchSection func={handleSearch} />
        </div>
        {/* category */}
        <div className="px-5">
          <div className=" items-center">
            {/* <div className=" mr-2 flex text-xs font-medium text-[#618D80]">Kategori : </div> */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category, i) => {
                return <Category key={i} category={category} isActive={selectedCategory} onClick={() => handleCategory(category)} />;
              })}
            </div>
          </div>
        </div>
        {/* product */}
        <div className="mt-4">
          <div className="w-full  bg-white rounded-t-3xl min-h-screen">
            <div className="py-5  flex justify-evenly flex-wrap gap-5">
              {productsIsLoading &&
                fakeArr.map((a, i) => {
                  return (
                    <div key={i} className=" h-60 w-40 bg-white shadow-md border rounded-3xl overflow-hidden flex-col relative hover:-translate-y-1 hover:translate-x-1 hover:transition-transform ">
                      {/* Empty */}
                      <div className="bg-gray-300 w-full  animate-pulse h-32 overflow-hidden  "></div>
                      {/* DETAIL*/}
                      <div className="py-2 px-3 flex-col h-28 ">
                        <div className="">
                          <p className=" text-[10px] text-[#618D80] bg-gray-300 animate-pulse rounded-3xl w-32 h-3"></p>
                          <p className=" text-[10px] text-[#618D80] bg-gray-300 animate-pulse rounded-3xl w-12 h-3 mt-4"></p>
                          <p className=" text-[10px] text-[#618D80] bg-gray-300 animate-pulse rounded-3xl w-20 h-3 mt-2"></p>
                        </div>
                        <div className="flex items-center absolute bottom-3 ">
                          <p className=" text-[10px] text-[#618D80] bg-gray-300 animate-pulse rounded-3xl w-20 h-2 mt-2"></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {selectedProducts.length > 0 ? (
                selectedProducts.map((product, i) => <Product key={product.id_product} product={product} />)
              ) : (
                <div className="py-8 flex items-center opacity-50 font-bold">
                  <h1>Produk Tidak Tersedia</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
