import { useEffect, useState } from "react";

/** Id of the section currently crossing the middle of the viewport, for nav highlighting. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) io.observe(node);
    });
    return () => io.disconnect();
  }, [ids]);

  return active;
}
