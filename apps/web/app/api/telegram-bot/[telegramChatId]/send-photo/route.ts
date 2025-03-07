// apps/web/app/api/telegram-bot/[telegramChatId]/send-photo/route.ts

export const dynamic = 'force-dynamic';
import TelegramThread from "@/models/telegramThread";
import dbConnect from "@/utils/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
    request: Request,
    { params }: { params: { telegramChatId: string } }
) {
    await dbConnect();
    console.log("[DEBUG] send-photo route hit with params:", params);

    try {
        const { telegramChatId } = params;
        const { mediaUrl, caption } = await request.json();

        if (!telegramChatId || !mediaUrl) {
            return NextResponse.json(
                { error: "Missing required fields (telegramChatId or mediaUrl)" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized access. Please log in." },
                { status: 401 }
            );
        }

        const senderName = `${session.user.firstName} ${session.user.lastName}`.trim();
        const updatedCaption = `-- ${senderName}`;

        const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;

        const telegramResponse = await fetch(TELEGRAM_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                photo: mediaUrl,
                caption: updatedCaption,
            }),
        });
        console.log(telegramResponse.body)


        if (!telegramResponse.ok) {
            const errorText = await telegramResponse.text();
            console.error("Telegram API error:", errorText);
            return NextResponse.json(
                { error: "Failed to send photo to Telegram", details: errorText },
                { status: telegramResponse.status }
            );
        }

        const publicMediaUrl = mediaUrl.split("?")[0];

        let thread = await TelegramThread.findOne({ chatId: telegramChatId });
        if (!thread) {
            thread = new TelegramThread({ chatId: telegramChatId, messages: [] });
        }

        const newMessage = {
            text: updatedCaption || "Image",
            sender: senderName,
            timestamp: new Date(),
            type: "image",
            mediaUrl: publicMediaUrl,
        };

        thread.messages.push(newMessage);
        await thread.save();

        const savedMessage = thread.messages[thread.messages.length - 1];
        return NextResponse.json(
            { message: "Image sent and saved successfully", savedMessage },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error handling send-photo request:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}