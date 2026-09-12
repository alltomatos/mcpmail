import { z } from "zod";

export const MailListAccountsInputSchema = z.object({}).strict();

export type MailListAccountsInput = z.infer<typeof MailListAccountsInputSchema>;

export const MailListFoldersInputSchema = z
  .object({
    accountId: z
      .string()
      .min(1)
      .describe(
        "ID da conta configurada (campo 'id' em accounts.json) cujas pastas serão listadas."
      ),
  })
  .strict();

export type MailListFoldersInput = z.infer<typeof MailListFoldersInputSchema>;

export const MailSearchMessagesInputSchema = z
  .object({
    accountId: z
      .string()
      .min(1)
      .describe("ID da conta configurada onde a busca de mensagens será realizada."),
    folder: z
      .string()
      .min(1)
      .default("INBOX")
      .describe("Caminho da pasta/mailbox a ser pesquisada (ex: 'INBOX', 'Sent'). Padrão: 'INBOX'."),
    limit: z
      .number()
      .int()
      .positive()
      .max(100)
      .default(20)
      .describe("Número máximo de mensagens a retornar (paginação). Padrão: 20, máximo: 100."),
    offset: z
      .number()
      .int()
      .nonnegative()
      .default(0)
      .describe("Quantidade de mensagens a pular a partir do início do resultado (paginação)."),
    unread: z
      .boolean()
      .optional()
      .describe("Se true, retorna apenas mensagens não lidas; se false, apenas lidas; se omitido, ambas."),
    sender: z
      .string()
      .min(1)
      .optional()
      .describe("Filtra mensagens pelo remetente (endereço ou parte do nome/email do campo 'From')."),
    subject: z
      .string()
      .min(1)
      .optional()
      .describe("Filtra mensagens cujo assunto contenha este texto."),
    date: z
      .string()
      .datetime({ offset: true })
      .optional()
      .describe(
        "Filtra mensagens a partir desta data (formato ISO 8601, ex: '2026-01-01T00:00:00Z'). Mensagens anteriores a esta data são excluídas."
      ),
  })
  .strict();

export type MailSearchMessagesInput = z.infer<typeof MailSearchMessagesInputSchema>;

export const MailGetMessageInputSchema = z
  .object({
    accountId: z
      .string()
      .min(1)
      .describe("ID da conta configurada onde a mensagem está armazenada."),
    folder: z
      .string()
      .min(1)
      .describe("Caminho da pasta/mailbox onde a mensagem se encontra (ex: 'INBOX')."),
    uid: z
      .number()
      .int()
      .positive()
      .describe("UID (identificador único IMAP) da mensagem a ser lida por completo."),
  })
  .strict();

export type MailGetMessageInput = z.infer<typeof MailGetMessageInputSchema>;

export const MailGetAttachmentInputSchema = z
  .object({
    accountId: z
      .string()
      .min(1)
      .describe("ID da conta configurada onde a mensagem com o anexo está armazenada."),
    folder: z
      .string()
      .min(1)
      .describe("Caminho da pasta/mailbox onde a mensagem se encontra (ex: 'INBOX')."),
    uid: z
      .number()
      .int()
      .positive()
      .describe("UID (identificador único IMAP) da mensagem que contém o anexo."),
    filename: z
      .string()
      .min(1)
      .describe("Nome do arquivo do anexo (conforme retornado por mail_get_message) a ser baixado."),
  })
  .strict();

export type MailGetAttachmentInput = z.infer<typeof MailGetAttachmentInputSchema>;

export const MailSendMessageInputSchema = z
  .object({
    accountId: z
      .string()
      .min(1)
      .describe("ID da conta configurada (precisa ter bloco 'smtp' em accounts.json) usada para enviar o email."),
    to: z
      .string()
      .min(1)
      .describe("Endereço(s) de destino, separados por vírgula se houver mais de um."),
    cc: z
      .string()
      .min(1)
      .optional()
      .describe("Endereço(s) em cópia, separados por vírgula se houver mais de um."),
    bcc: z
      .string()
      .min(1)
      .optional()
      .describe("Endereço(s) em cópia oculta, separados por vírgula se houver mais de um."),
    subject: z.string().min(1).describe("Assunto do email."),
    bodyText: z
      .string()
      .min(1)
      .optional()
      .describe("Corpo do email em texto plano. Pelo menos um entre bodyText/bodyHtml é obrigatório."),
    bodyHtml: z
      .string()
      .min(1)
      .optional()
      .describe("Corpo do email em HTML. Pelo menos um entre bodyText/bodyHtml é obrigatório."),
  })
  .strict();

export type MailSendMessageInput = z.infer<typeof MailSendMessageInputSchema>;
