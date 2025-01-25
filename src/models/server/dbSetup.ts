import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import { databases } from "./config";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB (){
    try {
        await databases.get(db)
        console.log("Database connected");
    } catch (error) {
        try {
            await databases.create(db, db)

            await Promise.all([
                createAnswerCollection(),
                createCommentCollection(),
                createQuestionCollection(),
                createVoteCollection(),
            ])
            console.log("Collection created");
            console.log("Databse connected");
            
        } catch (error) {
            console.log("Error while creating DB or Collection" + error);   
        }
    }

    return databases
}