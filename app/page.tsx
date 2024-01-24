"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { openai } from "@/services/ai";
import { faker } from "@faker-js/faker/locale/pt_BR";
import {
  DiscordLogoIcon,
  DownloadIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { createReadStream } from "fs";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingByUpload, setLoadingByUpload] = useState(false);
  const [generateByUpload, setGenerateByUpload] = useState("");
  const [generateByPrompt, setGenerateByPrompt] = useState("");
  const [loadingByPrompt, setLoadingByPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const fileNameRef = useRef<string>("");
  const { toast } = useToast();

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateByPromptFn = async () => {
    setGenerateByPrompt("");
    try {
      setLoadingByPrompt(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const res = await response.json();

      const image_url = res.url;
      setGenerateByPrompt(image_url);
    } catch (error) {
      toast({
        title: "Your error response",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error, null, 2)}</code>
          </pre>
        ),
      });
    } finally {
      setLoadingByPrompt(false);
    }
  };

  const generateByUploadFn = async () => {
    try {
      setLoadingByUpload(true);
      fileNameRef.current = faker.string.uuid();

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: selectedFile,
          fileName: fileNameRef.current,
        }),
      });

      const res = await response.json();

      console.log("CLIENTE res", res);

      const image_url = res.url;
      setGenerateByUpload(image_url);
    } catch (error) {
      toast({
        title: "Your error response",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error)}</code>
          </pre>
        ),
      });
    } finally {
      setLoadingByUpload(false);
    }
  };

  const onDownloadImageByPrompt = async () => {
    await fetch(`http://localhost:3000/api/download`, {
      method: "POST",
      body: JSON.stringify({
        fileUrl: generateByPrompt,
      }),
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <header className="text-3xl text-accent-foreground">
        Generate discord icons
      </header>
      <span>
        <DiscordLogoIcon className="h-8 w-8 my-4" />
      </span>
      <div className="flex flex-row">
        <div className="p-12 flex flex-col justify-center items-center">
          <Label htmlFor="picture">
            Upload image to generate discord variant
          </Label>
          <Input
            id="picture"
            className="mt-2"
            type="file"
            onChange={handleFileChange}
            accept="image/png"
          />
          <Button
            variant="default"
            className="mt-4"
            onClick={generateByUploadFn}
            disabled={loadingByUpload || selectedFile === null}
          >
            {loadingByUpload && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loadingByUpload ? "Generating" : "Generate"} by upload
          </Button>
          <div className="flex flex-row gap-4 mt-8">
            {selectedFile && (
              <Image
                src={selectedFile}
                alt="Preview"
                width={250}
                height={250}
              />
            )}
            {generateByUpload && (
              <Image
                src={generateByUpload}
                alt="Preview"
                width={250}
                height={250}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center items-center flex-col p-12">
          <Label htmlFor="prompt">Generate by prompt (anime version)</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="a cute cat"
            className="mt-2"
          />
          <Button
            variant="default"
            className="mt-4"
            onClick={generateByPromptFn}
            disabled={loadingByPrompt || prompt.length === 0}
          >
            {loadingByPrompt && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loadingByPrompt ? "Generating" : "Generate"} by prompt
          </Button>
          {generateByPrompt && (
            <div className="mt-8 relative">
              <Button asChild onClick={onDownloadImageByPrompt}>
                <div className="absolute top-2 right-2 z-10 rounded-full bg-slate-800 cursor-pointer">
                  <DownloadIcon className="h-4 w-4 text-white" />
                </div>
              </Button>
              <Image
                src={generateByPrompt}
                alt="Preview"
                width={500}
                height={500}
                className="rounded-full"
              />
            </div>
          )}
          {loadingByPrompt && (
            <div className="mt-8">
              <Skeleton className="w-[500px] h-[500px] rounded-full" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
