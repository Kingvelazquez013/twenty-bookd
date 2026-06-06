// src/roles/default-role.ts
// This file goes in your Twenty CRM fork at: src/roles/default-role.ts
// Adds the AI permission flag required for runAgent() to work

import { defineApplicationRole, SystemPermissionFlag } from "twenty-sdk/define";

export default defineApplicationRole({
  universalIdentifier: "b648f87b-1d26-4961-b974-0908fd991061",
  label: "Default function role",
  // runAgent() requires the AI permission flag on the app's default role
  permissionFlagUniversalIdentifiers: [SystemPermissionFlag.AI],
});