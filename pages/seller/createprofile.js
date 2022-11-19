import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import cookieCutter from "cookie-cutter";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import ShopPhotoCrop from "../../components/seller/ShopPhotoCrop";

const Createprofile = () => {
  const [file, setFile] = useState();
  const [namaToko, setNamaToko] = useState();
  const [idToko, setIdToko] = useState();
  const [alamat, setAlamat] = useState();
  const [height, setHeight] = useState(50);
  const [isCropping, setIsCropping] = useState(false);
  const router = useRouter();
  const alamatRef = useRef(null);

  useEffect(() => {
    (async () => {
      const toko_id = cookieCutter.get("toko_id");
      const token = cookieCutter.get("token") || null;
      if (toko_id !== "null" && toko_id !== undefined) {
        router.push("/seller/pending");
        return;
      }
      if (!token) {
        router.push("/seller/login");
        return;
      }
    })();
  });

  const uploadFile = (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      console.log("src => ", fileReader.result);
    };
    console.log("url => ", fileReader.readAsDataURL(file));
    setFile(file);
    setIsCropping(true);
  };

  const createProfile = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("name", namaToko);
      formdata.append("toko_id", idToko);
      formdata.append("alamat", alamat);
      const token = cookieCutter.get("token") || null;
      const { data } = await axios.post(
        "http://malon.my.id:8888/api/seller/v1/shop/createtoko",
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = await Swal.fire(
        "Berhasil",
        "Profil Toko telah dibuat",
        "success"
      );
      cookieCutter.set("toko_id", `${data.data.toko_id}`);
      if (result.isConfirmed) router.push("/seller/pending");
    } catch (error) {
      console.log(error);
      Swal.fire("Oops", error.response.data.message, "error");
    }
  };

  useEffect(() => {
    if (alamat) {
      const element = alamatRef.current;
      setHeight(element.scrollHeight);
    }
  }, [alamat]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-mygreen p-6">
      <Head>
        <title>Create Toko Profile</title>
      </Head>
      <h1 className="text-lg font-bold text-slate-700 drop-shadow-sm mb-6 mr-auto sm:mx-auto">
        Buat Profil Dagangmu
      </h1>
      {file && <ShopPhotoCrop image={URL.createObjectURL(file)} />}
      <Image
        src={`${file ? URL.createObjectURL(file) : `/default-profile.svg`}`}
        height={200}
        width={200}
        priority
        style={{ display: isCropping ? "none" : "" }}
        className="rounded-full"
        alt="profile"
      ></Image>
      <form
        onSubmit={(e) => createProfile(e)}
        className="flex flex-col w-full sm:w-96 p-12 text-slate-600"
      >
        {/* <input
          type="file"
          accept=".jpg, .png, .svg, .jfif, .webp"
          onChange={(e) => uploadFile(e.target.files[0])}
          className="p-3 mb-6 rounded-3xl focus:outline-none font-medium hover:opacity-95"
        /> */}
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
        <input
          type="text"
          placeholder="Nama Toko"
          onChange={(e) => setNamaToko(e.target.value)}
          className="py-3 px-6 mb-6 rounded-3xl focus:outline-none font-medium hover:opacity-95"
        />
        <input
          type="text"
          placeholder="ID Toko"
          onChange={(e) => setIdToko(e.target.value)}
          className="py-3 px-6 mb-6 rounded-3xl focus:outline-none font-medium hover:opacity-95"
        />
        <textarea
          placeholder="Alamat"
          ref={alamatRef}
          onChange={(e) => setAlamat(e.target.value)}
          style={{ height: `${height}px` }}
          className="py-3 px-6 mb-6 rounded-3xl focus:outline-none overflow-auto font-medium hover:opacity-95 resize-none"
        />
        <button
          type="submit"
          className="p-3 mb-6 rounded-3xl bg-red-400 font-bold text-white hover:bg-red-500/90 transition-colors"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default Createprofile;
