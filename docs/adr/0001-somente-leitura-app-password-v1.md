# ADR 0001 — Escopo somente-leitura e autenticação via App Password na v1

## Status

Aceito

## Contexto

O `mcpmail` precisa suportar múltiplas contas de email (Gmail +
Speedmail) para leitura via um servidor MCP local. O conector Gmail nativo
disponível no ambiente cobre apenas uma conta via OAuth2, o que não atende ao
caso de múltiplas contas Gmail nem a um provedor IMAP genérico como o
Speedmail.

## Decisão

1. **v1 é somente leitura**: as 5 tools (`mail_list_accounts`,
   `mail_list_folders`, `mail_search_messages`, `mail_get_message`,
   `mail_get_attachment`) não implementam envio, escrita, exclusão ou
   movimentação de mensagens.
2. **Autenticação via App Password**, não OAuth2, tanto para Gmail quanto
   para Speedmail.
3. **Config de contas centralizada** em `config/accounts.json` (gitignored),
   validada com Zod (`AccountsConfigSchema`), referenciada por uma única env
   var `MAIL_MCP_ACCOUNTS_PATH`.

## Consequências

- Reduz o blast radius de qualquer erro de configuração ou tentativa de
  prompt injection vinda de conteúdo de email malicioso — não há operação
  destrutiva possível na v1.
- Simplifica a configuração inicial (sem fluxo OAuth2), ao custo de exigir
  que o usuário gere App Passwords manualmente em cada provedor.
- SMTP/envio, operações em lote e OAuth2 ficam documentados como evolução
  para v2, não implementados agora.
