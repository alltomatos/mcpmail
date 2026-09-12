# mail-mcp-server

Servidor MCP (Model Context Protocol) de leitura de email multi-conta —
Gmail (via App Password) e provedores IMAP genéricos (ex: Speedmail).

**v1 é somente leitura**: sem envio, sem escrita/exclusão/movimentação.
Ver [PRD.md](PRD.md), [CONTEXT.md](CONTEXT.md) e [docs/adr/](docs/adr/) para
o contexto completo de decisões.

## Instalação

```bash
npm install
npm run build
```

## Configuração

Copie `config/accounts.example.json` para `config/accounts.json` (git-ignored)
e preencha com suas contas reais:

```bash
cp config/accounts.example.json config/accounts.json
```

Cada conta usa App Password (não OAuth2). Para Gmail, gere uma App Password em
https://myaccount.google.com/apppasswords.

Por padrão o servidor lê `./config/accounts.json`. Para usar outro caminho,
defina a variável de ambiente `MAIL_MCP_ACCOUNTS_PATH`.

## Uso

```bash
npm start
```

O servidor comunica via stdio (transporte `StdioServerTransport`), pensado
para rodar como subprocess do Claude Code:

```bash
claude mcp add mcpmail -- node /caminho/absoluto/dist/index.js
```

## Tools disponíveis (v1)

Ver [docs/agents/domain.md](docs/agents/domain.md) para a lista completa das
5 tools de leitura (`mail_list_accounts`, `mail_list_folders`,
`mail_search_messages`, `mail_get_message`, `mail_get_attachment`).

## Testes

```bash
npm test
```

## Fora de escopo (v2)

- SMTP / envio / resposta / encaminhamento
- Mover, deletar, marcar como lida/flag, operações em lote
- OAuth2 para Gmail
