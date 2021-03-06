import { PubSub } from "graphql-subscriptions";
import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import express, { Application } from "express";
import { execute, GraphQLSchema, subscribe } from "graphql";
import { createServer, Server } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import Database from "./config/database";
import environments from "./config/environments";

class GraphQLServer {
  private app!: Application;
  private httpServer!: Server;
  private readonly DEFAULT_PORT = 3025;
  private schema!: GraphQLSchema;
  private database!: Database;
  private pubsub!: PubSub;
  constructor(schema: GraphQLSchema) {
    if (schema === undefined) {
      throw new Error(
        "Necesitamos un schema de GraphQL para trabajar con APIs GraphQL"
      );
    }
    this.schema = schema;
    if (process.env.NODE_ENV !== "production") {
      const envs = environments;
    }
    this.init();
  }

  private init() {
    this.configExpress();
    this.initializeDbPubSub();
    this.configApolloServerExpress();
    // this.configRoutes();
  }

  private async initializeDbPubSub() {
    this.database = new Database();
    this.pubsub = new PubSub();
  }

  private configExpress() {
    this.app = express();

    this.app.use(compression());

    this.httpServer = createServer(this.app);
  }

  private async configApolloServerExpress() {
    const db = await this.database.init();
    const apolloServer = new ApolloServer({
      schema: this.schema,
      introspection: true,
      context: async ({req, connection}:any) => {
        const token = req ? req.headers.authorization : connection.authorization;
        return {
          db,
          token,
          pubsub: this.pubsub,
        };
      },
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: this.app, cors: true });

    SubscriptionServer.create(
      {
        schema: this.schema,
        execute,
        subscribe,
        onConnect: () => ({ db, pubsub: this.pubsub, user: 'Anartz' }),
      },
      { server: this.httpServer, path: apolloServer.graphqlPath }
    );
  }

  private configRoutes() {
    this.app.get("/hello", (_, res) => {
      res.send("Bienvenid@s al primer proyecto");
    });

    this.app.get("/", (_, res) => {
      res.redirect("/graphql");
    });
  }

  listen(callback: (port: number) => void): void {
    this.httpServer.listen(+this.DEFAULT_PORT, () => {
      callback(+this.DEFAULT_PORT);
    });
  }
}

export default GraphQLServer;