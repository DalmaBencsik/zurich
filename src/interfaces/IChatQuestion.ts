import IChatAnswerOption from "./IChatAnswerOption";

interface IChatQuestion {
    id: number;
    name: string;
    text: string;
    uiType: string;
    valueType: string;
    valueOptions: IChatAnswerOption[];
}

export default IChatQuestion;