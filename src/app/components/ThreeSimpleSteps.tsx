// src/components/ThreeSimpleSteps.tsx
"use client";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const steps = [
  {
    title: "Log In",
    description: "Log in to your account to get started.",
  },
  {
    title: "Enter Details",
    description: "Provide your vehicle details and select the tire size.",
  },
  {
    title: "Book Service",
    description: "Book your tire mounting and balancing service.",
  },
];

const ThreeSimpleSteps: React.FC = () => {
  return (
    <section className="p-10 text-center">
      <h2 className="text-3xl font-bold mb-10 text-white">
        Three Simple Steps to Book Your Tire Service
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-[#222]/40 backdrop-blur-lg border border-gray-700 text-white rounded-lg p-6 shadow-xl max-w-xs"
          >
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="text-gray-300">{step.description}</p>
            {index < steps.length - 1 && (
              <FaArrowRight className="hidden md:block absolute top-1/2 right-[-40px] text-4xl text-gray-500" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThreeSimpleSteps;


