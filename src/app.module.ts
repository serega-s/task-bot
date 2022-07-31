import { Module } from "@nestjs/common"
import { TelegrafModule } from "nestjs-telegraf"
import * as LocalSession from "telegraf-session-local"
import { AppUpdate } from "./app.update"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "path"
import { TaskEntity } from "./task.entity"

const sessions = new LocalSession({ database: "session_db.json" })

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: "5464357421:AAGDLXzS4l-FR12BxigtID0LcwEF7q-uYsI",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      database: "todo-app-tg-bot",
      username: "postgres",
      password: "postgres",
      entities: [join(__dirname, "**", "*.entity.{ts,js}")],
      migrations: [join(__dirname, "**", "*.migration.{ts,js}")],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
