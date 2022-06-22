import { PubSub } from "graphql-subscriptions";
import { CHANGE_VOTES } from "../../config/constants";


const subscriptionResolvers = {
  Subscription: {
    newVote: {
      resolve: (payload: any) =>
        payload.newVote,
        subscribe: async (_: unknown, __: unknown, context: {pubsub: PubSub}) =>
        context.pubsub.asyncIterator([CHANGE_VOTES]),
    },
  }
}

export default subscriptionResolvers;