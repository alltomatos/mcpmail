# AGENTS.md — mcpmail

## Visão geral

Servidor MCP (Model Context Protocol) em TypeScript para leitura de email
multi-conta (Gmail via App Password + Speedmail IMAP/SMTP genérico). Escopo
v1 é **somente leitura**: sem envio, sem escrita/exclusão/movimentação.

Ver [PRD.md](PRD.md) para o plano completo, [DER.md](DER.md) para o modelo de
dados lógico e [schema.md](schema.md) para os schemas Zod de validação.

## Stack

- TypeScript, `@modelcontextprotocol/sdk` (transporte stdio)
- `imapflow` (cliente IMAP), `mailparser` (parsing MIME)
- Validação: Zod, todos os schemas `.strict()` com `.describe()` por campo
- Testes: Vitest
- Sem banco de dados — dados remotos (IMAP) são efêmeros, só `Account` é
  persistido localmente em `config/accounts.json` (gitignored)

## Convenções de branch

- `main`: produção/estável
- `develop`: integração das features do PRD atual
- `feature/<slug>` ou `issue-<n>-<slug>`: trabalho de uma Issue, mergeada em
  `develop` via PR

## Testes

- `npm test` roda a suíte Vitest
- Tools MCP devem ter testes que verificam: schema `.strict()` rejeita campos
  extras, nenhuma credencial (`appPassword`) vaza nas respostas

## Deploy / distribuição

- Uso local, subprocess do Claude Code (`claude mcp add`)
- Sem deploy remoto na v1

## Agent skills

Este projeto é governado pelo framework `alltomatos/skills` via `/developer`.
Consulte `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md` e
`docs/agents/domain.md` antes de abrir ou trabalhar em Issues.
