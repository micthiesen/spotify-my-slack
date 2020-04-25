import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      exclude: ["/api*"],
      rootPath: join(__dirname, "..", "..", "frontend", "build"),
      serveStaticOptions: {
        immutable: true,
        maxAge: 31536000000, // 1 year in ms
        setHeaders: (res, path) => {
          if (path === "/frontend/build/index.html") {
            res.setHeader("Cache-Control", "public, max-age=0");
          }
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
