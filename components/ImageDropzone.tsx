import { Loader, UploadCloudIcon, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { deleteObject, getDownloadURL, uploadBytes } from "firebase/storage";
import { storageRef } from "@/lib/firebase";

type UploadInterface = {
  file: File | null;
  downloadUrl: string;
  fileName: string;
  state: "pending" | "success" | "error";
};

interface InputProps {
  onFilesAdded?: (files: string[]) => Promise<void>;
  onFileDelete?: (url: string) => void;
  photos?: string[];
}

function ImageDropzone({ onFilesAdded, onFileDelete, photos }: InputProps) {
  const [imageStates, setImageStates] = useState<UploadInterface[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);

    const promises: Promise<UploadInterface>[] = [];
    try {
      const newFiles = acceptedFiles.map<UploadInterface>((file) => ({
        file,
        downloadUrl: "",
        fileName: `${Math.random()
          .toString(36)
          .slice(2, 10)}_${Date.now()}.${file.name.split(".").pop()}`,
        state: "pending",
      }));

      setImageStates((prevStates) => [...prevStates, ...newFiles]);

      newFiles.map(async (file) => {
        promises.push(
          new Promise(async (resolve) => {
            const fileRef = storageRef(file.fileName);

            await uploadBytes(fileRef, file.file as File);

            const downloadUrl = await getDownloadURL(fileRef);

            resolve({
              file: file.file,
              fileName: file.fileName,
              state: file.state,
              downloadUrl: downloadUrl,
            });
          })
        );
      });
      // wait for promises
      const result = await Promise.all(promises);
      const urls: string[] = [];

      result.map((f) => {
        urls.push(f.downloadUrl);
        setImageStates((imageStates) => {
          const newState = structuredClone(imageStates);
          const imageState = newState.find(
            (image) => image.fileName === f.fileName
          );

          if (imageState) {
            imageState.downloadUrl = f.downloadUrl;
            imageState.state = "success";
          }

          return newState;
        });
      });

      await onFilesAdded?.(urls);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setUploading(false);
    }
  }, []);

  useEffect(() => {
    if (photos && photos?.length > 0) {
      const photo: UploadInterface[] = [];
      photos?.map((p) => {
        photo.push({
          file: null,
          downloadUrl: p,
          state: "success",
          fileName: "",
        });
      });
    }
  }, [photos]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const handleDelete = async (url: string) => {
    const ref = storageRef(url);
    await deleteObject(ref);
    //update local state
    const newState = imageStates.filter((state) => state.downloadUrl !== url);
    setImageStates(newState);

    onFileDelete?.(url);
  };

  return (
    <>
      <div className="grid gap-2 grid-cols[repeat(1,1fr) grid-cols-[repeat(3,1fr)]">
        <div
          {...getRootProps()}
          className="text-center p-2 cursor-pointer border-2 border-dashed rounded-md border-accent-foreground"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-xs text-accent-foreground">
            <UploadCloudIcon className="mt-4 w-8 h-8" />
            <div>Drag &amp; Drop Images to Upload</div>
            <div className="p-2">
              <Button disabled={uploading} type="button" variant="ghost">
                Select
              </Button>
            </div>
          </div>
        </div>
        {imageStates.map((image, index) => (
          <div
            key={index}
            className="border-0 p-0 w-full relative shadow-md rounded aspect-square h-full"
          >
            {image.state === "success" ? (
              <Image
                fill
                src={image.downloadUrl}
                alt={`photo ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
            {/*When image is loading*/}
            {uploading && image.state === "pending" && (
              <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-md bg-opacity-50">
                <Loader />
              </div>
            )}
            {/*Delete button*/}
            <div
              className="group absolute right-0 top-0"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(image.downloadUrl);
              }}
            >
              <div className="flex h-4 w-4 -translate-x-2 translate-y-2 cursor-pointer items-center justify-center">
                <X width={16} height={16} className="bg-red-500 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/*Error*/}
      {error && <p className="text-red-500 fond-bold">{error}</p>}
    </>
  );
}

export default ImageDropzone;
