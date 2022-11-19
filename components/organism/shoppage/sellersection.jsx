import React from "react";
import Image from "next/image";
import shopbag from "../../../assets/svg/shopbag.svg";
import Shopbagcircle from "../../atom/shopbagcircle";
import SettingCircle from "../../atom/settingcircle";
import settinglogo from "../../../assets/svg/settinglogo.svg";
import Notifcircle from "../../atom/notifcircle";
import Link from "next/link";

export default function Sellersection() {
  return (
    <div className="">
      <p className="text-[#7B7B7B]">Anda Ingin Menjual?</p>
      <div className="mt-2">
        <div className=" flex justify-between">
          <button className=" w-24 h-7 bg-[#618D80] rounded-3xl ">
            <Link href="/seller">
              <p className="text-xs text-white font-bold">Klik disini</p>
            </Link>
          </button>
          <div className=" flex gap-2">
            <Shopbagcircle colorStroke="#618D80" />
            <Notifcircle colorStroke="#618D80" />
            {/* <SettingCircle colorStroke="#618D80" /> */}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
