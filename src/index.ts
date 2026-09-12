import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadAccountsConfig } from "./config.js";
import { registerMailListAccounts } from "./tools/list-accounts.js";
import { registerMailListFolders } from "./tools/list-folders.js";
import { registerMailSearchMessages } from "./tools/search-messages.js";
import { registerMailGetMessage } from "./tools/get-message.js";
import { registerMailGetAttachment } from "./tools/get-attachment.js";

async function main() {
  // Falha rápido e com mensagem acionável se accounts.json estiver ausente/inválido.
  loadAccountsConfig();

  const server = new McpServer({
    name: "mcpmail",
    version: "0.1.0",
  });

  registerMailListAccounts(server);
  registerMailListFolders(server);
  registerMailSearchMessages(server);
  registerMailGetMessage(server);
  registerMailGetAttachment(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(`[mcpmail] erro fatal: ${(err as Error).message}`);
  process.exit(1);
});
