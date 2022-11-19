import axios from "axios";
import cookieCutter from "cookie-cutter";
import Link from "next/link";
import { useEffect, useState } from "react";

const Pending = () => {
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const getTokoStatus = async () => {
    setIsLoading(true);
    const toko_id = cookieCutter.get("toko_id");
    const token = cookieCutter.get("token");
    try {
      const {
        data: { data },
      } = await axios.get(
        `http://malon.my.id:8888/api/seller/v1/shop/data/${toko_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(data.status);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTokoStatus();
  }, []);

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="p-6 w-screen h-screen md:w-96 bg-mygreen">
        {status === 0 ? (
          <div className="h-full text-center flex flex-col justify-center items-center">
            <h1 className="mb-6 text-2xl text-center text-slate-800 font-bold">
              Pending...
            </h1>
            <p className="mb-12 text-slate-700">
              Pembuatan Toko Anda sedang diproses oleh Admin
            </p>
            {!isLoading ? (
              <p>
                Status :{" "}
                <span className="text-xl tracking-wide font-bold text-red-500">
                  {status === 0 ? "Di Proses" : "Diterima"}
                </span>
              </p>
            ) : (
              <div className="w-36 h-6 bg-slate-300 animate-pulse rounded-xl"></div>
            )}

            <button onClick={() => getTokoStatus()}>
              <p className="py-3 px-6 m-3 bg-mygreen_dark rounded-xl font-semibold text-white">
                Refresh Status
              </p>
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center">
            <h1 className="mb-6 text-slate-800 text-2xl font-semibold text-center">
              Pendaftaran Toko anda telah diterima !!
            </h1>
            <div>
              <Link href="/seller/dashboard">
                <p className="py-3 px-6 bg-mygreen_dark rounded-xl font-semibold text-white">
                  Mulai Menjual
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pending;
