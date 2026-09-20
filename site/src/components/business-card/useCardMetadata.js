import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_TITLE = "Farhaan Khan | Portfolio | Software Developer";
const DEFAULT_DESCRIPTION = "Computer Science student building developer tools, web applications, and AI-assisted systems. Explore projects, experiments, and build logs.";

export function useCardMetadata(project, section) {
  const { pathname } = useLocation();
  useEffect(() => {
    const title = pathname === "/" ? DEFAULT_TITLE : `${project?.title || (pathname === "/work" ? "Work" : section) || "Page not found"} | Farhaan Khan`;
    const description = project?.summary || DEFAULT_DESCRIPTION;
    const url = `https://farhaankhan.dev${pathname}`;
    document.title = title;
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) document.querySelector(selector)?.setAttribute("content", title);
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) document.querySelector(selector)?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
  }, [pathname, project, section]);
}
