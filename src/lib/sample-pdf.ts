function pdfEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function toWinAnsi(text: string): string {
  return text
    .replaceAll("č", "c")
    .replaceAll("ć", "c")
    .replaceAll("š", "s")
    .replaceAll("ž", "z")
    .replaceAll("đ", "d")
    .replaceAll("Č", "C")
    .replaceAll("Ć", "C")
    .replaceAll("Š", "S")
    .replaceAll("Ž", "Z")
    .replaceAll("Đ", "D");
}

/** Build a one-page Helvetica PDF (A4) from ASCII-safe lines. */
export function makeSamplePdf(title: string, lines: string[]): Blob {
  const heading = pdfEscape(toWinAnsi(title));
  const body = lines.map((line) => pdfEscape(toWinAnsi(line)));

  const contentLines = [
    "BT",
    "/F1 18 Tf",
    "56 780 Td",
    `(${heading}) Tj`,
    "/F1 10 Tf",
    "0 -28 Td",
  ];
  body.forEach((line, i) => {
    if (i > 0) contentLines.push("0 -15 Td");
    contentLines.push(`(${line}) Tj`);
  });
  contentLines.push("ET");
  const stream = contentLines.join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let out = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefAt = out.length;
  out += `xref\n0 ${objects.length + 1}\n`;
  out += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    out += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  out += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  out += `startxref\n${xrefAt}\n%%EOF`;

  return new Blob([out], { type: "application/pdf" });
}

export function inferDocKind(filename: string): import("@/lib/types").DocKind {
  const n = filename.toLowerCase();
  if (n.includes("ugovor") || n.includes("contract")) return "ugovor";
  if (n.includes("predracun") || n.includes("predračun") || n.includes("ponuda"))
    return "predracun";
  if (n.includes("racun") || n.includes("račun") || n.includes("invoice"))
    return "racun";
  if (n.includes("setlist") || n.includes("repertoar")) return "setlista";
  if (n.includes("rider")) return "rider";
  if (n.includes("tlocrt") || n.includes("layout") || n.includes("mapa"))
    return "tlocrt";
  return "ostalo";
}
