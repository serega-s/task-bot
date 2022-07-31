import { Markup } from "telegraf"

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback("➕ Create todo", "create"),
      Markup.button.callback("📋 Todos list", "list"),
      Markup.button.callback("✅ Done todo", "Done"),
      Markup.button.callback("📝 Edit todo", "edit"),
      Markup.button.callback("✂ Delete todo", "delete"),
    ],
    {
      columns: 2,
    }
  )
}
