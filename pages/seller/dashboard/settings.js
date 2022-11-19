/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import cookieCutter from "cookie-cutter";
import axios from "axios";
import Swal from "sweetalert2";

const Settings = () => {
  const [dataToko, setDataToko] = useState();
  const [tokoPic, setTokoPic] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState();
  const [namaToko, setNamaToko] = useState();
  const [idToko, setIdToko] = useState();
  const [alamat, setAlamat] = useState();
  const [height, setHeight] = useState(50);
  const router = useRouter();

  const alamatRef = useRef(null);
  const uploadFile = (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      console.log("src => ", fileReader.result);
    };
    console.log("url => ", fileReader.readAsDataURL(file));
    setFile(file);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    console.log(file);
    try {
      const formdata = new FormData();
      file && formdata.append("file", file);
      formdata.append("name", namaToko);
      formdata.append("toko_id_update", idToko);
      formdata.append("status", 1);
      formdata.append("alamat", alamat);
      const token = cookieCutter.get("token") || null;
      const { data } = await axios.put(
        `http://malon.my.id:8888/api/seller/v1/shop/data/${dataToko.toko_id}`,
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await Swal.fire("Berhasil", data.message, "success");
      cookieCutter.set("toko_id", `${idToko}`);
      //   if (result.isConfirmed) router.push("/seller/dashboard");
      if (result.isConfirmed) window.location.href = "/seller/dashboard";
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 500)
        Swal.fire("Server Error", "Mohon Pilih gambar yang lain", "error");
      else Swal.fire("Oops", error.response.data.message, "error");
    }
  };

  const deleteToko = async () => {
    const token = cookieCutter.get("token") || null;
    const result = await Swal.fire({
      title: "Apakah Anda Yakin ingin Menghapus Toko Anda dan Semua datanya?",
      showDenyButton: true,
      confirmButtonText: "Ya, Hapus :(",
      denyButtonText: `Jangan hapus Toko :)`,
    });
    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(
          `http://malon.my.id:8888/api/seller/v1/shop/data/${dataToko.toko_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire("", data.message, "success");
        cookieCutter.set("token", "", { expires: new Date(0) });
        cookieCutter.set("toko_id", "", { expires: new Date(0) });
        router.push("/seller/login");
      } catch (error) {
        Swal.fire("Error", error.response.statusText, "error");
      }
    } else if (result.isDenied) {
      Swal.fire("Batal", "Membatalkan penghapusan data toko", "error");
    }
  };

  const getDataToko = async () => {
    const toko_id = cookieCutter.get("toko_id");
    const token = cookieCutter.get("token");
    try {
      if (toko_id === "null") throw "Belum Daftar Toko";
      const {
        data: { data },
      } = await axios.get(
        `http://malon.my.id:8888/api/seller/v1/shop/data/${toko_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDataToko(data);
      setNamaToko(data.name);
      setAlamat(data.alamat);
      setIdToko(data.toko_id);
      const {
        data: {
          data: { filename },
        },
      } = await axios.get(
        `http://malon.my.id:8888/api/seller/v1/shop/image/${data.image_profile}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTokoPic({ filename });
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      //   router.push("/seller/createprofile");
    }
  };

  useEffect(() => {
    if (alamat) {
      const element = alamatRef.current;
      setHeight(element.scrollHeight);
    }
  }, [alamat]);

  useEffect(() => {
    getDataToko();
  }, []);
  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="flex flex-col w-screen md:w-96 bg-mygreen min-h-screen">
        <div className="py-3 px-5 bg-white shadow-sm ring-1 ring-slate-100 rounded flex w-full justify-between items-center">
          <Link href="/seller/dashboard">
            <div className="bg-[url('/icons/back.svg')] w-[20px] h-[13px]"></div>
          </Link>
          <Link href="/seller/logout">
            <div className="text-white bg-red-400 hover:bg-red-500 transition-all px-3 py-1 rounded-xl font-bold shadow-sm shadow-red-300">
              Log Out
            </div>
          </Link>
        </div>
        <div className="p-3">
          <div className="p-3 flex flex-col justify-between items-center transition-all">
            <h1 className="text-lg font-bold text-slate-700 drop-shadow-sm mb-6 mr-auto sm:mx-auto">
              Edit Profil Tokomu
            </h1>
            {!file ? (
              !isLoading ? (
                <img
                  src={`http://malon.my.id:8888/api/seller/file/toko/${tokoPic.filename}`}
                  className="rounded-full w-[100px] h-[100px]"
                  alt=""
                ></img>
              ) : (
                <div className="rounded-full w-[100px] h-[100px] bg-green-100"></div>
              )
            ) : (
              <img
                src={URL.createObjectURL(file)}
                //   height={100}
                //   width={100}
                //   priority
                //   style={{ display: isCropping ? "none" : "" }}
                //   className="rounded-full"
                className="rounded-full w-[100px] h-[100px]"
                alt="profile"
              ></img>
            )}

            <form
              onSubmit={(e) => updateProfile(e)}
              className="flex flex-col w-full sm:w-96 p-12 text-slate-600"
            >
              <div className="p-3 m-6 mt-0 rounded-full relative bg-mygreen_dark/70 hover:bg-mygreen_dark hover:cursor-pointer transition-colors">
                <input
                  type="file"
                  accept=".jpg, .png, .svg, .jfif, .webp"
                  onChange={(e) => uploadFile(e.target.files[0])}
                  className="absolute hover:cursor-pointer rounded-3xl w-full h-full top-0 left-0 opacity-0 focus:outline-none font-normal text-sm form-control"
                />
                <div className="flex">
                  <p className="font-bold text-center text-white w-full">
                    Unggah Foto Profil
                  </p>
                  <div className="bg-white bg-[url('/icons/upload.svg')] absolute -left-3 -top-3 my-auto rounded-full shadow-md w-[40px] h-[40px]"></div>
                </div>
              </div>
              <label htmlFor="nama-toko" className="text-sm mb-3 ml-3">
                Nama Toko
              </label>
              <input
                type="text"
                id="nama-toko"
                placeholder="Nama Toko"
                onChange={(e) => setNamaToko(e.target.value)}
                value={!isLoading ? namaToko : ""}
                className="py-3 px-6 mb-6 rounded-3xl focus:outline-none font-medium hover:opacity-95"
              />
              <label htmlFor="id-toko" className="text-sm mb-3 ml-3">
                ID Toko
              </label>
              <input
                type="text"
                id="id-toko"
                placeholder="ID Toko"
                onChange={(e) => setIdToko(e.target.value)}
                value={!isLoading ? idToko : ""}
                className="py-3 px-6 mb-6 rounded-3xl focus:outline-none font-medium hover:opacity-95"
              />
              <label htmlFor="alamat" className="text-sm mb-3 ml-3">
                Alamat
              </label>
              <textarea
                placeholder="Alamat"
                id="alamat"
                ref={alamatRef}
                onChange={(e) => setAlamat(e.target.value)}
                value={!isLoading ? alamat : ""}
                style={{ height: `${height}px` }}
                className="py-3 px-6 mb-6 rounded-3xl focus:outline-none overflow-auto font-medium hover:opacity-95 resize-none"
              />
              <button
                type="submit"
                className="p-3 mb-6 rounded-3xl bg-red-400 font-bold text-white hover:bg-red-500/90 transition-colors"
              >
                Ubah Profil
              </button>
            </form>
            <div
              onClick={deleteToko}
              className="text-red-400 px-3 py-1 rounded-xl font-bold hover:bg-red-100 hover:cursor-pointer"
            >
              Delete Toko
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
