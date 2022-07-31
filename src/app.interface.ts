import { Context as ContextTelegraph } from "telegraf"

export interface Context extends ContextTelegraph {
  session: {
    type?: "done" | "edit" | "remove" | "create"
  }
}
