import { LoaderIcon } from "lucide-react";
import React from "react";

const UploadingSpinner = ({ fileName }: { fileName: string }) => {
  return (
    <div className="fixed bottom-10 right-10 bg-white shadow-lg p-6 z-50 rounded-lg space-y-4 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800">Uploading...</h4>
      <div className="flex items-center gap-4">
        <LoaderIcon className="h-8 w-8 text-blue-500 animate-spin" />
        <div>
          <p className="text-sm text-gray-600 truncate max-w-xs">{fileName}</p>
        </div>
      </div>
    </div>
  );
};

export default UploadingSpinner;
