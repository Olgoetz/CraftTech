"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // shadcn UI Button
import { cn } from "@/lib/utils";

const Page = () => {
  const steps = [
    { title: "Step 1", description: "Learn about our product." },
    { title: "Step 2", description: "Understand the features." },
    { title: "Step 3", description: "Explore pricing options." },
    { title: "Step 4", description: "Sign up and get started!" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* Step Title and Description with Animation */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-pink-700">
          {steps[currentStep].title}
        </h2>
        <p className="mt-4 text-gray-600">{steps[currentStep].description}</p>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`${
            currentStep === 0 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Zurück
        </Button>
        <Button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`${
            currentStep === steps.length - 1
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          Vor
        </Button>
      </div>

      {/* Step Progress Indicator */}
      <div className="flex justify-center space-x-2">
        {steps.map((_, index) => (
          <div
            key={index}
            // initial={{ scale: 0.8 }}
            // animate={{
            //   scale: currentStep === index ? 1.2 : 1,
            //   backgroundColor: currentStep === index ? "#C026D3" : "#E5E7EB", // Pink for active, gray for inactive
            // }}
            // transition={{ type: "spring", stiffness: 300 }}
            className={cn(
              "w-4 h-4 rounded-full",
              currentStep === index ? "bg-pink-700" : "bg-gray-300"
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Page;
