import { db, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request : NextRequest){
    try {
        const { votedById, voteStatus, type, typeId } = await request.json()

        //list document
        const response = await databases.listDocuments(
            db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById),
            ]
        )

        if(response.documents.length > 0){
           
        }

        // previous does not exists or vote status change 
        if(response.documents[0]?.voteStatus !== voteStatus){
            //
        }

        


    } catch (error : any) {
        return NextResponse.json({
            error : error?.message || "Error in Voting"
        },{
            status : error?.status || error?.code || 500
        }) 
    }
}