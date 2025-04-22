"use client";
import React from "react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { deleteFile, uploadFile } from "@/lib/actions/upload.actions";
import { add, set } from "date-fns";
import { AppError } from "@/lib/utils";
import { toast } from "sonner";
import UploadingSpinner from "./UploadingSpinner";

interface UploadButtonProps {
  uploadFunction: (file: File) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const handleFileUpload = async (
  file: File,
  upload: (file: File) => Promise<void>
) => {
  try {
    await upload(file);

    toast.success("Files uploaded successfully!");
  } catch (error) {
    if (error instanceof AppError) {
      console.error("Backend error:", error.message);
      toast.error(`Error: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }
};

const FileUploadButton = ({
  disabled,
  loading,
  children,
  uploadFunction,
}: UploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setFile(file);
      await handleFileUpload(file, uploadFunction);
      setFile(undefined);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        max={5}
        accept="application/pdf,image/*"
        className="hidden"
      />
      <Button
        variant={"default"}
        onClick={handleButtonClick}
        disabled={disabled || loading}
      >
        <div className="flex items-center">
          <PlusIcon className="mr-2" />
          {children || "weitere Dokumente (max. 5)"}
        </div>
      </Button>
      {file && <UploadingSpinner fileName={file.name} />}
    </div>
  );
};

export default FileUploadButton;
