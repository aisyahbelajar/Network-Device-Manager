import React, { useState, useEffect } from "react";
import { Device } from "./types";
import DeviceTable from "./components/DeviceTable";
import DeviceModal from "./components/DeviceModal";
import { Network } from "lucide-react";

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/switches")
      .then((response) => response.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error("Error fetching devices:", error));
  }, []);

  const handleOpenEditModal = (device: Device) => {
    setSelectedDevice(device);
  };

  const handleAdd = async () => {
    const newDevice: Device = {
      id: String(Date.now()),
      name: "New Device",
      ip: "",
      ports: [],
      vlans: [],
    };
    try {
      const response = await fetch("http://localhost:5000/api/switches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDevice),
      });
      if (response.ok) {
        const createdDevice = await response.json();
        setDevices([...devices, createdDevice]);
      }
    } catch (error) {
      console.error("Error adding device:", error);
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

      if (response.ok) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device._id === updatedDevice._id ? updatedDevice : device
          )
        );
      }
    } catch (error) {
      console.error("Error updating device:", error);
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
        if (response.ok) {
          setDevices(devices.filter((device) => device._id !== id));
        }
      } catch (error) {
        console.error("Error deleting device:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Network size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Network Device Manager
          </h1>
        </div>

        {selectedDevice && (
          <DeviceModal
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
            onSave={async (updatedDevice) => {
              await handleEdit(updatedDevice);
              setSelectedDevice(null);
            }}
          />
        )}

        <DeviceTable
          devices={devices}
          onAdd={handleAdd}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
