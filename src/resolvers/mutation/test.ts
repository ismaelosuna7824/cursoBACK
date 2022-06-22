import { IResolvers } from "@graphql-tools/utils";
import { ITest } from "../../interfaces/book-interface";
import { TestModel } from "../../models/testModel";

const mutationBookResolvers: IResolvers = {
  Mutation: {
    /**
     * 
     * @param _ no se envia nada
     * @param se envia los argumentos necesarios
     * @param se envia el context(subscripcion, token) los que se necesiten de los 3 o la db si no se esta usando mongoose
     * @returns es lo que va a retornar y se definio en los roots
     */
     testMutation: async (_: void, args: { test: ITest }, {}): Promise<{ status: boolean; }> => {
        try {
          const resultTest = await TestModel.create(args.test)
          return{
            status: true
          }
        } catch (error) {
          return{
            status: false
          }
        }
    }
  },
};

export default mutationBookResolvers;
