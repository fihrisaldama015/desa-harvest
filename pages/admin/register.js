import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const AdminRegister = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const body = {
        email,
        password,
      };
      const { data } = await axios.post(
        "http://malon.my.id:8888/api/admin/v1/data/admin",
        body
      );
      const result = await Swal.fire("Register Berhasil", "", "success");
      if (result.isConfirmed) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Oops...", error.response.data.message, "error");
    }
  };
  return (
    <div className="min-h-screen flex flex-row justify-center items-center bg-[#ffffff73]">
      <Head>
        <title>Admin Register</title>
      </Head>
      <div className="h-[70vh] md:h-[60vh] w-screen bg-mygreen absolute z-0 top-0"></div>
      <div className="w-screen h-[30vh] md:h-[40vh] bg-auto md:bg-cover bg-no-repeat bg-wave_pattern absolute z-0 top-[70vh] md:top-[60vh]"></div>
      <form
        onSubmit={(e) => handleRegister(e)}
        className="flex flex-col z-100 absolute w-full sm:w-96 p-12 text-slate-600"
      >
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mb-6 rounded-3xl text-center focus:outline-none font-medium hover:opacity-95"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 mb-6 rounded-3xl text-center focus:outline-none font-medium hover:opacity-95"
        />
        <hr className="w-100 mb-6 bg-slate-900/10 h-0.5 scale-x-110" />
        <button
          type="submit"
          className="p-3 mb-6 rounded-3xl bg-red-400 font-bold text-white hover:bg-red-500/90 transition-colors"
        >
          Daftar Admin
        </button>
        <p className="text-slate-600 text-center">
          Sudah Punya akun?{" "}
          <span>
            <Link
              href="/seller/signup"
              className="underline underline-offset-4 decoration-red-400 hover:text-red-400 transition-colors"
            >
              Login disini!
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
