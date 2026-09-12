# Schemas de Dados e Validação (Zod) — mail-mcp-server

## Convenções obrigatórias

1. **Todo schema Zod deve encadear `.strict()`**, seja diretamente ou através
   de um `.strict()` aplicado ao `z.object({...})` mais externo do schema.
   Isso rejeita qualquer chave não mapeada no objeto de entrada — essencial
   para evitar que o LLM (ou um cliente MCP malicioso) injete parâmetros
   inesperados que poderiam alterar o comportamento da ferramenta ou vazar
   dados.
2. **Todo campo de um schema de ferramenta MCP deve ter `.describe()`**. A
   descrição é o principal canal pelo qual o LLM entende o que preencher em
   cada campo — schemas sem `.describe()` levam a preenchimento incorreto ou
   alucinado.
3. **A tipagem TypeScript nunca é escrita manualmente** — sempre inferida via
   `z.infer<typeof Schema>`, garantindo que tipo e validação nunca divirjam.
4. Schemas ficam centralizados em `src/schemas/` (ex.: `account.schema.ts`,
   `tools.schema.ts`) e são importados tanto pela camada de configuração
   quanto pela definição das tools MCP.

---

## 1. Configuração de Contas — `config/accounts.json`

Representa a lista de contas de email configuradas localmente (múltiplas
contas Gmail, a conta Speedmail, etc.). É um **array** de contas, validado
inteiramente no boot da aplicação.

```typescript
// src/schemas/account.schema.ts
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

// Array de contas — representa o conteúdo completo de config/accounts.json
export const AccountsConfigSchema = z.array(AccountSchema).min(1);

export type AccountsConfig = z.infer<typeof AccountsConfigSchema>;
```

**Exemplo de `config/accounts.json` válido:**

```json
[
  {
    "id": "gmail-principal",
    "label": "Gmail Pessoal",
    "provider": "gmail",
    "host": "imap.gmail.com",
    "port": 993,
    "secure": true,
    "user": "usuario@gmail.com",
    "appPassword": "xxxxxxxxxxxxxxxx"
  },
  {
    "id": "speedmail-trabalho",
    "label": "Speedmail Trabalho",
    "provider": "speedmail",
    "host": "imap.speedmail.com",
    "port": 993,
    "secure": true,
    "user": "usuario@speedmail.com",
    "appPassword": "yyyyyyyyyyyyyyyy"
  }
]
```

> **Nota de segurança:** `appPassword` nunca deve ser incluído em respostas de
> ferramentas MCP (ver `mail_list_accounts` abaixo, que expõe apenas um
> subconjunto seguro dos campos).

---

## 2. Schemas de Entrada das Ferramentas MCP

Todos os schemas abaixo seguem o padrão: `z.object({...}).strict()`, com
`.describe()` em cada campo.

### 2.1 `mail_list_accounts`

Não recebe parâmetros. Ainda assim, define-se um schema `.strict()` com
objeto vazio para deixar explícito que nenhuma chave é aceita.

```typescript
// src/schemas/tools.schema.ts
import { z } from "zod";

export const MailListAccountsInputSchema = z.object({}).strict();

export type MailListAccountsInput = z.infer<typeof MailListAccountsInputSchema>;
```

### 2.2 `mail_list_folders`

Requer o identificador da conta.

```typescript
export const MailListFoldersInputSchema = z
  .object({
    accountId: z
      .string()
      .min(1)
      .describe("ID da conta configurada (campo 'id' em accounts.json) cujas pastas serão listadas."),
  })
  .strict();

export type MailListFoldersInput = z.infer<typeof MailListFoldersInputSchema>;
```

### 2.3 `mail_search_messages`

Requer `accountId`, com paginação e filtros opcionais.

```typescript
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
```

### 2.4 `mail_get_message`

Requer `accountId`, `folder` e o UID da mensagem.

```typescript
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
```

### 2.5 `mail_get_attachment`

Requer `accountId`, `folder`, `uid` da mensagem e o identificador do anexo.

```typescript
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
```

---

## 3. Resumo dos schemas de entrada por ferramenta

| Ferramenta              | Campos obrigatórios                  | Campos opcionais                                  |
|--------------------------|----------------------------------------|-----------------------------------------------------|
| `mail_list_accounts`     | — (nenhum)                            | —                                                    |
| `mail_list_folders`      | `accountId`                           | —                                                    |
| `mail_search_messages`   | `accountId`                           | `folder`, `limit`, `offset`, `unread`, `sender`, `subject`, `date` |
| `mail_get_message`       | `accountId`, `folder`, `uid`          | —                                                    |
| `mail_get_attachment`    | `accountId`, `folder`, `uid`, `filename` | —                                                 |

---

## 4. Padrão de uso na definição da tool MCP

```typescript
import { server } from "./mcp-server";
import { MailGetMessageInputSchema } from "./schemas/tools.schema";

server.registerTool(
  "mail_get_message",
  {
    description: "Lê o conteúdo completo de uma mensagem de email por UID.",
    inputSchema: MailGetMessageInputSchema,
  },
  async (input) => {
    // `input` já está tipado como MailGetMessageInput e validado com .strict()
    const { accountId, folder, uid } = input;
    // ... lógica de conexão IMAP e parsing via mailparser
  }
);
```

Como todos os schemas usam `.strict()`, qualquer tentativa de enviar um campo
extra (ex.: `{ accountId, folder, uid, __proto__: ... }`) é rejeitada antes de
chegar à lógica de negócio, com um erro de validação do Zod.
