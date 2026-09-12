import { z } from "zod";

export const AccountSchema = z
  .object({
    id: z
      .string()
      .min(1)
      .describe("Identificador único e estável da conta (ex: 'gmail-principal')."),
    label: z
      .string()
      .min(1)
      .describe("Nome amigável exibido para o usuário (ex: 'Gmail Pessoal')."),
    provider: z
      .enum(["gmail", "speedmail", "outlook", "generic-imap"])
      .describe("Provedor de email, usado para aplicar particularidades de conexão."),
    host: z
      .string()
      .min(1)
      .describe("Hostname do servidor IMAP (ex: 'imap.gmail.com')."),
    port: z
      .number()
      .int()
      .positive()
      .describe("Porta do servidor IMAP (ex: 993 para IMAP com TLS)."),
    secure: z
      .boolean()
      .describe("Define se a conexão usa TLS/SSL implícito."),
    user: z
      .string()
      .min(1)
      .describe("Usuário/login IMAP, geralmente o endereço de email completo."),
    appPassword: z
      .string()
      .min(1)
      .describe("Senha de aplicativo (App Password) usada para autenticação IMAP."),
  })
  .strict();

export type Account = z.infer<typeof AccountSchema>;

export const AccountsConfigSchema = z.array(AccountSchema).min(1);

export type AccountsConfig = z.infer<typeof AccountsConfigSchema>;
