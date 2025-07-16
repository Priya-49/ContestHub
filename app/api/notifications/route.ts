// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/lib/models/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET handler to fetch notifications for the logged-in user OR check a specific notification
export async function GET(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const contestId = searchParams.get('contestId');
  const userEmail = searchParams.get('userEmail');

  try {
    if (contestId && userEmail && userEmail === session.user.email) {
      const existingNotification = await Notification.findOne({
        userEmail: session.user.email,
        contestId: parseInt(contestId),
      });
      return NextResponse.json({ isNotified: !!existingNotification });
    } else {
      // When fetching, the database will now return documents with 'contestDate' and 'contestTime'
      const notifications = await Notification.find({
        userEmail: session.user.email,
      }).sort({ createdAt: -1 });

      return NextResponse.json(notifications);
    }
  } catch (error: unknown) {
    console.error("Fetch Notifications Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// POST handler to save a new notification for the logged-in user
export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      contestId,
      contestName,
      contestUrl,
      notifyBefore,
      platform,
      contestDate,
      contestTime,
    } = await req.json();

   if (!contestId || !contestName || !contestUrl || !platform || !contestDate || !contestTime) {
      return NextResponse.json({ message: "Missing required fields for notification. Ensure contestId, name, URL, platform, date, and time are provided." }, { status: 400 });
    }
  
    const existingNotification = await Notification.findOne({
      userEmail: session.user.email,
      contestId: contestId,
    });

    if (existingNotification) {
      return NextResponse.json({ message: "Notification already set for this contest." }, { status: 409 });
    }

    const newNotification = new Notification({
      userEmail: session.user.email,
      contestId,
      contestName,
      contestUrl,
      notifyBefore: notifyBefore || "1h",
      platform: platform || "Unknown",
     contestDate,
      contestTime,
    });

    await newNotification.save();

    return NextResponse.json(
      { message: "Notification saved successfully!", notification: newNotification },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 11000) {
      return NextResponse.json({ message: "Notification already set for this contest." }, { status: 409 });
    }
    console.error("Save Notification Error:", error);
    return NextResponse.json({ error: "Failed to save notification." }, { status: 500 });
  }
}

// PUT handler to update an existing notification (no change to date/time logic)
export async function PUT(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { _id, notifyBefore } = await req.json();

    if (!_id || !notifyBefore) {
      return NextResponse.json({ message: "Missing notification ID or new preference." }, { status: 400 });
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: _id, userEmail: session.user.email },
      { notifyBefore: notifyBefore },
      { new: true }
    );

    if (!updatedNotification) {
      return NextResponse.json({ message: "Notification not found or unauthorized." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Notification updated successfully!", notification: updatedNotification },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Update Notification Error:", error);
    return NextResponse.json({ error: "Failed to update notification." }, { status: 500 });
  }
}

// DELETE handler to remove a notification (no change to date/time logic)
export async function DELETE(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { _id } = await req.json();

    if (!_id) {
      return NextResponse.json({ message: "Missing notification ID." }, { status: 400 });
    }

    const deletedNotification = await Notification.findOneAndDelete({
      _id: _id,
      userEmail: session.user.email,
    });

    if (!deletedNotification) {
      return NextResponse.json({ message: "Notification not found or unauthorized." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Notification deleted successfully!", _id: _id },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Delete Notification Error:", error);
    return NextResponse.json({ error: "Failed to delete notification." }, { status: 500 });
  }
}