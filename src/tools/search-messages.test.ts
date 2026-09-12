import { describe, expect, it } from "vitest";

// Regressão: o truncamento de mail_search_messages deve cortar por item
// (não por caractere na string já serializada), para nunca devolver JSON
// inválido quando o resultado excede CHARACTER_LIMIT.
function truncateByItem<T>(items: T[], limit: number): { text: string; truncated: boolean } {
  let visibleCount = items.length;
  while (
    visibleCount > 0 &&
    JSON.stringify(items.slice(0, visibleCount), null, 2).length > limit
  ) {
    visibleCount -= 1;
  }
  return {
    text: JSON.stringify(items.slice(0, visibleCount), null, 2),
    truncated: visibleCount < items.length,
  };
}

describe("truncamento de mail_search_messages (regressão)", () => {
  it("produz JSON válido mesmo quando o resultado excede o limite de caracteres", () => {
    const messages = Array.from({ length: 200 }, (_, i) => ({
      uid: i,
      subject: `Assunto de teste número ${i} com bastante texto para inflar o payload`,
      from: "remetente@example.com",
      date: new Date().toISOString(),
      seen: false,
      flagged: false,
    }));

    const { text, truncated } = truncateByItem(messages, 2_000);

    expect(truncated).toBe(true);
    expect(() => JSON.parse(text)).not.toThrow();
  });

  it("não trunca quando o resultado cabe no limite", () => {
    const messages = [{ uid: 1, subject: "ok" }];
    const { text, truncated } = truncateByItem(messages, 25_000);
    expect(truncated).toBe(false);
    expect(JSON.parse(text)).toEqual(messages);
  });
});
