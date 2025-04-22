"use client";
import React from "react";
import { Button } from "./ui/button";
import { DeleteIcon } from "lucide-react";
import { deleteFileFromProfile } from "@/lib/actions/upload.actions";
import { toast } from "sonner";
import { AppError } from "@/lib/utils";

interface DeleteButtonProps {
  fileId: string;
  fileName: string;
  table: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}
const FileDeleteButton = ({ fileId, fileName, table }: DeleteButtonProps) => {
  const handleDelete = async () => {
    try {
      await deleteFileFromProfile(fileId, fileName, table);
      toast.success("File deleted successfully!");
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
    <Button variant={"ghost"} onClick={handleDelete}>
      <DeleteIcon />
    </Button>
  );
};

export default FileDeleteButton;
