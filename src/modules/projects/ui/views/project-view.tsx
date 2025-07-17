"use client";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fragment } from "@/generated/prisma";
import { CodeIcon, CrownIcon, EyeIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState, useCallback } from "react";
import { FragmentWeb } from "../components/fragment-web";
import { MessagesContainer } from "../components/messages-container";
import { ProjectHeader } from "../components/project-header";
import { FileExplorer } from "@/components/file-explorer";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface Props {
  projectId: string;
  files: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAll = useCallback(async () => {
    if (
      !(
        tabState === "code" &&
        activeFragment?.files &&
        Object.keys(activeFragment.files).length > 0
      )
    )
      return;
    setDownloading(true);
    try {
      const zip = new JSZip();
      Object.entries(
        activeFragment.files as { [path: string]: string }
      ).forEach(([path, content]) => {
        zip.file(path, content);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "files.zip");
      toast.success("Download started!");
    } catch (err) {
      toast.error("Failed to download zip");
    } finally {
      setDownloading(false);
    }
  }, [tabState, activeFragment]);

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading project...</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>Loading messages...</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={70}
          minSize={50}
          className="mb-3 mr-2 rounded-b-xl border-b border-l border-r"
        >
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 rounded-md gap-x-1">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleDownloadAll}
                  disabled={
                    downloading ||
                    !(
                      tabState === "code" &&
                      activeFragment?.files &&
                      Object.keys(activeFragment.files).length > 0
                    )
                  }
                  aria-label="Download all files"
                >
                  <DownloadIcon
                    className={downloading ? "animate-spin" : undefined}
                  />{" "}
                  Download Files
                </Button>

                <Button asChild size="sm" variant="default">
                  <Link href="/pricing">
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
