import axios from "axios";
import cookieCutter from "cookie-cutter";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [allShop, setAllShop] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getAllShop = async () => {
    const token_admin = cookieCutter.get("token_admin") || null;
    try {
      const {
        data: { data },
      } = await axios.get(`http://malon.my.id:8888/api/seller/v1/shop/all/`, {
        headers: { Authorization: `Bearer ${token_admin}` },
      });
      console.log(data);
      setAllShop(data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptToko = async (toko_id) => {
    const token_admin = cookieCutter.get("token_admin") || null;
    const formdata = new FormData();
    formdata.append("status", 1);
    const result = await Swal.fire({
      title: "Terima Pendaftaran ?",
      text: `toko_id: ${toko_id}`,
      showDenyButton: true,
      confirmButtonText: "Terima",
      denyButtonText: "Batal",
    });
    if (result.isDenied) return;
    try {
      const { data } = await axios.put(
        `http://malon.my.id:8888/api/seller/v1/shop/data/${toko_id}`,
        formdata,
        { headers: { Authorization: `Bearer ${token_admin}` } }
      );
      Swal.fire("Berhasil", "Pendaftaran Toko di Terima !", "success");
      getAllShop();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectToko = async (toko_id) => {
    const token_admin = cookieCutter.get("token_admin") || null;
    const formdata = new FormData();
    formdata.append("status", 0);
    const result = await Swal.fire({
      title: "Hentikan Aktifitas Toko",
      text: `toko_id: ${toko_id}`,
      showDenyButton: true,
      confirmButtonText: "Hentikan",
      denyButtonText: "Batal",
    });
    if (result.isDenied) return;
    try {
      const { data } = await axios.put(
        `http://malon.my.id:8888/api/seller/v1/shop/data/${toko_id}`,
        formdata,
        { headers: { Authorization: `Bearer ${token_admin}` } }
      );
      Swal.fire("Success", "Aktifitas Toko Terhenti Sementara !", "success");
      getAllShop();
    } catch (error) {
      console.log(error);
    }
  };

  const controller = new AbortController();
  useEffect(() => {
    const signal = controller.signal.aborted;
    !signal &&
      (async () => {
        await getAllShop();
        setIsLoading(false);
      })();
    return () => controller.abort();
  }, []);
  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="flex flex-col min-h-screen w-screen md:w-96 bg-mygreen">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-slate-700">
            Admin Dashboard
          </h1>
        </div>
        <div>
          <div className="flex flex-col justify-center items-center">
            <table className="border-separate border-spacing-0">
              <thead>
                <tr className="[&>th]:p-2 [&>th]:text-slate-800 [&>th]:text-sm [&>th]:font-normal [&>th]:bg-[#ADCEC4]">
                  <th className="rounded-tl-xl">Nama Toko</th>
                  <th>Keuntungan</th>
                  <th>Status</th>
                  <th className="rounded-tr-xl">Aksi</th>
                </tr>
              </thead>
              {!isLoading &&
                allShop.map((shop, id) => (
                  <tbody key={id} className="bg-mygreen_dark text-white">
                    <tr className="[&>td]:p-2 [&>td]:text-sm">
                      <td>{shop.name}</td>
                      <td>Rp.{shop.pendapatan_total}</td>
                      {shop.status ? (
                        <td>
                          <span className="bg-green-200 px-2 py-1 rounded-xl text-xs font-bold text-green-600">
                            Diterima
                          </span>
                        </td>
                      ) : (
                        <td>
                          <span className="bg-yellow-200 px-2 py-1 rounded-xl text-xs font-bold text-yellow-600">
                            Menunggu
                          </span>
                        </td>
                      )}
                      <td className="flex gap-3 justify-center items-center">
                        {!shop.status ? (
                          <div
                            onClick={() => acceptToko(shop.toko_id)}
                            className="bg-[url('/icons/accept.svg')] w-[16px] h-[16px] scale-150 hover:scale-125 cursor-pointer"
                          ></div>
                        ) : (
                          <div className="flex">
                            <div
                              onClick={() => rejectToko(shop.toko_id)}
                              className="bg-[url('/icons/delete.svg')] z-10 w-[16px] h-[16px] scale-150 hover:scale-125 cursor-pointer"
                            ></div>
                            <div className="bg-white absolute z-0 w-[16px] h-[16px] rounded-full scale-100"></div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
