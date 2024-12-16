// src/components/forms/VehicleForm.tsx
"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { VehicleType } from "../../types/VehicleType";

interface VehicleFormProps {
  tireData: { name: string; description: string; price: number }[];
  onSubmit: (values: {
    licensePlate: string;
    tireSize: string;
    model: string;
    wheelCount: number;
    vehicleType: VehicleType;
    flatRun: boolean;
    lowProfile: boolean;
    notes: string;
  }) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ tireData, onSubmit }) => {
  const initialValues = {
    licensePlate: "",
    model: "", // Додаємо model
    tireSize: "",
    vehicleType: VehicleType.SMALL_CAR,
    wheelCount: 4,
    flatRun: false,
    lowProfile: false,
    notes: "",
  };
  

  const validationSchema = Yup.object({
    licensePlate: Yup.string()
      .matches(/^[A-Z0-9-]+$/, "Invalid license plate format")
      .required("License plate is required"),
    model: Yup.string().required("Model is required"), // Валідація для model
    tireSize: Yup.string().required("Please select a tire size"),
    vehicleType: Yup.string().required("Please select a vehicle type"),
    wheelCount: Yup.number()
      .min(1, "Select at least 1 wheel")
      .max(6, "Maximum 6 wheels allowed")
      .required("Please select the number of wheels"),
    notes: Yup.string().max(255, "Notes must be 255 characters or less"),
  });
  

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting, resetForm }) => (
        <Form className="mt-4 bg-[#222] z-50 text-white rounded-lg p-6 shadow-lg transition-transform duration-200 ease">
          {/* License Plate Field */}
          <div className="mb-4">
            <label htmlFor="licensePlate" className="block text-lg font-bold mb-2">
              Your Vehicle License Plate
            </label>
            <Field
              id="licensePlate"
              name="licensePlate"
              type="text"
              className="w-full border border-gray-500 p-2 rounded bg-[#333] text-white placeholder-gray-400"
              placeholder="Enter license plate"
            />
            <ErrorMessage name="licensePlate" component="div" className="text-red-500 mt-1" />
          </div>

          {/* Model Field */}
          <div className="mb-4">
            <label htmlFor="model" className="block text-lg font-bold mb-2">
              Vehicle Model
            </label>
            <Field
              id="model"
              name="model"
              type="text"
              className="w-full border border-gray-500 p-2 rounded bg-[#333] text-white placeholder-gray-400"
              placeholder="Enter vehicle model"
            />
            <ErrorMessage name="model" component="div" className="text-red-500 mt-1" />
          </div>


          {/* Tire Size Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Select Wheel Size</h3>
            <ul className="space-y-2">
              {tireData.map((tire) => (
                <li key={tire.name}>
                  <label className="flex items-center space-x-3">
                    <Field type="radio" name="tireSize" value={tire.name} />
                    <span>{tire.name}</span>
                  </label>
                </li>
              ))}
            </ul>
            <ErrorMessage name="tireSize" component="div" className="text-red-500 mt-1" />
          </div>

          {/* Vehicle Type Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Select Vehicle Type</h3>
            <div className="space-y-2">
              {Object.values(VehicleType).map((type) => (
                <label key={type} className="flex items-center space-x-3">
                  <Field type="radio" name="vehicleType" value={type} />
                  <span>{type.replace("_", " ")}</span>
                </label>
              ))}
            </div>
            <ErrorMessage name="vehicleType" component="div" className="text-red-500 mt-1" />
          </div>

          {/* Wheel Count Selection */}
          <div className="mb-4">
            <label htmlFor="wheelCount" className="block text-lg font-bold mb-2">
              Number of Wheels
            </label>
            <Field
              as="select"
              id="wheelCount"
              name="wheelCount"
              className="w-full border border-gray-500 p-2 rounded bg-[#333] text-white"
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </Field>
            <ErrorMessage name="wheelCount" component="div" className="text-red-500 mt-1" />
          </div>

          {/* Flat Run Checkbox */}
          <div className="mb-4">
            <label className="flex items-center space-x-3">
              <Field type="checkbox" name="flatRun" />
              <span>Flat Run</span>
            </label>
          </div>

          {/* Low Profile Checkbox */}
          <div className="mb-4">
            <label className="flex items-center space-x-3">
              <Field type="checkbox" name="lowProfile" />
              <span>Low Profile</span>
            </label>
          </div>

          {/* Notes Field */}
          <div className="mb-4">
            <label htmlFor="notes" className="block text-lg font-bold mb-2">
              Additional Notes
            </label>
            <Field
              as="textarea"
              id="notes"
              name="notes"
              rows="4"
              className="w-full border border-gray-500 p-2 rounded bg-[#333] text-white placeholder-gray-400 resize-none"
              placeholder="Enter any additional notes..."
            />
            <ErrorMessage name="notes" component="div" className="text-red-500 mt-1" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="px-6 py-3 bg-green-500 text-white rounded flex-grow hover:bg-green-600 transition-transform transform hover:scale-105"
              onClick={() => resetForm()}
            >
              Save & Add Another
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded flex-grow hover:bg-blue-600 transition-transform transform hover:scale-105"
              disabled={isSubmitting}
            >
              Save & Go to Schedule Tire Mounting
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VehicleForm;
