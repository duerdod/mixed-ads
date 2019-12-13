import * as express from "express";

const startServer = async () => {
  const app = express();
  app.get("/", (req, res) => {
    console.log(req);
  });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000`);
  });
};

startServer();
