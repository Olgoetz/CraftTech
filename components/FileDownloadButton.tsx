"use client";
import React from "react";
import { Button } from "./ui/button";
import { DownloadIcon } from "lucide-react";
import { downloadFile } from "@/lib/actions/upload.actions";
import { get } from "http";
import { toast } from "sonner";
import { AppError } from "@/lib/utils";

interface DownloadButtonProps {
  fileName: string;
  userId?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const DownloadButton = ({ fileName, userId }: DownloadButtonProps) => {
  const handleDownload = async () => {
    try {
      const url = await downloadFile(fileName, userId);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.open(url, "_blank");
      // const blob = await response.blob();

      // const blobUrl = URL.createObjectURL(blob);

      // const a = document.createElement("a");
      // a.href = blobUrl;
      // a.download = fileName;
      // document.body.appendChild(a);
      // a.click();
      // a.remove();
      // URL.revokeObjectURL(blobUrl);
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

  return (
    <Button variant={"ghost"} onClick={handleDownload}>
      <DownloadIcon size={20} className="shrink-0" />
    </Button>
  );
};

export default DownloadButton;
