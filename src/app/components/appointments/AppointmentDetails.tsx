import React from "react";

interface AppointmentDetailsProps {
  licensePlate: string;
  model: string;
  vehicleType: string;
  tireSize: string;
  wheelCount: number;
  flatRun: boolean;
  lowProfile: boolean;
  notes: string | null;
  dateTime: string;
  onConfirm: () => void;
  onReappoint: () => void;
  onAddAppointment: () => void;
  isSubmitting: boolean;
  isConfirmed: boolean;
  successMessage: string | null;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  licensePlate,
  model,
  vehicleType,
  tireSize,
  wheelCount,
  flatRun,
  lowProfile,
  notes,
  dateTime,
  onConfirm,
  onReappoint,
  onAddAppointment,
  isSubmitting,
  isConfirmed,
  successMessage,
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Check Your Appointment Details</h2>
      <div className="bg-[var(--button-background)] text-[var(--button-text)] p-4 rounded shadow-lg mb-4">
        <ul className="space-y-2">
          <li><strong>License Plate:</strong> {licensePlate}</li>
          <li><strong>Model:</strong> {model}</li>
          <li><strong>Vehicle Type:</strong> {vehicleType}</li>
          <li><strong>Tire Size:</strong> {tireSize}</li>
          <li><strong>Wheel Count:</strong> {wheelCount}</li>
          <li><strong>Flat Run:</strong> {flatRun ? "Yes" : "No"}</li>
          <li><strong>Low Profile:</strong> {lowProfile ? "Yes" : "No"}</li>
          <li><strong>Notes:</strong> {notes}</li>
          <li><strong>Date:</strong> {new Date(dateTime).toLocaleDateString()}</li>
          <li><strong>Time:</strong> {new Date(dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</li>
        </ul>
      </div>

      {!isConfirmed ? (
        <>
          <p className="mb-4">Please review your details and confirm before adding the appointment.</p>
          <button onClick={onConfirm} className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Confirm Details
          </button>
        </>
      ) : (
        <button
          onClick={onAddAppointment}
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isSubmitting ? "Submitting..." : "Add Appointment"}
        </button>
      )}

      <button onClick={onReappoint} className="ml-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
        Reappoint
      </button>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded shadow">
          {successMessage}
        </div>
      )}
    </>
  );
};

export default AppointmentDetails;
