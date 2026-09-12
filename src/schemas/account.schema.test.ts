import { describe, expect, it } from "vitest";
import { AccountSchema, AccountsConfigSchema } from "./account.schema.js";

const validAccount = {
  id: "gmail-principal",
  label: "Gmail Pessoal",
  provider: "gmail",
  host: "imap.gmail.com",
  port: 993,
  secure: true,
  user: "usuario@gmail.com",
  appPassword: "xxxxxxxxxxxxxxxx",
};

describe("AccountSchema", () => {
  it("aceita uma conta válida", () => {
    expect(AccountSchema.safeParse(validAccount).success).toBe(true);
  });

  it("rejeita campos extras (.strict())", () => {
    const result = AccountSchema.safeParse({
      ...validAccount,
      extraField: "não deveria existir",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita provider fora do enum", () => {
    const result = AccountSchema.safeParse({
      ...validAccount,
      provider: "yahoo",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita quando faltam campos obrigatórios", () => {
    const { appPassword, ...withoutPassword } = validAccount;
    expect(AccountSchema.safeParse(withoutPassword).success).toBe(false);
  });
});

describe("AccountsConfigSchema", () => {
  it("aceita um array com ao menos uma conta", () => {
    expect(AccountsConfigSchema.safeParse([validAccount]).success).toBe(true);
  });

  it("rejeita array vazio", () => {
    expect(AccountsConfigSchema.safeParse([]).success).toBe(false);
  });
});
