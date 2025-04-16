"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { createPresignedPutURL } from "@/lib/s3";
import config from "@/lib/config";
import { logger } from "@/lib/utils";
import { uploadFile, upsertFile } from "@/lib/actions/upload.actions";
import { toast } from "sonner";
import { db } from "@/database/drizzle";

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

    //await waitor(2000);
    setUploadedFileUrl(file.name);

    // Upload to s3
    await uploadFile(file, fileType);
    setFiles([]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/pdf": [".pdf"],
    },
  });

  // function onSubmit(values: z.infer<typeof FormSchema>) {
  //   console.log(values);
  // }

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <Card>
        <CardHeader>
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

      {files.length > 0 && (
        <div className="fixed bottom-10 right-10 bg-slate-100 p-6 z-50 rounded-lg space-y-2">
          <h4 className="text-xl">Uploading</h4>
          <div className="flex items-center  gap-3">
            <LoaderIcon className="h-6 w-6 animate-spin" />
            <div>
              <p className="text-xs">{files[0].name}</p>
            </div>
            {/* <Button
              type="button"
              className="w-6 h-6 rounded-full bg-red-300 p-1"
              onClick={(e) => {
                if (controllerRef.current) {
                  controllerRef.current.abort();
                }

                e.stopPropagation();
              }}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </div>
      )}
    </div>
  );
}
