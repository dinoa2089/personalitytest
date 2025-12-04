import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isMasterAdmin, ADMIN_FEATURES } from "@/lib/admin";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const requestedUserId = request.nextUrl.searchParams.get("userId");

    // Use the authenticated user or the requested user ID
    const targetUserId = userId || requestedUserId;

    if (!targetUserId) {
      return NextResponse.json({ isAdmin: false });
    }

    // Get user email from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(targetUserId);
    const primaryEmail = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    const isAdmin = isMasterAdmin(primaryEmail);

    return NextResponse.json({
      isAdmin,
      email: isAdmin ? primaryEmail : undefined,
      features: isAdmin ? ADMIN_FEATURES : undefined,
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false });
  }
}


