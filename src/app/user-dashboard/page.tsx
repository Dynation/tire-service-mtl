"use client";

import React, { useEffect, useState, useCallback } from "react";
import useFetchUser from "../hooks/useFetchUser";
import GarageSection from "../components/GarageSection";
import AppointmentSection from "../components/AppointmentSection";
import NotAuthenticated from "../components/NotAuthenticated";
import { Vehicle } from "../types/Vehicle";
import { Appointment } from "../types/Appointment";

/**
 * UserDashboard Component
 * 
 * A dashboard interface for authenticated users that displays and manages their vehicles and appointments.
 * 
 * @component
 * @example
 * ```tsx
 * <UserDashboard />
 * ```
 * 
 * @remarks
 * The component handles:
 * - Fetching and displaying user's vehicles
 * - Managing vehicle deletion
 * - Managing vehicle addition
 * - Fetching user's appointments
 * - Authentication state checking
 * 
 * @state
 * - vehicles: Vehicle[] - List of user's vehicles
 * - appointments: Appointment[] - List of user's appointments
 * - loading: boolean - Loading state for initial data fetch
 * - deleteLoading: boolean - Loading state for vehicle deletion
 * 
 * @hooks
 * - useFetchUser - Custom hook for fetching user data
 * - useCallback - For memoizing fetch functions
 * - useEffect - For initial data loading
 * 
 * @returns
 * - Loading indicator when data is being fetched
 * - NotAuthenticated component when user is not authenticated
 * - Dashboard layout with GarageSection and AppointmentSection when authenticated
 */
const UserDashboard: React.FC = () => {
  const user = useFetchUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchVehicles = useCallback(async () => {
    if (!user?.uid) {
      return;
    }
    try {
      const response = await fetch("/api/vehicles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchAppointments = useCallback(async () => {
    if (!user?.uid) {
      return;
    }
    try {
      const response = await fetch(`/api/appointments?userId=${user.uid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [user?.uid]);

  const handleDeleteVehicle = async (licensePlate: string) => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/vehicles?licensePlate=${licensePlate}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }

      setVehicles((prev) => prev.filter((v) => v.licensePlate !== licensePlate));
      alert("Vehicle deleted successfully");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchVehicles();
      fetchAppointments();
    }
  }, [user, fetchVehicles, fetchAppointments]);

  if (loading || !user) {
    return loading ? <p>Loading...</p> : <NotAuthenticated />;
  }

  return (
    <div className="dashboard p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user.displayName || "User"}!
      </h1>
      <GarageSection/>
      <AppointmentSection
        userId={user.uid}
        vehicles={vehicles}
        refreshAppointments={fetchAppointments}
      />
    </div>
  );
};



export default UserDashboard;
