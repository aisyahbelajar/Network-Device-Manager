import React, { useState } from "react";
import { Device, Port, Vlan } from "../types";
import { X, Plus, Trash2 } from "lucide-react";

interface DeviceModalProps {
  device: Device;
  onClose: () => void;
  onSave: (device: Device) => Promise<boolean>;
}

export default function DeviceModal({
  device,
  onClose,
  onSave,
}: DeviceModalProps) {
  const [editedDevice, setEditedDevice] = useState<Device>({ ...device });
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [searchPortDevice, setSearchPortDevice] = useState("");
  const [searchVlanId, setSearchVlanId] = useState("");

  const handlePortChange = (
    index: number,
    field:
      | keyof Port
      | "connected_to.device"
      | "connected_to.ip"
      | "connected_to.port",
    value: string
  ) => {
    const newPorts = [...editedDevice.ports];

    if (!newPorts[index].connected_to) {
      newPorts[index].connected_to = { device: "", ip: "", port: "" };
    }

    if (field.startsWith("connected_to.")) {
      const subField = field.split(".")[1];
      newPorts[index] = {
        ...newPorts[index],
        connected_to: {
          ...newPorts[index].connected_to,
          [subField]: value,
        },
      };
    } else {
      newPorts[index] = {
        ...newPorts[index],
        [field]: value,
      };
    }

    setEditedDevice({ ...editedDevice, ports: newPorts });
  };

  const addPort = () => {
    setEditedDevice({
      ...editedDevice,
      ports: [
        ...editedDevice.ports,
        {
          port: "",
          status: "connected",
          vlan: "",
          connected_to: {
            device: " ",
            ip: "",
            port: "",
          },
        },
      ],
    });
  };

  const removePort = (index: number) => {
    const newPorts = [...editedDevice.ports];
    newPorts.splice(index, 1);
    setEditedDevice({ ...editedDevice, ports: newPorts });
  };

  const handleVlanChange = (
    index: number,
    field: keyof Vlan,
    value: string | number
  ) => {
    const newVlans = [...editedDevice.vlans];

    if (!newVlans[index]) return;
    newVlans[index] = {
      ...newVlans[index],
      [field]: field === "id" ? Number(value) : value,
    };
    setEditedDevice({ ...editedDevice, vlans: newVlans });
  };

  const addVlan = () => {
    setEditedDevice({
      ...editedDevice,
      vlans: [
        ...editedDevice.vlans,
        {
          id: 1,
          name: "",
          status: "active",
          ports: [],
          ip: "",
        },
      ],
    });
  };

  const removeVlans = (index: number) => {
    const newVlans = [...editedDevice.vlans];
    newVlans.splice(index, 1);
    setEditedDevice({ ...editedDevice, vlans: newVlans });
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setError("");
      const success = await onSave(editedDevice);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Device</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-500 hover:text-white rounded-full bg-white"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Name
            </label>
            <input
              type="text"
              value={editedDevice.name}
              onChange={(e) =>
                setEditedDevice({ ...editedDevice, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IP Address
            </label>
            <input
              type="text"
              value={editedDevice.ip}
              onChange={(e) =>
                setEditedDevice({ ...editedDevice, ip: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Ports</h3>
              <input
                type="text"
                placeholder="Search by device name..."
                value={searchPortDevice}
                onChange={(e) => setSearchPortDevice(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <div className="space-y-4">
              {editedDevice.ports
                .filter((port) =>
                  port.connected_to?.device
                    ?.toLowerCase()
                    .includes(searchPortDevice.toLowerCase())
                )
                .map((port, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="lg:flex gap-4 grid grid-cols-2 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Port Number
                        </label>
                        <input
                          type="text"
                          value={port.port}
                          onChange={(e) =>
                            handlePortChange(index, "port", e.target.value)
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
                            handlePortChange(index, "status", e.target.value)
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
                          Vlan
                        </label>
                        <input
                          type="text"
                          value={port.vlan || ""}
                          onChange={(e) =>
                            handlePortChange(index, "vlan", e.target.value)
                          }
                          placeholder="Null"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Connected To Port
                        </label>
                        <input
                          type="text"
                          value={port.connected_to?.port || ""}
                          onChange={(e) =>
                            handlePortChange(
                              index,
                              "connected_to.port",
                              e.target.value
                            )
                          }
                          placeholder="Null"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IP
                        </label>
                        <input
                          type="text"
                          value={port.connected_to?.ip || ""}
                          onChange={(e) =>
                            handlePortChange(
                              index,
                              "connected_to.ip",
                              e.target.value
                            )
                          }
                          placeholder="Null"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Device Name
                        </label>
                        <input
                          type="text"
                          value={port.connected_to?.device || ""}
                          onChange={(e) =>
                            handlePortChange(
                              index,
                              "connected_to.device",
                              e.target.value
                            )
                          }
                          placeholder="Null"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aksi
                        </label>
                        <button
                          onClick={() => removePort(index)}
                          className="text-red-600 hover:text-red-700 px-3 py-2"
                        >
                          <Trash2 size={16} />
                        </button>
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
              <h3 className="text-lg font-medium">Vlans</h3>
              <input
                type="text"
                placeholder="Search by VLAN ID"
                value={searchVlanId}
                onChange={(e) => setSearchVlanId(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />
            </div>
            <div className="space-y-4">
              {editedDevice.vlans
                .filter((vlan) =>
                  vlan.id.toString().includes(searchVlanId.trim())
                )
                .map((vlan, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="lg:flex gap-4 grid grid-cols-2 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID
                        </label>
                        <input
                          type="number"
                          value={vlan.id}
                          onChange={(e) =>
                            handleVlanChange(index, "id", e.target.value)
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
                            handleVlanChange(index, "name", e.target.value)
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
                            handleVlanChange(index, "status", e.target.value)
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
                          Ports
                        </label>
                        <textarea
                          value={
                            Array.isArray(vlan.ports)
                              ? vlan.ports.join(", ")
                              : ""
                          }
                          onChange={(e) =>
                            handleVlanChange(
                              index,
                              "ports",
                              e.target.value.split(",").map((p) => p.trim())
                            )
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IP
                        </label>
                        <input
                          type="text"
                          value={vlan.ip}
                          onChange={(e) =>
                            handleVlanChange(index, "ip", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Aksi
                        </label>
                        <button
                          onClick={() => removeVlans(index)}
                          className="text-red-600 hover:text-red-700 px-3 py-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
                Add Vlan
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
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
