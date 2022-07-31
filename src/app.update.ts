import { AppService } from "./app.service"
import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from "nestjs-telegraf"
import { Telegraf } from "telegraf"
import { Context } from "./app.interface"
import { actionButtons } from "./app.buttons"
import { showList } from "./app.utils"

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply("Hello friend...")
    await ctx.reply("What would you like to do?", actionButtons())
  }

  @Hears("📋 Todos list")
  async listTask(ctx: Context) {
    const todos = await this.appService.getAll()
    await ctx.reply(showList(todos))
  }
  @Hears("➕ Create todo")
  async createTask(ctx: Context) {
    ctx.session.type = "create"
    await ctx.deleteMessage()
    await ctx.reply("Your new task: ")
  }
  @Hears("✅ Done todo")
  async doneTask(ctx: Context) {
    ctx.session.type = "done"
    await ctx.deleteMessage()
    await ctx.reply("Write todo ID: ")
  }
  @Hears("✂ Delete todo")
  async deleteTask(ctx: Context) {
    ctx.session.type = "remove"
    await ctx.deleteMessage()
    await ctx.reply("Write todo ID: ")
  }
  @Hears("📝 Edit todo")
  async editTask(ctx: Context) {
    ctx.session.type = "edit"
    await ctx.deleteMessage()
    await ctx.replyWithHTML(
      "Write todo ID and new name: \n\n" + "Format: <b>1 | Name</b>"
    )
  }

  @On("text")
  async getMessage(@Message("text") message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return
    if (ctx.session.type === "create") {
      const todos = await this.appService.createTask(message)

      await ctx.reply(showList(todos))
    }
    if (ctx.session.type === "done") {
      const todos = await this.appService.doneTask(Number(message))
      if (!todos) {
        await ctx.deleteMessage()
        await ctx.reply("No todo found with this ID!")
        return
      }

      await ctx.reply(showList(todos))
    }
    if (ctx.session.type === "edit") {
      const [taskId, taskName] = message.split(" | ")

      const todos = await this.appService.editTask(Number(taskId), taskName)
      if (!todos) {
        await ctx.deleteMessage()
        await ctx.reply("No todo found with this ID!")
        return
      }

      await ctx.reply(showList(todos))
    }
    if (ctx.session.type === "remove") {
      const todos = await this.appService.deleteTask(Number(message))
      if (!todos) {
        await ctx.deleteMessage()
        await ctx.reply("No todo found with this ID!")
        return
      }

      await ctx.reply(showList(todos))
    }
  }
}
