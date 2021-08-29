import { Button, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect } from "react";
import IChatAnswer from "../interfaces/IChatAnswer";
import IChatAnswerOption from "../interfaces/IChatAnswerOption";
import IChatQuestion from "../interfaces/IChatQuestion";
import { getChatBotData, sendAnswers } from "../services/ChatServices";

const useStyles = makeStyles({
    container: {
        maxWidth: "1024px",
        margin: "0 auto 24px auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
    },
    questionContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%"
    },
    question: {
        textAlign: "left",
        margin: "24px 24px 0 24px",
        padding: "12px"
    },
    answerOptionContainer: {
        display: "flex",
        flexDirection: "column",
        margin: "auto"
    },
    answerOption: {
        margin: "24px 24px 0 24px"
    },
    answerContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%"
    },
    answer: {
        margin: "24px 24px 0 auto",
        padding: "12px"
    },
    "@media (min-width: 600px)": {
        answerOptionContainer: {
            flexDirection: "row"
        }
    }
});

const Conversation: React.FC = () => {
    const styles = useStyles();
    const [questions, setQuestions] = useState([] as IChatQuestion[]);
    const [activeQuestionId, setActiveQuestionId] = useState<number | boolean>(100);
    const [answers, setAnswers] = useState([] as IChatAnswer[]);
    const [flowTerminated, setFlowTerminated] = useState(false);

    useEffect(() => {
        getChatBotData().then((result: IChatQuestion[]) => { 
            result && setQuestions(result);
        });
    }, []);

    useEffect(() => {
        flowTerminated && sendAnswers(answers);
    }, [flowTerminated, answers]);

    const getQuestionFromId = (id: number | boolean) => {
        return questions.find(question => question.id === id);
    };

    const getQuestionFromName = (name: string) => {
        return questions.find(question => question.name === name);
    };

    const getValueOption = (question: IChatQuestion | undefined, value: string | boolean | number) => {
        return question?.valueOptions.find(valueOption => valueOption.value === value);
    };

    const renderAnswers = () => {
        return (
            answers.map(answer => {
                const question = getQuestionFromName(answer.name);
                return (
                    <div key={answer.name} className={styles.answerContainer}>
                        <Paper elevation={3} className={styles.question}>
                            {question?.text}
                        </Paper>
                        <Paper elevation={3} className={styles.answer}>
                            {getValueOption(question, answer.value)?.text}
                        </Paper>
                    </div>
                );
            })
        );
    };

    const renderNextQuestion = () => {
        const question = getQuestionFromId(activeQuestionId);
        return ( 
            question ? 
            <div className={styles.questionContainer}> 
                <Paper elevation={3} className={styles.question}>
                    {question?.text}
                </Paper>
                <div className={styles.answerOptionContainer}>
                    {question?.valueOptions.map(valueOption => 
                        <Button 
                            className={styles.answerOption}
                            color="primary" 
                            variant="contained"
                            onClick={() => selectValueOption(question, valueOption)} 
                            key={`${question.id}_${valueOption.value}`}
                        >
                            <span>{valueOption.text}</span>
                        </Button>
                    )} 
                </div>
            </div>
            : <></>
        );
    };

    const renderGoodbye = () => {
        return (
            <Paper elevation={3} className={styles.question}>
                <span>Herzlichen Dank für Ihre Angaben</span>
            </Paper>
        );
    };

    const goToNextStep = (nextQuestionId: number | boolean) => {
        setActiveQuestionId(nextQuestionId);
        nextQuestionId === false && setFlowTerminated(true);
    };

    const selectValueOption = (question: IChatQuestion, valueOption: IChatAnswerOption) => {
        setAnswers(currentAnswers => [...currentAnswers, { name: question?.name, value: valueOption.value } as IChatAnswer]);
        goToNextStep(valueOption.nextId);
    };

    return (
        <div className={styles.container}>
            {renderAnswers()}
            {activeQuestionId === false ? renderGoodbye() : renderNextQuestion()}
        </div>
    );
}

export default Conversation;