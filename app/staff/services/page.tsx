"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StaffLayout } from "@/components/staff/layout/StaffLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getDentalServices,
  createDentalService,
  updateDentalService,
} from "@/lib/data/data-service";
import { DentalService, ServiceCategory } from "@/types/portal";
import {
  Stethoscope,
  Plus,
  Search,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Edit,
  ShieldAlert,
} from "lucide-react";

export default function StaffServicesPage() {
  const { currentUser, checkPermission } = useAuth();

  const [services, setServices] = useState<DentalService[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Periodontics");
  const [description, setDescription] = useState("");
  const [standardFee, setStandardFee] = useState<number>(1000);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await getDentalServices();
      setServices(data);
    } catch (e) {
      console.error("Error loading services:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories: ServiceCategory[] = [
    "Periodontics",
    "Implantology",
    "General Dentistry",
    "Endodontics",
    "Prosthodontics",
    "Oral Surgery",
    "Laser Dentistry",
  ];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (selectedCategory !== "all" && srv.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          srv.name.toLowerCase().includes(q) ||
          srv.code.toLowerCase().includes(q) ||
          srv.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [services, selectedCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingServiceId(null);
    setCode("");
    setName("");
    setCategory("Periodontics");
    setDescription("");
    setStandardFee(1500);
    setDurationMinutes(45);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (srv: DentalService) => {
    setEditingServiceId(srv.id);
    setCode(srv.code);
    setName(srv.name);
    setCategory(srv.category);
    setDescription(srv.description);
    setStandardFee(srv.standardFee);
    setDurationMinutes(srv.durationMinutes);
    setIsActive(srv.isActive);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (srv: DentalService) => {
    if (!currentUser) return;
    await updateDentalService(
      srv.id,
      { isActive: !srv.isActive },
      {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        role: currentUser.role,
      }
    );
    await loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);

    try {
      if (editingServiceId) {
        await updateDentalService(
          editingServiceId,
          {
            code: code.trim().toUpperCase(),
            name: name.trim(),
            category,
            description: description.trim(),
            standardFee: Number(standardFee),
            durationMinutes: Number(durationMinutes),
            isActive,
          },
          {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            role: currentUser.role,
          }
        );
      } else {
        await createDentalService(
          {
            code: code.trim().toUpperCase(),
            name: name.trim(),
            category,
            description: description.trim(),
            standardFee: Number(standardFee),
            durationMinutes: Number(durationMinutes),
            isActive,
          },
          {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            role: currentUser.role,
          }
        );
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Save service error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const canManage = checkPermission("services:manage");

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <StaffLayout requiredPermissions={["services:view"]}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dental Treatment Catalogue &amp; Fee Schedule
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Standard clinical procedure catalogue, standardized pricing, and operatory chair time allocations.
            </p>
          </div>

          {canManage ? (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Procedure / Service</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 italic">
              Catalogue changes restricted to Administrator
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-sky-600 text-white font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                All Categories ({services.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-sky-600 text-white font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search procedures, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Loading service catalogue...</div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">No procedures found.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {srv.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {srv.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                        {srv.category}
                      </span>
                      {!srv.isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600">
                          INACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {srv.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Allocated Chair Time: {srv.durationMinutes} minutes
                      </span>
                    </div>
                  </div>

                  {/* Standard Fee & Actions */}
                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Standard Fee</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        {formatINR(srv.standardFee)}
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(srv)}
                          className="p-2 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Procedure"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(srv)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                            srv.isActive
                              ? "text-red-600 border-red-200 hover:bg-red-50"
                              : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          {srv.isActive ? "Disable" : "Enable"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Add or Edit Procedure */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingServiceId ? "Edit Procedure Details" : "Add Dental Procedure to Catalogue"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Dr. R. Suresh Dental Clinic &bull; R.A. Puram, Chennai
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Procedure Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. PERIO-FLAP"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Procedure Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Periodontal Flap Surgery with Bone Grafting"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Standard Fee (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={standardFee}
                      onChange={(e) => setStandardFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Duration (Minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min={15}
                      step={15}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Clinical Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Clinical overview of therapy, instruments, and materials used..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="service-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <label htmlFor="service-active" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Procedure is active and available for booking
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {submitting ? "Saving..." : editingServiceId ? "Save Changes" : "Add to Catalogue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

