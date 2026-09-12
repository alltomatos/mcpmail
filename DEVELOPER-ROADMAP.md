# DEVELOPER-ROADMAP.md — mcpmail

Bússola estratégica do projeto. Cada Epic tem um GitHub Issue como fonte
detalhada de contexto, critérios de aceite e status.

## Epics

### [**[E01] Setup do projeto e infraestrutura base**](https://github.com/alltomatos/mcpmail/issues/1)
- **Estado**: todo
- **Objetivo**: scaffolding TypeScript, config de contas (Zod), cliente IMAP
  compartilhado, servidor MCP base (stdio).

### [**[E02] Tools MCP de leitura de email (5 tools)**](https://github.com/alltomatos/mcpmail/issues/2)
- **Estado**: todo
- **Objetivo**: implementar `mail_list_accounts`, `mail_list_folders`,
  `mail_search_messages`, `mail_get_message`, `mail_get_attachment`.
- **Bloqueado por**: [E01]

### [**[E03] Verificação, documentação e registro no Claude Code**](https://github.com/alltomatos/mcpmail/issues/3)
- **Estado**: todo
- **Objetivo**: README, testes automatizados, verificação manual completa,
  registro do servidor via `claude mcp add`.
- **Bloqueado por**: [E02]

## Milestones

### M1 — v1 utilizável localmente (E01 → E02 → E03)
Entrega o escopo mínimo do PRD.md: servidor MCP local, somente leitura,
multi-conta (Gmail App Password + Speedmail), testado manualmente contra
contas reais e registrado no Claude Code.

## Fora de escopo (v2 — não roadmapeado ainda)

- SMTP / envio / resposta / encaminhamento
- Mover, deletar, marcar como lida/flag, operações em lote
- OAuth2 para Gmail
