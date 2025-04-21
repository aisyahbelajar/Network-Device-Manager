import { Network } from "lucide-react";
function NavbarHeader() {
  <>
    <div className="flex justify-between">
      <div className="flex items-center gap-4 mb-8">
        <Network size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          Network Device Manager
        </h1>
      </div>
      <div className="">
        <a href="/panduan-penggunaan">
          <button className="bg-green-600 border rounded-lg text-white text-base m-2 p-2">
            Panduan Penggunaan
          </button>
        </a>
      </div>
    </div>
  </>;
}

export default NavbarHeader;
