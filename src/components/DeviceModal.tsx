import React, { useState } from "react";
import { Device, Port, Vlan } from "../types";
import { X } from "lucide-react";

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

  const handleVlanChange = (
    index: number,
    field: keyof Vlan,
    value: string | number
  ) => {
    const newVlans = [...editedDevice.vlans];
    newVlans[index] = {
      ...newVlans[index],
      [field]: field === "id" ? Number(value) : value,
    };
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
            <h3 className="text-lg font-medium mb-2">Ports</h3>
            <div className="space-y-4">
              {editedDevice.ports.map((port, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-5 gap-4">
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Connected">Connected</option>
                        <option value="Not Connected">Not Connected</option>
                        <option value="Disable">Disable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Connected To
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
                        Device
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">VLANs</h3>
            <div className="space-y-4">
              {editedDevice.vlans.map((vlan, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        VLAN ID
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
                        VLAN Name
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
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ports
                      </label>
                      <input
                        type="text"
                        value={vlan.ports.join(", ")}
                        onChange={(e) =>
                          handleVlanChange(
                            index,
                            "ports",
                            e.target.value.split(",").map((p) => p.trim())
                          )
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  </div>
                </div>
              ))}
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
