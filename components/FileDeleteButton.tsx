import React from "react";
import { Button } from "./ui/button";
import { Delete, DeleteIcon } from "lucide-react";
import { deleteFile } from "@/lib/actions/upload.actions";

interface DeleteButtonProps {
  fileName: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}
const FileDeleteButton = ({ fileName }: DeleteButtonProps) => {
  const handleDelete = async () => {
    try {
      await deleteFile(fileName);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  return (
    <Button variant={"ghost"} onClick={handleDelete}>
      <DeleteIcon />
    </Button>
  );
};

export default FileDeleteButton;
