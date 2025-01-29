import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

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
            await databases.deleteDocument(db, voteCollection, response.documents[0].$id)

            const questionOrAnswer = await databases.getDocument(
                db, type === "question" ? questionCollection : answerCollection, typeId
            )

            const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorId)

            await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                reputation : response.documents[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation) - 1 : Number(authorPrefs.reputation) + 1 
            })
        }

        // previous does not exists or vote status change 
        if(response.documents[0]?.voteStatus !== voteStatus){
            const doc = await databases.createDocument(db, voteCollection, ID.unique(), {
                type,
                typeId,
                voteStatus,
                votedById
            })

            const questionOrAnswer = await databases.getDocument(
                db, type === "question" ? questionCollection : answerCollection, typeId
            )

            const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorId)

            // if vote was present 
            if(response.documents[0]){
                await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                    reputation : response.documents[0].voteStatus === "upvoted" 
                    ? Number(authorPrefs.reputation) - 1 
                    : Number(authorPrefs.reputation) + 1 
                    // these means prev vote was "upvoted"  and the new value is "downvoted" so we have to decrease the reputation
                });
            } else {
                await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                    reputation:
                        // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                        voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) + 1
                            : Number(authorPrefs.reputation) - 1,
                });
            }
        }

        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.equal("votedById", "votedById"),
                Query.limit(1)
            ]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.equal("votedById", "votedById"),
                Query.limit(1)
            ])

        ])
        
        return NextResponse.json(
            {
                data : {
                    document : null,
                    voteResult : upvotes.total = downvotes.total
                },
                message : "Vote handled"
            },
            {
                status : 200
            }
        )

    } catch (error : any) {
        return NextResponse.json({
            error : error?.message || "Error in Voting"
        },{
            status : error?.status || error?.code || 500
        }) 
    }
}