# Domínio — mcpmail

Ver [CONTEXT.md](../../CONTEXT.md) para a tabela de vocabulário de domínio
(Account, Folder, Message, Attachment, App Password, Provider) e decisões
arquiteturais chave.

## Tools MCP — leitura (v1)

| Tool | Entrada obrigatória | Descrição |
|---|---|---|
| `mail_list_accounts` | — | Lista contas configuradas (sem credenciais) |
| `mail_list_folders` | `accountId` | Lista pastas/mailboxes de uma conta |
| `mail_search_messages` | `accountId` | Busca mensagens com filtros e paginação |
| `mail_get_message` | `accountId`, `folder`, `uid` | Lê mensagem completa por UID |
| `mail_get_attachment` | `accountId`, `folder`, `uid`, `filename` | Baixa um anexo específico |

Annotations: `{ readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }`.

## Tools MCP — envio, escrita e reply/forward (v2)

Ver [ADR 0002](../adr/0002-escrita-e-envio-v2.md) para o racional de
segurança por trás destas tools.

| Tool | Entrada obrigatória | Descrição | Annotations |
|---|---|---|---|
| `mail_send_message` | `accountId`, `to`, `subject`, (`bodyText` ou `bodyHtml`) | Envia um novo email via SMTP. Exige bloco `smtp` na conta. | `destructiveHint: false, idempotentHint: false` |
| `mail_mark_message` | `accountId`, `folder`, `uid`, (`seen` ou `flagged`) | Marca lida/não lida e/ou com flag de destaque. Reversível. | `destructiveHint: false, idempotentHint: true` |
| `mail_move_message` | `accountId`, `sourceFolder`, `uid`, `targetFolder` | Move mensagem entre pastas. | `destructiveHint: true, idempotentHint: false` |
| `mail_delete_message` | `accountId`, `folder`, `uid`, `confirm: true` | Deleta permanentemente. **Irreversível.** `confirm` é `z.literal(true)` — chamada sem ele é rejeitada pela validação Zod antes de qualquer lógica rodar. | `destructiveHint: true, idempotentHint: false` |
| `mail_reply_message` | `accountId`, `folder`, `uid`, (`bodyText` ou `bodyHtml`) | Responde à mensagem original (ou a `to` explícito), com `In-Reply-To`/`References` corretos e corpo citado. Exige bloco `smtp` na conta. | `destructiveHint: false, idempotentHint: false` |
| `mail_forward_message` | `accountId`, `folder`, `uid`, `to` | Encaminha a mensagem original para novos destinatários, citando headers e corpo. Exige bloco `smtp` na conta. | `destructiveHint: false, idempotentHint: false` |

Todas as tools usam prefixo `mail_` e schemas Zod `.strict()` com
`.describe()` em cada campo.

## Fora de escopo (ainda não implementado)

- OAuth2 para Gmail
- Operações em lote (múltiplas mensagens de uma vez)
