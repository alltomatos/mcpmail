import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadAccountsConfig } from "./config.js";
import { registerMailListAccounts } from "./tools/list-accounts.js";
import { registerMailListFolders } from "./tools/list-folders.js";
import { registerMailSearchMessages } from "./tools/search-messages.js";
import { registerMailGetMessage } from "./tools/get-message.js";

async function main() {
  // Falha rápido e com mensagem acionável se accounts.json estiver ausente/inválido.
  loadAccountsConfig();

  const server = new McpServer({
    name: "mail-mcp-server",
    version: "0.1.0",
  });

  registerMailListAccounts(server);
  registerMailListFolders(server);
  registerMailSearchMessages(server);
  registerMailGetMessage(server);
  // mail_get_attachment é registrada aqui conforme implementada — ver Issue #9.

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(`[mail-mcp-server] erro fatal: ${(err as Error).message}`);
  process.exit(1);
});
