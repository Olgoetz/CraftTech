"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";
import { Card, CardHeader } from "./ui/card";

import { uploadAttestation } from "@/lib/actions/upload.actions";
import { toast } from "sonner";

import { MAX_FILE_SIZE } from "@/constants";
import UploadingSpinner from "./UploadingSpinner";

// import { useForm } from "react-hook-form";

// import { zodResolver } from "@hookform/resolvers/zod";

// interface FileUploaderProps {
//   onUploadComplete: (key: string, value: string) => void;
// }

// const FormSchema = z.object({
//   dob: z.date({
//     required_error: "A date of birth is required.",
//   }),
// });

interface FileUploaderProps {
  // setRemoteFileName: (fileUrl: string) => void;
  fileType: string;
}

export function FileUploader({ fileType }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>();
  const waitor = (ms: number) => new Promise((res) => setTimeout(res, ms));
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(acceptedFiles);

    const file = acceptedFiles[0];

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Datei zu groß. Maximal ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
    } else {
      setUploadedFileUrl(file.name);

      // Upload to s3
      await uploadAttestation(file, fileType);
    }

    setFiles([]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  });

  // function onSubmit(values: z.infer<typeof FormSchema>) {
  //   console.log(values);
  // }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <Card>
        <CardHeader className="">
          <Button variant={"secondary"}>Datei auswählen</Button>
        </CardHeader>
        {/* <CardContent>
          {uploadedFileUrl ? (
            <p className="text-sm">
              <span>{uploadedFileUrl}</span>
            </p>
          ) : (
            <p className="text-sm text-red-500">Keine Datei vorhanden</p>
          )}
        </CardContent> */}
      </Card>

      {files.length > 0 && <UploadingSpinner fileName={files[0].name} />}
    </div>
  );
}
