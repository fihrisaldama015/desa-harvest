import cookieCutter from "cookie-cutter";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import DashboardNavBar from "../../../components/seller/DashboardNavBar";
import DashboardSellerProduct from "../../../components/seller/DashboardSellerProduct";
import DashboardNotification from "../../../components/seller/DashboardNotification";
import DashboardCatalog from "../../../components/seller/DashboardCatalog";
import Link from "next/link";
import TokoProfil from "../../../components/seller/TokoProfil";
import DashboardReport from "../../../components/seller/DashboardReport";

const SellerDashboard = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [dataToko, setDataToko] = useState();
  const [tokoPic, setTokoPic] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const [menu, setMenu] = useState("product");

  const router = useRouter();
  const navbarRef = useRef(null);

  const getDataToko = async () => {
    const toko_id = cookieCutter.get("toko_id");
    const token = cookieCutter.get("token");
    if (toko_id === "null" || toko_id === undefined) {
      router.push("/seller/createprofile");
      return;
    }

    let image_profile;
    try {
      if (toko_id === "null") throw "Belum Daftar Toko";
      const {
        data: { data },
      } = await axios.get(
        `http://malon.my.id:8888/api/seller/v1/shop/data/${toko_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDataToko(data);
      if (data.status === 0) {
        router.push("/seller/pending");
        return;
      }
      image_profile = data.image_profile;
    } catch (error) {
      console.log(error.response);
    }
    try {
      const {
        data: {
          data: { filename },
        },
      } = await axios.get(
        `http://malon.my.id:8888/api/seller/v1/shop/image/${image_profile}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTokoPic({ filename });
    } catch (error) {
      console.log(error.response);
    }
  };

  const refresh = (param) => {
    setIsRefresh(param);
  };

  const controller = new AbortController();
  useEffect(() => {
    const signal = !controller.signal.aborted;
    signal &&
      (async () => {
        getDataToko();
        setIsLoading(false);
      })();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const current = navbarRef.current;
    setNavbarHeight(current.clientHeight);
  }, [dataToko]);

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="flex flex-col w-screen md:w-96">
        <div
          ref={navbarRef}
          className="flex flex-col fixed bg-white top-0 justify-center items-center text-left min-h-[25vh] w-screen md:w-96 shadow-sm shadow-green-900/20 z-10"
        >
          <div className="pt-3 px-3 flex items-center justify-between w-full">
            <h1 className="text-xl font-bold drop-shadow-sm mr-auto">
              Toko Kamu
            </h1>
            <Link href="/seller/dashboard/settings">
              <div className="bg-[url('/icons/settings.svg')] w-[15px] h-[16px] scale-125 hover:scale-110 hover:cursor-pointer transition-all"></div>
            </Link>
          </div>
          <TokoProfil
            filename={!isLoading && tokoPic?.filename}
            name={!isLoading && dataToko?.name}
            isLoading={isLoading}
          />
          {!isLoading && dataToko && (
            <DashboardNavBar
              menu={menu}
              setMenu={(pilihan) => setMenu(pilihan)}
              toko={dataToko._id}
              refresh={isRefresh}
              reset={() => refresh(false)}
            />
          )}
        </div>
        <div
          style={{ paddingTop: !isLoading ? `${navbarHeight}px` : `0px` }}
          key={"sellerDashboard"}
        >
          {menu === "product" ? (
            !isLoading &&
            dataToko && (
              <DashboardSellerProduct
                product={dataToko.product}
                toko={dataToko.name}
              />
            )
          ) : menu === "notification" ? (
            !isLoading && (
              <DashboardNotification
                toko={dataToko?._id}
                refresh={() => refresh(true)}
              />
            )
          ) : menu === "catalog" ? (
            <div className="bg-mygreen min-h-screen">
              <DashboardCatalog />
            </div>
          ) : (
            <div className="bg-mygreen min-h-screen">
              <DashboardReport />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
