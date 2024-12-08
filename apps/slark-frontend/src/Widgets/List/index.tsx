import { FC, useEffect, useRef } from "react";
import { debounce } from "lodash-es";
import { Item } from "./Item";

interface ListNodeProps {
  id: string;
}

export const List: FC<ListNodeProps> = ({ id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const l = () => {
      const s = document.getSelection();
      if (!s) return;
      const r = s.getRangeAt(0);
      const n = r.startContainer.parentElement;
      if (!n) return;
      if (!containerRef.current?.contains(n)) return;
      console.log('ev', r, r.cloneContents());
      const p = document.createElement("span");
      const child = r.cloneContents();
      console.log('ev', 1, child.textContent)
      if (!child.textContent) return;
      p.appendChild(child);
      r.deleteContents();
      r.insertNode(p);
    };
    document.addEventListener("mouseup", l);
    return () => document.removeEventListener("mouseup", l);
  }, []);

  return (
    <div ref={containerRef}>
      <Item isContainer id={id} />
    </div>
  );
};
