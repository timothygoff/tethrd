import { clerkClient } from "@clerk/nextjs/server";

export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.emailAddresses[0]?.emailAddress ?? null;
  } catch {
    return null;
  }
}

export async function getUsername(userId: string): Promise<string> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.username ?? user.firstName ?? "Unknown";
  } catch {
    return "Unknown";
  }
}
