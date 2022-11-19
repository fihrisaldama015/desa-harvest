import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import shop from "../../../assets/svg/shop.svg";
import { transactionBuy } from "../../../store/transaction/transaction.action";
import { deleteShopCart } from "../../../store/cart/cart.action";
import { getTotalPrice } from "../../../store/util";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../../../store/cart/cart.selector";
import { useRouter } from "next/router";

export default function ShopCart({ cartData }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { _id_toko } = cartData;
  const [shopData, setShopData] = useState("");
  const allCart = useSelector(selectCart);

  useEffect(() => {
    const getShopData = async (id) => {
      try {
        if (id) {
          const { data } = await axios.get(`http://malon.my.id:8888/api/user/v1/toko/data/${id}`);
          const shopData = data.data;
          setShopData(shopData);
        }
      } catch (error) {}
    };
    getShopData(_id_toko);
  }, [_id_toko]);

  /////
  let totalPrice = getTotalPrice(cartData);
  /////
  // get file name image
  const [fileNameShop, setFileNameShop] = useState("");
  useEffect(() => {
    const getFileName = async () => {
      try {
        if (shopData) {
          const { data } = await axios.get(`http://malon.my.id:8888/api/user/v1/toko/image/${shopData?.image_profile}`);
          const fileName = data.data.filename;
          setFileNameShop(fileName);
        }
      } catch (error) {}
    };
    getFileName();
  }, [shopData]);

  const handleBuy = () => {
    dispatch(transactionBuy({ _id_toko: _id_toko, cart: cartData.cart }));
    dispatch(deleteShopCart(_id_toko, allCart));
    router.push("/shop");
  };
  const handleDeleteStoreCart = () => {
    dispatch(deleteShopCart(_id_toko, allCart));
  };
  return (
    <div>
      <div className=" ">
        <div className=" w-full  px-5 py-3 shadow-md rounded-md flex relative">
          <button onClick={handleDeleteStoreCart} className=" absolute top-2 right-2 opacity-20 p-2 rounded-full hover:bg-gray-500 ">
            <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px">
              <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z" />
            </svg>
          </button>
          {fileNameShop ? (
            <div className="w-14 h-14 bg-gray-500 rounded-full overflow-hidden ">
              <Image className="w-full h-full  object-cover" alt="" width={80} height={80} src={`http://malon.my.id:8888/api/seller/file/toko/${fileNameShop}`} />
            </div>
          ) : (
            <div className="w-14 h-14 bg-gray-500 rounded-full overflow-hidden "></div>
          )}
          <div className="ml-10 flex flex-col ">
            {/* namatoko */}
            <div className="flex">
              <span className=" mr-2">
                <Image src={shop} alt="tes" width={21} height={21} />
              </span>
              <p className=" text-[#618D80] text-base">{shopData ? shopData.name : ""}</p>
            </div>
            {/*  harga */}
            <div>
              <p className=" mt-3 mb-2 text-base font-bold text-[#618D80] ">Rp {totalPrice}</p>
            </div>
            {/* STATUS */}
            <div className=" flex gap-2">
              <Link href={`/cart/${_id_toko}`} className=" bg-[#FFD600] py-2 px-5 rounded-lg">
                <p className=" font-bold text-xs">Detail</p>
              </Link>
              <div onClick={handleBuy} className=" bg-[#FB7777] py-2 px-5 rounded-lg cursor-pointer">
                <p className=" font-bold text-xs"> Beli</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
