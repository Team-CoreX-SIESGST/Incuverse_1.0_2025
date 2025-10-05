"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Search, Download } from "lucide-react";

export default function VerifyASHAWorkers() {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockWorkers = [
      {
        id: 1,
        name: "Priya Sharma",
        phone: "+91 9876543210",
        location: "Mumbai, Maharashtra",
        experience: "3 years",
        status: "pending",
        submittedDate: "2024-01-15",
        documents: ["ID Proof", "Certificate"],
      },
      {
        id: 2,
        name: "Anita Patel",
        phone: "+91 9876543211",
        location: "Delhi, NCR",
        experience: "5 years",
        status: "approved",
        submittedDate: "2024-01-10",
        documents: ["ID Proof", "Certificate", "Photo"],
      },
      {
        id: 3,
        name: "Sunita Reddy",
        phone: "+91 9876543212",
        location: "Bangalore, Karnataka",
        experience: "2 years",
        status: "rejected",
        submittedDate: "2024-01-12",
        documents: ["ID Proof"],
      },
      {
        id: 4,
        name: "Meena Kumar",
        phone: "+91 9876543213",
        location: "Chennai, Tamil Nadu",
        experience: "4 years",
        status: "pending",
        submittedDate: "2024-01-14",
        documents: ["ID Proof", "Certificate", "Photo", "Address Proof"],
      },
    ];
    setWorkers(mockWorkers);
  }, []);

  const handleApprove = (workerId) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === workerId ? { ...worker, status: "approved" } : worker
      )
    );
  };

  const handleReject = (workerId) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === workerId ? { ...worker, status: "rejected" } : worker
      )
    );
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || worker.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Verify ASHA Workers
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Review and approve ASHA worker registrations
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl ring-1 ring-slate-900/10 dark:ring-slate-100/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Worker
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Experience
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Documents
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredWorkers.map((worker) => (
                <tr
                  key={worker.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {worker.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {worker.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {worker.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {worker.experience}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {worker.documents.map((doc, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        worker.status
                      )}`}
                    >
                      {getStatusIcon(worker.status)}
                      {worker.status.charAt(0).toUpperCase() +
                        worker.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {worker.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(worker.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(worker.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
