// src/skills/bookd-crm-skills.ts
// This file goes in your Twenty CRM fork at: src/skills/bookd-crm-skills.ts
// Skills that book'd managed AI agents can use to perform native CRM actions

import { defineSkill } from "twenty-sdk/define";

export default [
  defineSkill({
    universalIdentifier: "e1f2a3b4-c5d6-7890-abcd-ef1234567891",
    name: "create_dashboard",
    label: "Create Dashboard",
    description: "Creates a new dashboard in book'd CRM with starter widgets based on your request",
    icon: "IconLayoutDashboard",
    content: `
Use this skill when the user asks to create, make, build, or add a dashboard.

You will be given the user's request. Extract:
1. The dashboard topic/type (e.g., "lead intake", "sales pipeline", "compliance", "tasks", "client activity")
2. Any specific title if mentioned (e.g., "called 'My Pipeline'")

If the request is vague (just "create a dashboard"), ask for clarification on what kind of dashboard they want.

When you have enough info, the system will create the dashboard and return the result.
`,
  }),

  defineSkill({
    universalIdentifier: "f2a3b4c5-d6e7-8901-bcde-f23456789013",
    name: "create_workflow",
    label: "Create Workflow",
    description: "Creates a draft workflow automation in book'd CRM",
    icon: "IconGitBranch",
    content: `
Use this skill when the user asks to create, make, build, or add a workflow or automation.

Common triggers:
- "When a deal stage changes, notify Slack"
- "When an opportunity reaches $100K, send notification"
- "Create a workflow for deal updates"

Extract the trigger condition and desired action. The system will create a draft workflow with:
1. A trigger (e.g., deal updated)
2. An AI step to prepare notification
3. An HTTP request step to send notification

The user must review and activate the workflow in the Workflows section.
`,
  }),

  defineSkill({
    universalIdentifier: "a3b4c5d6-e7f8-9012-cdef-345678901235",
    name: "count_people",
    label: "Count People",
    description: "Counts people/contacts in the book'd CRM",
    icon: "IconUsers",
    content: `
Use this skill when the user asks "how many" people, customers, clients, contacts, or people are in the CRM.

Examples:
- "How many contacts do I have?"
- "Count my clients"
- "How many people in this CRM?"

The system will return the exact count from the CRM database.
`,
  }),
];