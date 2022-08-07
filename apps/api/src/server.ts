import { App } from "./app";

(async () => {
  const app = new App();
  // await app.createDBConnection();
  app.listen();
})();
