"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Eye, QrCode, Users } from "lucide-react";
import {
  getPatients,
  getPatient,
  deletePatient,
  updatePatient,
  createPatient,
} from "@/services/patients/patientsServices";

export function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const payload = {};
      const response = await getPatients(payload);
      const result = response.data;

      if (result) {
        setPatients(result.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.aadhar?.includes(searchTerm) ||
      patient.phone?.includes(searchTerm);

    const matchesGender = !filterGender || patient.gender === filterGender;

    return matchesSearch && matchesGender;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-100/10 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Patients List
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage and view all registered patients
                </p>
              </div>
            </div>
            <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full">
              Total: {filteredPatients.length} patients
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, Aadhar, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg transition-all duration-200"
              />
            </div>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg transition-all duration-200"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-lg">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Aadhar
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/30 dark:bg-slate-900/30 divide-y divide-slate-200 dark:divide-slate-700 backdrop-blur-lg">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {patient.profileImage ? (
                          <img
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                            src={patient.profileImage}
                            alt={patient.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center ring-2 ring-white dark:ring-slate-800 shadow-md">
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                              {patient.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {patient.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Age: {patient.age}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {patient.phone}
                    </div>
                    {patient.emergencyContact && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Emergency: {patient.emergencyContact}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                    {patient.aadhar}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        patient.gender === "male"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : patient.gender === "female"
                          ? "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {patient.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 dark:text-white max-w-xs truncate">
                      {patient.issue}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          console.log("View patient:", patient._id)
                        }
                        className="p-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {patient.qrCode && (
                        <button
                          onClick={() => window.open(patient.qrCode, "_blank")}
                          className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                          title="View QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-500 dark:text-slate-400 text-lg">
                No patients found matching your criteria.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
