# Domínio — mail-mcp-server

Ver [CONTEXT.md](../../CONTEXT.md) para a tabela de vocabulário de domínio
(Account, Folder, Message, Attachment, App Password, Provider) e decisões
arquiteturais chave.

## Tools MCP (v1 — somente leitura)

| Tool | Entrada obrigatória | Descrição |
|---|---|---|
| `mail_list_accounts` | — | Lista contas configuradas (sem credenciais) |
| `mail_list_folders` | `accountId` | Lista pastas/mailboxes de uma conta |
| `mail_search_messages` | `accountId` | Busca mensagens com filtros e paginação |
| `mail_get_message` | `accountId`, `folder`, `uid` | Lê mensagem completa por UID |
| `mail_get_attachment` | `accountId`, `folder`, `uid`, `filename` | Baixa um anexo específico |

Todas as tools usam prefixo `mail_`, annotations
`{ readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true }`
e schemas Zod `.strict()`.

## Fora de escopo (v2)

- SMTP / envio / resposta / encaminhamento
- Mover, deletar, marcar como lida/flag, operações em lote
- OAuth2 para Gmail
