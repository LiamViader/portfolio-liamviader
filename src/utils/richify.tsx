import React from "react";


export function richify(text: string) {
  const parts = text.split(/(<highlight>|<\/highlight>)/g);
  return parts.map((part, i) => {
    if (part === "<highlight>" || part === "</highlight>") return null;
    if (parts[i - 1] === "<highlight>") {
      return <span key={i} className="text-sky-300">{part}</span>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}