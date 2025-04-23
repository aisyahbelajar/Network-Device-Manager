import { X } from "lucide-react";

interface PanduanPenggunaanProps {
  onClose: () => void;
}

export default function PanduanPenggunaan({ onClose }: PanduanPenggunaanProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Panduan Penggunaan
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Tutup"
          >
            <X size={24} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        <ol className="list-decimal list-inside space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
          <li>
            Anda dapat mencari koneksi apapun dengan mengetikkan kata kunci pada
            kolom pencarian.
          </li>
          <li>
            Pencarian dapat dilakukan berdasarkan nama, IP, Device, dan Vlan
            yang terhubung.
          </li>

          <li>
            Visualisasi port yang connected dapat dibedakan berdasarkan :
            <div className="pl-4">
              <p>
                <span className="font-semibold text-yellow-600">Kuning:</span>{" "}
                port terhubung ke device.
              </p>
              <p>
                <span className="font-semibold text-green-600">Hijau:</span>{" "}
                port terhubung ke VLAN.
              </p>
              <p>
                <span className="font-semibold text-red-600">Merah:</span> port
                terhubung ke lebih dari dua VLAN.
              </p>
            </div>
          </li>
          <li>
            Untuk mencari port yang terhubung ke dua VLAN atau lebih, cukup
            ketik tanda koma{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">","</code> pada
            pencarian.
          </li>
          <li>
            Untuk mencari switch yang memiliki VLAN tertentu, cukup masukkan
            nomor VLAN (contoh:{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">444</code>).
          </li>
          <li>
            Di bagian port pada detail switch, Anda dapat melakukan pencarian
            berdasarkan nama port, nama vlan, dan nama device. (contoh :{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">Gi 1/0/1</code>{" "}
            atau <code className="bg-gray-100 px-1 rounded text-sm">444</code>{" "}
            atau{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">
              Dikyasa-Jatim
            </code>
            )
          </li>
          <li>
            Di bagian VLAN pada detail switch, Anda dapat melakukan pencarian
            berdasarkan ID VLAN atau nama VLAN. (contoh :{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">222</code> atau{" "}
            <code className="bg-gray-100 px-1 rounded text-sm">
              tribrata_user
            </code>
            )
          </li>
        </ol>
      </div>
    </div>
  );
}
