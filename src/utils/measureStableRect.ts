// utils/measureStableRect.ts
export function measureStableRect(el: HTMLElement): DOMRect {
  const rect = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const t = cs.transform;

  if (!t || t === "none") return rect;

  let scaleX = 1, scaleY = 1;

  if (t.startsWith("matrix3d(")) {
    // matrix3d(a,b,c,d, e,f,g,h, i,j,k,l, m,n,o,p) => scaleX=a, scaleY=f
    const v = t.slice(9, -1).split(",").map(Number);
    scaleX = v[0] || 1;
    scaleY = v[5] || 1;
  } else if (t.startsWith("matrix(")) {
    // matrix(a, b, c, d, e, f) => scaleX=a, scaleY=d
    const v = t.slice(7, -1).split(",").map(Number);
    scaleX = v[0] || 1;
    scaleY = v[3] || 1;
  }

  if (Math.abs(scaleX - 1) < 0.001 && Math.abs(scaleY - 1) < 0.001) {
    return rect;
  }

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const baseW = rect.width / scaleX;
  const baseH = rect.height / scaleY;

  const left = cx - baseW / 2;
  const top = cy - baseH / 2;

  return new DOMRect(left, top, baseW, baseH);
}
