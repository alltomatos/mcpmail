import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { simpleParser } from "mailparser";

const ATTACHMENT_CONTENT = "conteúdo-de-teste-do-anexo-1234567890";

function buildRawEmailWithAttachment(): string {
  const base64Content = Buffer.from(ATTACHMENT_CONTENT, "utf-8").toString("base64");
  return [
    "From: remetente@example.com",
    "To: destinatario@example.com",
    "Subject: Teste com anexo",
    'Content-Type: multipart/mixed; boundary="BOUNDARY"',
    "",
    "--BOUNDARY",
    "Content-Type: text/plain",
    "",
    "Corpo da mensagem.",
    "",
    "--BOUNDARY",
    'Content-Type: text/plain; name="arquivo.txt"',
    "Content-Transfer-Encoding: base64",
    'Content-Disposition: attachment; filename="arquivo.txt"',
    "",
    base64Content,
    "",
    "--BOUNDARY--",
    "",
  ].join("\r\n");
}

describe("mail_get_attachment — round-trip do conteúdo", () => {
  it("o base64 do anexo corresponde byte-a-byte ao conteúdo original", async () => {
    const parsed = await simpleParser(buildRawEmailWithAttachment());
    const found = parsed.attachments.find((att) => att.filename === "arquivo.txt");

    expect(found).toBeDefined();

    const contentBase64 = found!.content.toString("base64");
    const roundTripped = Buffer.from(contentBase64, "base64");

    expect(roundTripped.toString("utf-8")).toBe(ATTACHMENT_CONTENT);
    expect(createHash("sha256").update(roundTripped).digest("hex")).toBe(
      createHash("sha256").update(ATTACHMENT_CONTENT, "utf-8").digest("hex")
    );
  });

  it("retorna undefined para filename inexistente", async () => {
    const parsed = await simpleParser(buildRawEmailWithAttachment());
    const found = parsed.attachments.find((att) => att.filename === "nao-existe.txt");
    expect(found).toBeUndefined();
  });
});
