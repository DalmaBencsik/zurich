import axios from "axios";
import IChatAnswer from "../interfaces/IChatAnswer";

export const getChatBotData = () => {
    return axios
      .get("/assets/flow.json")
      .then(result => { return result.data; })
      .catch(error => console.error(error.response));
};

export const sendAnswers = (answers: IChatAnswer[]) => {
    axios
      .put("https://virtserver.swaggerhub.com/L8475/task/1.0.0/conversation", answers)
      .catch(error => console.error(error.response));
};