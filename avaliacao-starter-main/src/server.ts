import Fastify, { type FastifyError } from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { cardRoutes } from "./routes/cards";
import { deckRoutes } from "./routes/decks";

const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler<FastifyError>((error, request, reply) => {
  if (error.validation) {
    return reply.status(400).send({
      message: "Dados inválidos",
      issues: error.validation,
    });
  }

  request.log.error(error);
  return reply.send(error);
});

app.get("/", async () => {
  return { message: "Server online" };
});

app.register(deckRoutes);
app.register(cardRoutes);

app
  .listen({ port: 3333 })
  .then(() => {
    console.log("Server online");
  })
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });