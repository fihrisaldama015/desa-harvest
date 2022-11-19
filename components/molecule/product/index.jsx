import React, { useEffect, useState } from "react";
import Image from "next/image";
import Rating from "../../atom/rating";
import shop from "../../../assets/svg/shop.svg";
import Link from "next/link";
import axios from "axios";
export default function Product({ product }) {
  const { qt, image, id_product, toko_id, name, product_uom, product_category, price } = product;
  let productImage;
  if (image.length > 0) {
    productImage = image[0].filename;
  }
  const isEmpty = qt > 0 ? false : true;
  const [storeData, setStoreData] = useState("");
  const [storeName, setStoreName] = useState("");
  useEffect(() => {
    const getStoreData = async (toko_id) => {
      try {
        const res = await axios.get(`http://malon.my.id:8888/api/user/v1/toko/data/${toko_id}`);
        const data = res.data.data;
        const { name, image_profile } = data;
        setStoreName(name);
      } catch (error) {}
    };

    getStoreData(toko_id);
  }, [toko_id]);

  let [ratingProduct, setRatingProd] = useState(0);
  useEffect(() => {
    try {
      const getRatingProduct = async (id_product) => {
        const res = await axios.get(`http://malon.my.id:8888/api/seller/v1/product/data/${id_product}`);
        const data = res.data.data;
        const allStar = data.stars;
        let totalStars = 0;
        let avgStar = 0;
        if (allStar.length > 0) {
          totalStars = allStar.reduce((a, c) => a + c);
          if (allStar[0] == 0 && allStar.length > 1) {
            avgStar = Math.round(totalStars / (allStar.length - 1));
          } else {
            avgStar = Math.round(totalStars / allStar.length);
          }
        }
        setRatingProd(avgStar);
      };
      getRatingProduct(id_product);
    } catch (error) {}
  }, [id_product]);

  let [ratings, setRatings] = useState([]);
  useEffect(() => {
    let ratingsarr = [];
    let key = 0;
    for (let i = 0; i < ratingProduct; i++) {
      ratingsarr.push(<Rating key={key} />);
      key++;
    }
    for (let i = 0; i < 5 - ratingProduct; i++) {
      ratingsarr.push(<Rating fill="empty" key={key} />);
      key++;
    }
    setRatings(ratingsarr);
  }, [ratingProduct]);

  return (
    <Link href={`shop/${id_product}`}>
      <div className=" h-60 w-40 bg-white shadow-md border rounded-3xl overflow-hidden flex-col relative hover:-translate-y-1 hover:translate-x-1 hover:transition-transform ">
        {/* Empty */}
        {isEmpty && (
          <div className=" w-full h-full flex items-center justify-center absolute bg-black z-10 bg-opacity-50">
            <div className=" bg-[#FB7777] text-white h-9  w-32 flex items-center justify-center rounded-3xl ">Habis</div>
          </div>
        )}
        <div className="bg-gray-100 w-full  h-32 overflow-hidden  ">
          <Image priority width={120} height={120} className=" w-full h-full object-cover" alt="" src={`http://malon.my.id:8888/api/seller/file/product/${productImage}`} />
        </div>
        {/* DETAIL*/}
        <div className="py-1 px-3 flex-col h-28 ">
          <div className="">
            <p className=" text-[10px] text-[#618D80]">{name}</p>
            <p className=" text-xs font-bold text-[#618D80] mt-2">
              Rp {price}/{product_uom}
            </p>
            <div className=" flex gap-1 mt-1">{ratings.map((component) => component)}</div>
          </div>
          <div className="flex items-center absolute bottom-3 ">
            <span className=" mr-2">
              <Image src={shop} alt="" priority={true} />
            </span>
            <p className=" text-[#618D80] text-[8px]">{storeName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
