import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  Info,
  LogOut,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  Users,
} from "lucide-react";

function Chat({ auth, logout }) {
  const appName = "TalkNest";
  const groupTitle = "Group Chat";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      auth: {
        token: auth.token,
      },
    });

    socketRef.current = socket;

    socket.on("message_history", (oldMessages) => {
      setMessages(oldMessages);
    });

    socket.on("group_members", (onlineMembers) => {
      setMembers(onlineMembers);
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("connect_error", () => {
      logout();
    });

    return () => {
      socket.disconnect();
    };
  }, [auth.token, logout]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit("send_message", {
      text: message.trim(),
    });

    setMessage("");
  };

  const handleLogout = () => {
    socketRef.current?.disconnect();
    logout();
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black text-white sm:p-4 lg:p-6">
      <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-violet-700 opacity-40 blur-[130px] sm:h-130 sm:w-130 lg:h-170 lg:w-170" />
      <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-blue-700 opacity-30 blur-[130px] sm:h-105 sm:w-105 lg:left-72 lg:h-130 lg:w-130" />

      <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-white/5 backdrop-blur-xl sm:h-[94dvh] sm:w-[96%] sm:rounded-2xl sm:border sm:border-white/15 lg:h-[86vh] lg:w-[92%] lg:flex-row xl:w-[90%]">
        <div className="flex max-h-[38dvh] w-full shrink-0 flex-col border-b border-white/10 p-3 sm:max-h-[34dvh] sm:p-4 lg:max-h-none lg:h-full lg:w-70 lg:border-b-0 lg:border-r xl:w-[27%] xl:min-w-65">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-500">
                <MessageCircle size={18} />
              </div>
              <h2 className="truncate font-semibold">{appName}</h2>
            </div>

            <MoreVertical size={18} className="shrink-0 text-gray-300" />
          </div>

          <div className="mb-4 flex w-full items-center gap-2 rounded-full bg-violet-950/60 p-2 sm:mb-5">
            <Search size={16} className="shrink-0 text-gray-400" />
            <input
              placeholder="Search User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
            />
          </div>

          <p className="mb-2 text-xs text-gray-400">
            Group Members: {members.length}
          </p>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex min-w-0 items-center gap-3 rounded p-2 hover:bg-white/10"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gray-600 text-xs">
                    {initials(member.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      {member.name}
                      {member.id === auth.user.id && " (You)"}
                    </p>
                    <p className="text-xs text-green-400">Online</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex w-full items-center justify-between border-b border-white/10 p-3 sm:p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-500">
                <Users size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate">{groupTitle}</p>
                <span className="text-xs text-green-400">
                  {members.length} online
                </span>
              </div>
            </div>

            <Info size={18} className="shrink-0" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-300">
                <MessageCircle
                  size={56}
                  className="mb-3 text-violet-400 sm:h-16 sm:w-16"
                />
                <p>Chat anytime, anywhere</p>
              </div>
            )}

            <div className="space-y-3">
              {messages.map((msg) => {
                if (msg.type === "system") {
                  return (
                    <p
                      key={msg.id}
                      className="text-center text-xs text-gray-400"
                    >
                      {msg.text}
                    </p>
                  );
                }

                const isMine =
                  msg.senderId === auth.user.id ||
                  (!msg.senderId && msg.senderName === auth.user.name);

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] rounded-lg p-3 sm:max-w-sm lg:max-w-md ${
                        isMine ? "bg-violet-600" : "bg-gray-700"
                      }`}
                    >
                      <p className="mb-1 truncate text-xs text-violet-200">
                        {isMine ? "You" : msg.senderName}
                      </p>

                      <p className="whitespace-pre-wrap wrap-break-word text-sm">
                        {msg.text}
                      </p>

                      <p className="mt-1 text-right text-[10px] text-gray-300">
                        {msg.time}
                      </p>

                      {isMine && (
                        <p className="mt-1 wrap-break-word text-[10px] text-violet-200">
                          {msg.sentTo?.length
                            ? `Sent to ${msg.sentTo.join(", ")}`
                            : "Only you are in this group"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div ref={bottomRef} />
          </div>

          <div className="flex w-full gap-2 border-t border-white/10 p-3">
            <input
              className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-400 sm:py-2"
              placeholder="Send a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button
              onClick={sendMessage}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600 sm:h-10 sm:w-10"
              aria-label="Send message"
            >
              <Send size={18} fill="white" />
            </button>
          </div>
        </div>

        <div className="hidden w-[24%] min-w-60 flex-col border-l border-white/10 p-4 text-center xl:flex">
          <div className="flex-1 pt-8">
            <div className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-full bg-gray-600 text-xl font-bold">
              {initials(auth.user.name)}
            </div>

            <h3 className="wrap-break-word">{auth.user.name}</h3>
            <p className="wrap-break-word text-sm text-gray-400">
              {auth.user.email}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Hi Everyone, I am using {appName}
            </p>

            <div className="mt-8 border-t border-white/10 pt-4 text-left">
              <p className="text-sm">Media</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-fuchsia-400 to-violet-600 px-6 py-2"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="absolute right-3 top-3 flex items-center justify-center rounded-full bg-white/10 p-2 text-gray-200 backdrop-blur hover:bg-white/15 xl:hidden"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
