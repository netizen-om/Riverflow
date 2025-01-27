import { answerCollection, db } from "@/models/name";
import { databases } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json();
        const {questionId, answer, authorId } = reqBody

        const response = await databases.createDocument(db, answerCollection, ID.unique(), {
            content : answer,
            authorId : authorId,
            questionId : questionId
        })

    } catch (error : any) {
        return NextResponse.json({
            error : error?.message || "Error creating answer"
        },{
            status : error?.status || error?.code || 500
        }) 
    }
}