import React, { useState, useEffect } from "react";
import Image from "next/image";
import fakeImage from "../../../assets/img/gabi-miranda-dxb_HSjoQ40-unsplash.png";
import Rating from "../../atom/rating";
import { useDispatch, useSelector } from "react-redux";
import { selectProducts } from "../../../store/products/products.selector";
import { fetchProductsAsync } from "../../../store/products/produtcs.action";
import { setRatingReducer } from "../../../store/alltransaction/alltransaction.action";
import { selectRatingArr } from "../../../store/alltransaction/alltransaction.selector";
export default function CardRating({ product }) {
  const { id_product, product_uom, qt, total_price } = product;
  const products = useSelector(selectProducts);
  const [productDetail, setProductDetail] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const selectedProduct = products.filter((p) => p.id_product == id_product)[0];
      setProductDetail(selectedProduct);
    } catch (error) {}
  }, []);

  //////////
  //////////

  //////////
  //////////
  const ratingReducer = useSelector(selectRatingArr);
  let [totalRating, setTotalRating] = useState(0);
  const handleRating = (value) => {
    totalRating = value;
    setTotalRating(value);
    dispatch(setRatingReducer(id_product, value, ratingReducer));
  };
  let [ratingArr, setRatingArr] = useState([]);
  useEffect(() => {
    ratingArr = [];
    let fillRating = totalRating;
    let key = 0;
    let emptyRating = 5 - fillRating;
    for (let i = 0; i < fillRating; i++) {
      ratingArr.push(
        <div
          key={key}
          onClick={() => {
            handleRating(i + 1);
          }}
        >
          <Rating fill="fill" width={10} height={10} />
        </div>
      );
      key++;
    }
    for (let i = 0; i < emptyRating; i++) {
      ratingArr.push(
        <div
          key={key}
          className=""
          onClick={() => {
            handleRating(totalRating + i + 1);
          }}
        >
          <Rating fill="empty" width={10} height={10} />
        </div>
      );
      key++;
    }

    setRatingArr(ratingArr);
  }, [totalRating]);

  return (
    <div className=" w-full rounded-lg    flex overflow-hidden shadow">
      <div className=" flex-none w-32 h-28 bg-gray-500">{productDetail && <Image alt="" width={128} height={100} src={`http://malon.my.id:8888/api/seller/file/product/${productDetail?.image[0].filename}`} />}</div>
      {/* detail */}
      <div className="pr-3 pl-5 py-4 flex flex-col justify-center">
        {/* nama produk */}
        <div className=" text-[#618D80] text-[10px] mb-2">{productDetail?.name}</div>
        {/* price */}
        <div className="text-[#618D80] text-xs font-bold mb-2">
          Rp. {productDetail.price}/{productDetail.product_uom}
        </div>
        {/*rating  */}
        <div className=" flex items-center gap-4 bg-[#618D80] px-3 py-1 rounded-3xl w-fit ">
          <div className="font-bold text-white text-xs">Rating :</div>
          <div>
            <div className="flex gap-1">{ratingArr.map((r) => r)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
