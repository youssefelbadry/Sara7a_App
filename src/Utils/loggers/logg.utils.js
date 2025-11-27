import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";

const __dirname = path.resolve();

export function attachRouterWithLoggers(app, routerPath, router, logFileName) {
  const logStream = fs.createWriteStream(
    path.join(__dirname, "./src/logs", logFileName),
    { flags: "a" }
  );

  app.use(routerPath, morgan("common", { stream: logStream }), router);
  app.use(routerPath, morgan("dev"), router);
}
