import React, { useEffect, useState } from "react";
import { Device } from "./types";
import DeviceTable from "./components/DeviceTable";
import { Network } from "lucide-react";
import PanduanPenggunaan from "./templates/PanduanPenggunaan";

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string>("");
  const [showPanduan, setShowPanduan] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/switches").then((response) =>
      response
        .json()
        .then((data) => setDevices(data))
        .catch((error) => console.error("error fetching devices:", error))
    );
  }, []);

  const handleAdd = async (newDevice: Device) => {
    try {
      const response = await fetch("http://localhost:5000/api/switches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDevice),
      });

      if (!response.ok) {
        throw new Error("Failed to add device");
      }

      const addedDevice = await response.json();
      setDevices((prevDevices) => [...prevDevices, addedDevice]);
      setError("");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device");
      return false;
    }
  };

  const handleEdit = async (updatedDevice: Device) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/switches/${updatedDevice._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedDevice),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update device");
      }

      const updated = await response.json();
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device._id === updated._id ? updated : device
        )
      );
      setError("");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update device");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/switches/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete device");
        }

        setDevices((prevDevices) =>
          prevDevices.filter((device) => device._id !== id)
        );
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete device"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between mb-8">
          <div className="flex items-center gap-4">
            <Network size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Network Device Manager
            </h1>
          </div>
          <button
            onClick={() => setShowPanduan(true)}
            className="px-4 py-1 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            Panduan Penggunaan
          </button>
        </div>

        {showPanduan && (
          <PanduanPenggunaan onClose={() => setShowPanduan(false)} />
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <DeviceTable
          devices={devices}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
