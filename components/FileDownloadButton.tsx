import React from "react";
import { Button } from "./ui/button";
import { DownloadIcon } from "lucide-react";
import { downloadFile, getPresignedUrl } from "@/lib/actions/upload.actions";
import { get } from "http";

interface DownloadButtonProps {
  fileName: string;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const DownloadButton = ({ fileName }: DownloadButtonProps) => {
  console.log("fileName", fileName);
  const handleDownload = async () => {
    try {
      const url = await getPresignedUrl(fileName);
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
      console.error("Download failed:", error);
    }
  };

  return (
    <Button variant={"ghost"} onClick={handleDownload}>
      <DownloadIcon size={20} className="shrink-0" />
    </Button>
  );
};

export default DownloadButton;
