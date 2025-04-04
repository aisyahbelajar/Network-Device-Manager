import React, { useState } from "react";
import { Device, Port, Vlan, ConnectedDevice } from "../types";
import { X, Plus, Trash2 } from "lucide-react";

interface AddDeviceModalProps {
  onClose: () => void;
  onAdd: (device: Device) => Promise<boolean>;
}

export default function AddDeviceModal({
  onClose,
  onAdd,
}: AddDeviceModalProps) {
  const [device, setDevice] = useState<Device>({
    id: String(Date.now()),
    name: "",
    ip: "",
    ports: [],
    vlans: [],
  });
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const addPort = () => {
    const newPort: Port = {
      port: "",
      status: "connected",
      vlan: "",
      connected_to: {
        port: "",
        ip: "",
        device: "",
      },
    };
    setDevice({ ...device, ports: [...device.ports, newPort] });
  };

  const addVlan = () => {
    const newVlan: Vlan = {
      id: 1,
      name: "",
      status: "active",
      ports: [],
      ip: "",
    };
    setDevice({ ...device, vlans: [...device.vlans, newVlan] });
  };

  const updatePort = (
    index: number,
    field: keyof Port | `connected_to.${keyof ConnectedDevice}`,
    value: string
  ) => {
    setDevice((prevDevice) => {
      const updatedPorts = [...prevDevice.ports];

      if (field.startsWith("connected_to.")) {
        const subField = field.replace(
          "connected_to.",
          ""
        ) as keyof ConnectedDevice;

        updatedPorts[index] = {
          ...updatedPorts[index],
          connected_to: {
            ...updatedPorts[index].connected_to,
            [subField]: value,
          },
        };
      } else {
        // Update properti utama dalam Port
        updatedPorts[index] = { ...updatedPorts[index], [field]: value };
      }

      return { ...prevDevice, ports: updatedPorts };
    });
  };

  const updateVlan = (
    index: number,
    field: keyof Vlan,
    value: string | number | string[]
  ) => {
    const newVlans = [...device.vlans];
    newVlans[index] = {
      ...newVlans[index],
      [field]: field === "id" ? Number(value) : value,
    };
    setDevice({ ...device, vlans: newVlans });
  };

  const removePort = (index: number) => {
    const newPorts = device.ports.filter((_, i) => i !== index);
    setDevice({ ...device, ports: newPorts });
  };

  const removeVlan = (index: number) => {
    const newVlans = device.vlans.filter((_, i) => i !== index);
    setDevice({ ...device, vlans: newVlans });
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setError("");
      const success = await onAdd(device);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Device</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Name
              </label>
              <input
                type="text"
                value={device.name}
                onChange={(e) => setDevice({ ...device, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter device name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Address
              </label>
              <input
                type="text"
                value={device.ip}
                onChange={(e) => setDevice({ ...device, ip: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter IP address"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Ports</h3>
            </div>
            <div className="space-y-4">
              {device.ports.map((port, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Port {index + 1}</h4>
                    <button
                      onClick={() => removePort(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Port Number
                      </label>
                      <input
                        type="text"
                        value={port.port}
                        onChange={(e) =>
                          updatePort(index, "port", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={port.status}
                        onChange={(e) =>
                          updatePort(index, "status", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent 
                          ${
                            port.status === "connected"
                              ? "bg-green-100 text-green-800 border-green-500 focus:ring-green-500"
                              : port.status === "not connected"
                              ? "bg-red-100 text-red-800 border-red-500 focus:ring-red-500"
                              : "bg-gray-100 text-gray-800 border-gray-500 focus:ring-gray-500"
                          }
                        `}
                      >
                        <option value="connected">Connected</option>
                        <option value="not connected">Not Connected</option>
                        <option value="disable">Disable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        VLAN
                      </label>
                      <input
                        type="text"
                        value={port.vlan}
                        onChange={(e) =>
                          updatePort(index, "vlan", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Connected Device
                      </label>
                      <input
                        type="text"
                        value={port.connected_to.device}
                        onChange={(e) =>
                          updatePort(
                            index,
                            "connected_to.device",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Connected Port
                      </label>
                      <input
                        type="text"
                        value={port.connected_to.port}
                        onChange={(e) =>
                          updatePort(index, "connected_to.port", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Connected IP
                      </label>
                      <input
                        type="text"
                        value={port.connected_to.ip}
                        onChange={(e) =>
                          updatePort(index, "connected_to.ip", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end items-center mt-4">
              <button
                onClick={addPort}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Port
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">VLANs</h3>
            </div>
            <div className="space-y-4">
              {device.vlans.map((vlan, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">VLAN {index + 1}</h4>
                    <button
                      onClick={() => removeVlan(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        VLAN ID
                      </label>
                      <input
                        type="number"
                        value={vlan.id}
                        onChange={(e) =>
                          updateVlan(index, "id", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={vlan.name}
                        onChange={(e) =>
                          updateVlan(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={vlan.status}
                        onChange={(e) =>
                          updateVlan(index, "status", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${
                            vlan.status === "active"
                              ? "bg-blue-100 text-blue-800 border-blue-500 focus:ring-blue-500"
                              : vlan.status === "Act/Unsup"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-500 focus:ring-yellow-500"
                              : "bg-gray-100 text-gray-800 border-gray-500 focus:ring-gray-500"
                          }
                          
                          `}
                      >
                        <option value="active">Active</option>
                        <option value="Act/Unsup">Act/Unsup</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IP Address
                      </label>
                      <input
                        type="text"
                        value={vlan.ip}
                        onChange={(e) =>
                          updateVlan(index, "ip", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text aining text-gray-700 mb-1">
                      Ports (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={vlan.ports.join(", ")}
                      onChange={(e) =>
                        updateVlan(
                          index,
                          "ports",
                          e.target.value.split(",").map((p) => p.trim())
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1, 2, 3"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end items-center mt-4">
              <button
                onClick={addVlan}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={16} />
                Add VLAN
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? "Adding..." : "Add Device"}
          </button>
        </div>
      </div>
    </div>
  );
}
