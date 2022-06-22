import { IResolvers } from "@graphql-tools/utils";
import { Itest, TestModel } from "../../models/testModel";
import JWT from "../../lib/jwt";
import { PubSub } from "graphql-subscriptions";
import { CHANGE_VOTES } from "../../config/constants";

async function sendNotification(pubsub: PubSub) {
  // const characters = await getCharacters(db);
  await pubsub.publish(CHANGE_VOTES, { newVote: "nuevo tick" });
}

const queryBookResolvers: IResolvers = {
  Query: {
    testQuery: async (_: void, {}, {}): Promise<{ status: boolean; message: string; data: Array<Itest>; }> => {
      try {
          const  data = await TestModel.find();
          return {
              status: true,
              message: `Data correcta`,
              data
            };
          
      } catch (error) {
          return {
              status: false,
              message: `${error}`,
              data: []
            };    
      }
    },
    login: async (_: void, {nombre}, {}): Promise<{ status: boolean; message: string; token: string; }> => {
      try {
          const  data = await TestModel.findOne({nombre: nombre});
          //console.log(new JWT().sign({ data }))
          return {
              status: true,
              message: `Data correcta`,
              token: new JWT().sign({ data })
            };
          
      } catch (error) {
        //console.log(error)
          return {
              status: false,
              message: `${error}`,
              token: ''
            };    
      }
    },
    me: async (_: void, {}, {token, pubsub}): Promise<any> => {
      try {
        const verify:any = new JWT().verify(token)
        // console.log(verify.user.data.nombre)
        if(verify == "false"){
          console.log("tokrn mal")
        }else{
          sendNotification(pubsub);
          return {
            _id: '',
            nombre: verify.user.data.nombre
          }
        }
      } catch (error) {
        //console.log(error)
          return {
              _id: "",
              nombre: ``,
            };    
      }
    }
  },
};


export default queryBookResolvers;