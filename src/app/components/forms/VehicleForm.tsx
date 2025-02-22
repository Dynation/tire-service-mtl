import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { VehicleType } from "../../types/VehicleType";

interface VehicleFormProps {
  tireData: { name: string; description: string; price: number }[];
  onSubmit: (vehicle: {
    licensePlate: string;
    model: string;
    tireSize: string;
    vehicleType: VehicleType;
    wheelCount: number;
    flatRun: boolean;
    lowProfile: boolean;
    notes: string;
  }) => void; // Додаємо цей проп
  onCancel?: () => void;
  heading?: string;
  submitButtonLabel?: string;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  tireData,
  onCancel,
  heading = "Add New Vehicle",
  submitButtonLabel = "Save Vehicle",
}) => {
  const initialValues = {
    licensePlate: "",
    model: "",
    tireSize: "",
    vehicleType: VehicleType.SMALL_CAR,
    wheelCount: 4,
    flatRun: false,
    lowProfile: false,
  };

  const validationSchema = Yup.object({
    licensePlate: Yup.string()
      .matches(/^[A-Z0-9-]+$/, "Invalid license plate format")
      .required("License plate is required"),
    model: Yup.string().required("Model is required"),
    tireSize: Yup.string().required("Please select a tire size"),
    vehicleType: Yup.string().required("Please select a vehicle type"),
    wheelCount: Yup.number()
      .min(1, "Minimum 1 tires required")
      .max(8, "Maximum 8 tires allowed")
      .required("Please select the number of tires"),
  });

  const handleFormSubmit = async (values: typeof initialValues) => {
    console.log("Form values being submitted:", values); // Додаємо логування
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User is not authenticated");
      }
  
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add vehicle");
      }
  
      alert("Vehicle added successfully!");
      if (onCancel) onCancel(); // Закриваємо форму після успіху
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert((error as Error).message);
    }
  };
  



  return (
    <div className="vehicle-form bg-[var(--background)] text-[var(--foreground)] p-6 rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{heading}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* License Plate */}
            <div>
              <label
                htmlFor="licensePlate"
                className="block text-sm font-medium mb-2"
              >
                License Plate
              </label>
              <Field
                id="licensePlate"
                name="licensePlate"
                type="text"
                placeholder="Enter license plate"
                className="w-full border border-gray-300 p-2 rounded bg-[var(--button-background)] text-[var(--button-text)]"
              />
              <ErrorMessage
                name="licensePlate"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-2">
                Vehicle Model
              </label>
              <Field
                id="model"
                name="model"
                type="text"
                placeholder="Enter model"
                className="w-full border border-gray-300 p-2 rounded bg-[var(--button-background)] text-[var(--button-text)]"
              />
              <ErrorMessage
                name="model"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Tire Size */}
            <div>
              <label
                htmlFor="tireSize"
                className="block text-sm font-medium mb-2"
              >
                Tire Size
              </label>
              <Field
                as="select"
                id="tireSize"
                name="tireSize"
                className="w-full border border-gray-300 p-2 rounded bg-[var(--button-background)] text-[var(--button-text)]"
              >
                <option value="" disabled>
                  Select tire size
                </option>
                {tireData.map((tire) => (
                  <option key={tire.name} value={tire.name}>
                    {tire.name} - {tire.description}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="tireSize"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label
                htmlFor="vehicleType"
                className="block text-sm font-medium mb-2"
              >
                Vehicle Type
              </label>
              <Field
                as="select"
                id="vehicleType"
                name="vehicleType"
                className="w-full border border-gray-300 p-2 rounded bg-[var(--button-background)] text-[var(--button-text)]"
              >
                {Object.values(VehicleType).map((type) => (
                  <option key={type} value={type}>
                    {type === "TRUCK"
                      ? `${type} (includes premium SUVs)`
                      : type.replace("_", " ")}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="vehicleType"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Wheel Count */}
            <div>
              <label
                htmlFor="wheelCount"
                className="block text-sm font-medium mb-2"
              >
                Number of Tires
              </label>
              <Field
                as="select"
                id="wheelCount"
                name="wheelCount"
                className="w-full border border-gray-300 p-2 rounded bg-[var(--button-background)] text-[var(--button-text)]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="wheelCount"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Flat Run */}
            <div>
              <label className="inline-flex items-center space-x-2">
                <Field
                  type="checkbox"
                  name="flatRun"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <span>Flat Run</span>
              </label>
            </div>

            {/* Low Profile */}
            <div>
              <label className="inline-flex items-center space-x-2">
                <Field
                  type="checkbox"
                  name="lowProfile"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <span>Low Profile</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {submitButtonLabel}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VehicleForm;
