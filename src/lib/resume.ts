import type { MouseEvent } from "react";
import { profile } from "./data";

export const RESUME_FILENAME = "Vruttant_Patoliya_Resume.pdf";

interface DownloadsApi {
  save(req: { filename: string; data: Blob }): Promise<unknown>;
}
interface ClaudeHost {
  use(name: "downloads"): Promise<DownloadsApi | null>;
}

/**
 * On a normal host the <a download> link just works. Inside a sandboxed claude.ai
 * preview, direct downloads are blocked, so hand the file to the host's save dialog,
 * falling back to opening the PDF in a new tab.
 */
export async function onResumeClick(e: MouseEvent<HTMLAnchorElement>) {
  const host = (window as unknown as { claude?: ClaudeHost }).claude;
  if (!host?.use) return; // regular site: let the browser handle the download

  e.preventDefault();
  const url = new URL(profile.resume, document.baseURI).href;
  try {
    const downloads = await host.use("downloads");
    if (!downloads) throw new Error("unavailable");
    const blob = await (await fetch(url)).blob();
    await downloads.save({ filename: RESUME_FILENAME, data: blob });
  } catch (err) {
    // The viewer declining the save prompt is a choice, not a failure.
    if ((err as { code?: string })?.code === "declined") return;
    window.open(url, "_blank", "noopener");
  }
}
