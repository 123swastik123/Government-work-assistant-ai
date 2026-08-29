import { ChatInterface } from "@/components/chat/ChatInterface";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chat — Government Work Helper" };

export default function ChatPage() {
  return <ChatInterface />;
}
