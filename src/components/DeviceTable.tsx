import React, { useState } from "react";
import { Device, SortField, SortOrder } from "../types";
import {
  Search,
  Plus,
  ArrowUpDown,
  Trash2,
  Edit,
  Stethoscope,
} from "lucide-react";
import DeviceModal from "./DeviceModal";
import AddDeviceModal from "./AddDeviceModal";

interface DeviceTableProps {
  devices: Device[];
  onAdd: () => void;
  onEdit: (device: Device) => void;
  onDelete: (id: string) => void;
}

export default function DeviceTable({
  devices,
  onAdd,
  onEdit,
  onDelete,
}: DeviceTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredDevices = devices
    .filter((device) => {
      const searchLower = search.toLowerCase();

      const matchesConnectedDevice = device.ports.some((port) =>
        port.connected_to?.device?.toLowerCase().includes(searchLower)
      );

      const matchesSearch =
        device.name.toLowerCase().includes(searchLower) ||
        device.ip.toLowerCase().includes(searchLower) ||
        matchesConnectedDevice ||
        device.vlans.some((vlan) => vlan.id === Number(searchLower));

      return matchesSearch;
    })
    .sort((a, b) => {
      const compareValue = sortOrder === "asc" ? 1 : -1;
      return a[sortField] > b[sortField] ? compareValue : -compareValue;
    });

  const paginatedDevices = filteredDevices.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

  const handleAddDevice = (newDevice: Device) => {
    onAdd(newDevice);
    setShowAddModal(false);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search devices..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Device
        </button>
      </div>

      {showAddModal && (
        <AddDeviceModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDevice}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  Name
                  <ArrowUpDown size={16} />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("ip")}
              >
                <div className="flex items-center gap-2">
                  IP Address
                  <ArrowUpDown size={16} />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ports
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VLANs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedDevices.map((device) => (
              <tr
                key={device.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedDevice(device)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{device.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{device.ip}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {device.ports.map((port) => (
                      <div key={port._id} className="flex flex-col gap-1">
                        {port.connected_to &&
                          typeof port.connected_to === "object" && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              {port.connected_to.device} {port.connected_to.ip}
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {device.vlans.map((vlan) => (
                      <span
                        key={vlan.id}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {vlan.id}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDevice(device);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(device._id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {(page - 1) * itemsPerPage + 1} to{" "}
          {Math.min(page * itemsPerPage, filteredDevices.length)} of{" "}
          {filteredDevices.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedDevice && (
        <DeviceModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onSave={(updatedDevice) => {
            onEdit(updatedDevice);
            setSelectedDevice(null);
          }}
        />
      )}
    </div>
  );
}
