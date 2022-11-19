import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import back from "../../assets/svg/back.svg";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Category from "../../components/atom/category";
import Product from "../../components/molecule/product";
import CheckoutForm from "../../components/organism/checkoutform";
import SearchSection from "../../components/organism/searchsection";
import Sellersection from "../../components/organism/shoppage/sellersection";
import { fetchProductsAsync } from "../../store/products/produtcs.action";
import { selectProducts } from "../../store/products/products.selector";
import { selectFormVis } from "../../store/transaction/transaction.selector";
import fakeImage from "../../assets/img/gabi-miranda-dxb_HSjoQ40-unsplash.png";
import axios from "axios";
import shop from "../../assets/svg/shop.svg";
import Rating from "../../components/atom/rating";
import { selectAllDataTransaction, selectAllTransaction, selectRatingArr } from "../../store/alltransaction/alltransaction.selector";
import CardRating from "../../components/organism/rating/card";
import { saveRating } from "../../store/alltransaction/alltransaction.action";
import { deleteTransaction } from "../../store/alltransaction/alltransaction.action";
import Swal from "sweetalert2";
export default function RatingProduct() {
  const dispatch = useDispatch();
  const router = useRouter();

  ///////////
  ///////////
  const transactionId = router.asPath.split("/")[2];
  const [transactionDetail, setTransactionDetail] = useState("");
  useEffect(() => {
    const getTransaction = async (transactionId) => {
      try {
        const res = await axios.get(`http://malon.my.id:8888/api/seller/v1/transaction/data/${transactionId}`);
        const data = res.data.data;
        setTransactionDetail(data);
      } catch (error) {}
    };
    getTransaction(transactionId);
  }, [transactionId]);

  ///////
  ///////
  const [shopData, setShopData] = useState("");
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
    getShopData(transactionDetail?.transaction?._id_toko);
  }, [transactionDetail]);

  //////
  //////
  //////
  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, []);
  const allProduct = useSelector(selectProducts);

  ///////
  ///////
  let [totalRating, setTotalRating] = useState(0);
  const handleRating = (value) => {
    totalRating = value;
    setTotalRating(value);
  };
  let [ratingArr, setRatingArr] = useState([]);
  useEffect(() => {
    ratingArr = [];
    let fillRating = totalRating;
    let emptyRating = 5 - fillRating;
    for (let i = 0; i < fillRating; i++) {
      ratingArr.push(
        <div
          onClick={() => {
            handleRating(i + 1);
          }}
        >
          <Rating fill="fill" width={10} height={10} />
        </div>
      );
    }
    for (let i = 0; i < emptyRating; i++) {
      ratingArr.push(
        <div
          className=""
          onClick={() => {
            handleRating(totalRating + i + 1);
          }}
        >
          <Rating fill="empty" width={10} height={10} />
        </div>
      );
    }

    setRatingArr(ratingArr);
  }, [totalRating]);

  /////
  ///////
  ///////
  useEffect(() => {
    dispatch(saveRating([]));
  }, []);
  const ratingReducer = useSelector(selectRatingArr);
  const allId = useSelector(selectAllTransaction);
  const handleSendRating = () => {
    const id = transactionDetail.code.transaction_id;
    if (ratingReducer.length == transactionDetail.transaction.cart.length) {
      ratingReducer.forEach((element) => {
        const postRating = async () => {
          try {
            const res = await axios({
              method: "post",
              url: `http://malon.my.id:8888/api/seller/v1/product/star/${element.idProduct}`,
              data: { star: element.star },
            });
            const data = res.data.data;
          } catch (error) {}
        };
        postRating();

        dispatch(deleteTransaction(id, allId));
      });
      router.push("/shop");
    } else {
      Swal.fire({
        icon: "error",
        title: "kirim rating gagal",
        text: "isi rating terlebih dahulu",
      });
    }
  };

  return (
    <div className="flex justify-center ">
      <div className="w-screen max-w-md  bg-mygreen  relative border border-gray-200">
        {/* checkout form */}
        {/* {checkoutFormVis && <CheckoutForm />} */}
        {/* notif etc */}
        <div className="px-5 py-4">
          <Sellersection />
        </div>
        {/* search section */}
        {/* <div className="my-4 px-5">
          <SearchSection func={handleSearch} />
        </div> */}
        {/* category */}
        {/* <div className="px-5">
          <div className=" items-center">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category, i) => {
                return <Category key={i} category={category} isActive={selectedCategory} onClick={() => handleCategory(category)} />;
              })}
            </div>
          </div>
        </div> */}
        {/* product */}
        <div className="mt-4">
          <div className="w-full bg-white rounded-t-3xl min-h-screen h-fit relative">
            <div className=" py-4 px-7">
              {/*  */}
              <div className="flex gap-6 items-center  mb-6">
                <Link href="/notify">
                  <Image src={back}></Image>
                </Link>
                <div className="flex items-center ">
                  <span className="mr-2">
                    <Image src={shop} alt="tes" width={30} height={30} />
                  </span>
                  <p className=" text-[#618D80] text-2xl">{shopData?.name}</p>
                </div>
              </div>
              {/*  */}
              <div className=" flex flex-col gap-3 relative">
                {/* card */}
                {transactionDetail?.transaction?.cart.map((prod, i) => (
                  <CardRating key={i} product={prod} />
                ))}

                <button onClick={handleSendRating} className=" -bottom-28  text-base w-44 absolute right-0 rounded-xl bg-[#618D80] px-2 py-3  flex justify-center text-white font-bold">
                  Kirim Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
