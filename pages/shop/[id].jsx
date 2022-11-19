import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import Rating from "../../components/atom/rating";
import shop from "../../assets/svg/shop.svg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Shopbagcircle from "../../components/atom/shopbagcircle";
import SettingCircle from "../../components/atom/settingcircle";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAsync, getProductByID } from "../../store/products/produtcs.action";
import { selectProduct, selectProducts } from "../../store/products/products.selector";
import CheckoutComp from "../../components/organism/checkoutcomp";
import axios from "axios";
import Notifcircle from "../../components/atom/notifcircle";
export default function ProductPage() {
  const route = useRouter();
  const dispatch = useDispatch();

  //
  //
  //get product informations
  const idProduct = route.asPath.split("/")[2];
  const product = useSelector(selectProduct);
  const products = useSelector(selectProducts);
  useEffect(() => {
    dispatch(getProductByID(idProduct, products));
  }, [idProduct, products, dispatch]);
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);
  //get produxt informations
  //
  //

  //
  //
  // get store name
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const getStoreData = async (toko_id) => {
      try {
        if (toko_id != undefined && toko_id != "[id]") {
          const res = await axios.get(`http://malon.my.id:8888/api/user/v1/toko/data/${toko_id}`);
          const data = res.data.data;
          const { name, image_profile } = data;

          setStoreName(name);
        }
      } catch (error) {}
    };
    getStoreData(product?.toko_id);
  }, [product]);
  // get store name
  //
  //

  let [ratingProduct, setRatingProd] = useState(0);
  useEffect(() => {
    try {
      const getRatingProduct = async (id_product) => {
        if (id_product != "[id]") {
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
        }
      };
      getRatingProduct(idProduct);
    } catch (error) {}
  }, [idProduct]);

  let [ratings, setRatings] = useState([]);
  useEffect(() => {
    let ratingsarr = [];
    for (let i = 0; i < ratingProduct; i++) {
      ratingsarr.push(<Rating key={i} width={24} height={24} />);
    }
    for (let i = ratingProduct; i < 5; i++) {
      ratingsarr.push(<Rating key={i} width={24} height={24} fill="empty" />);
    }
    setRatings(ratingsarr);
  }, [ratingProduct]);

  return (
    <div className="flex justify-center ">
      <div className="w-screen max-w-md h-screen bg-mygreen ">
        {/* swiper */}
        <div className="relative">
          {/* 2 absolute circle */}

          <div className=" text-white z-20 bg-black bg-opacity-10  w-full p-2 px-4 absolute">
            <div className=" flex gap-2 justify-between">
              <div className=" flex items-center gap-2">
                <Link href="/shop">
                  <svg width="20" height="13" viewBox="0 0 20 13" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3.0023e-09 6.50258C0.00167844 6.72498 0.0871314 6.93803 0.238333 7.09676L0.243333 7.10707L5.24333 12.259C5.4005 12.4154 5.611 12.5019 5.8295 12.5C6.048 12.498 6.25701 12.4077 6.41152 12.2485C6.56602 12.0893 6.65366 11.8739 6.65556 11.6488C6.65746 11.4237 6.57347 11.2068 6.42167 11.0448L2.845 7.35779H19.1667C19.3877 7.35779 19.5996 7.26733 19.7559 7.1063C19.9122 6.94527 20 6.72687 20 6.49914C20 6.27141 19.9122 6.05301 19.7559 5.89198C19.5996 5.73096 19.3877 5.64049 19.1667 5.64049H2.845L6.42167 1.95516C6.57347 1.79322 6.65746 1.57632 6.65556 1.35119C6.65366 1.12605 6.56602 0.910693 6.41152 0.751493C6.25701 0.592292 6.048 0.501989 5.8295 0.500032C5.611 0.498076 5.4005 0.584623 5.24333 0.741033L0.243333 5.89293L0.238333 5.90152C0.164147 5.97897 0.105278 6.07054 0.0650001 6.17114C0.0221002 6.27484 -9.40675e-06 6.38641 3.0023e-09 6.49914V6.50258Z"
                      fill="#fff"
                    />
                  </svg>
                </Link>
                {/* <Link href="/shop">Kembali</Link> */}
              </div>
              <div className="flex gap-2">
                <Shopbagcircle />
                <Notifcircle />
              </div>
              {/* <SettingCircle /> */}
            </div>
          </div>

          {/* swiper comp */}
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{ clickable: true }}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => {}}
            onSlideChange={() => {}}
            className="w-full h-96 "
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
              "--swiper-navigation-size": "20px",
            }}
          >
            {product?.image?.map((img, i) => {
              return (
                <SwiperSlide key={i} className="">
                  <Image width={300} height={300} priority alt="" src={`http://malon.my.id:8888/api/seller/file/product/${img.filename}`} className="w-full h-full" />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        {/*  detail*/}
        <div className="relative bottom-20 z-10 flex-col">
          <div className="bg-white w-full h-screen  rounded-[40px]  relative">
            <div className="px-7 pt-5 flex-col lg:h-[300px]">
              {/* detail */}
              <div>
                <div className="">
                  <p className=" text-2xl text-[#618D80]">{product?.name}</p>
                  <p className=" text-2xl font-bold text-[#618D80] mt-2">
                    Rp{product?.price}/{product?.product_uom}
                  </p>
                  <div className="flex gap-1 mt-2">{ratings.map((e) => e)}</div>
                </div>
                <div className="flex items-center mt-8">
                  <span className="mr-2 shrink-0">
                    <Image src={shop} alt="" width={24} height={24} />
                  </span>
                  <p className="text-[#618D80] text-2xl">{storeName}</p>
                </div>
              </div>
            </div>
            {/* shopbag */}
            {/* <div className=" my-5 px-7">
                <button onClick={handleSaveCart}>
                  <div className="p-2 w-fit rounded-full border  flex items-center justify-center" style={{ borderColor: "#618D80" }}>
                    <svg width={21} height={21} viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2.05163 6.88587C2.08017 6.53023 2.24162 6.1984 2.50382 5.95645C2.76602 5.7145 3.10973 5.58019 3.4665 5.58026H12.0225C12.3792 5.58019 12.723 5.7145 12.9852 5.95645C13.2474 6.1984 13.4088 6.53023 13.4374 6.88587L14.0071 13.9815C14.0228 14.1768 13.9979 14.3732 13.9339 14.5584C13.87 14.7435 13.7684 14.9135 13.6355 15.0574C13.5027 15.2014 13.3415 15.3163 13.1621 15.3949C12.9826 15.4735 12.7889 15.5142 12.593 15.5142H2.89601C2.70012 15.5142 2.50635 15.4735 2.32692 15.3949C2.14749 15.3163 1.98628 15.2014 1.85344 15.0574C1.7206 14.9135 1.619 14.7435 1.55505 14.5584C1.4911 14.3732 1.46617 14.1768 1.48184 13.9815L2.05163 6.88587V6.88587Z"
                        stroke="#618D80"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5828 7.70896V4.16112C10.5828 3.40836 10.2838 2.68644 9.75148 2.15416C9.2192 1.62188 8.49728 1.32285 7.74452 1.32285C6.99177 1.32285 6.26984 1.62188 5.73756 2.15416C5.20528 2.68644 4.90625 3.40836 4.90625 4.16112V7.70896"
                        stroke="#618D80"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div> */}
            {/* checkout comp */}
            <div className=" fixed bottom-0  max-w-md w-full">{product ? <CheckoutComp product={product} /> : null}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
