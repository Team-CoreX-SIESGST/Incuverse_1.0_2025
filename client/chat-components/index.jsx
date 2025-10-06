"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./sidebar";
import ChatHeader from "./ChatHeader";
import MessagesArea from "./MessagesArea";
import InputArea from "./InputArea";
import { Menu } from "lucide-react";
import {
  message_python,
  createSection,
  getSections,
  getSection,
} from "@/services/chat/chatServices";
import { CreateChat } from "@/services/python_server/pythonServer";
import { data } from "autoprefixer";
import { sendMessage } from "@/services/chat/chatServices";
import { useToast } from "@/components/ui/ToastProvider";

// FastAPI base URL and helpers
const BASE_URL = "http://localhost:8000";
const DEFAULT_WORKSPACE_ID = "demo";

const getAuthToken = () => {
  // Try common storage keys; adjust if your app stores under a different key
  return (
    (typeof window !== "undefined" &&
      (localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("AUTH_TOKEN"))) ||
    ""
  );
};

const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function apiUploadFile(file, workspaceId = DEFAULT_WORKSPACE_ID) {
  const form = new FormData();
  form.append("workspace_id", workspaceId);
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/api/v1/upload`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function apiSearch(query, options = {}) {
  const body = {
    workspace_id: options.workspaceId || DEFAULT_WORKSPACE_ID,
    query,
    top_k: options.top_k ?? 10,
    include_web: options.include_web ?? true,
    rerank: options.rerank ?? true,
    summarize: options.summarize ?? true,
  };
  const res = await fetch(`${BASE_URL}/api/v1/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Search failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function ChatInterface({ isSidebarOpen, setIsSidebarOpen }) {
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({
    _id: "68e1db48c9f44032e3acc7a9",
    title: "New Chat",
    user: "68e2bb06e98cb3c9e9479221",
    createdAt: "2025-10-05T02:43:20.076Z",
    updatedAt: "2025-10-05T02:45:36.954Z",
    __v: 0,
  });
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const router = useRouter();

  const { showToast } = useToast();

  useEffect(() => {
    const init = async () => {
      await loadSections(); // Load all sections
      if (currentSection?._id) {
        await selectSection(currentSection); // Fetch chats for default section
      }
    };
    init();

    // Initialize speech recognition if available
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setMessage(transcript);

        silenceTimeoutRef.current = setTimeout(() => {
          if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
          }
        }, 3000);
      };

      recognitionRef.current.onend = () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        if (isListening) {
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error("Error restarting speech recognition:", error);
              setIsListening(false);
            }
          }, 100);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSections = async () => {
    setIsLoadingSections(true);
    try {
      const response = await getSections();
      setSections(response.data.data);
    } catch (error) {
      console.error("Error loading sections:", error);
    } finally {
      setIsLoadingSections(false);
    }
  };

  const onClickBack = async () => {
    router.push("/");
  };

  const createNewSection = async () => {
    try {
      showToast("This feature is not for public use!")
      return;
      const response = await createSection();
      console.log(response, "foiewhofi");
      setSections((prev) => [response.data, ...prev]);
      setCurrentSection(response.data);
      setChats([]);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  const selectSection = async (section) => {
    try {
      setCurrentSection(section);
      const response = await getSection(section._id);
      console.log(response, "res");
      setChats(response.data.data.chats);
    } catch (error) {
      console.error("Error loading section:", error);
    }
  };

  const handleSendMessage = async () => {
    showToast("This feature is not for public use!");
    return;
    if ((!message.trim() && selectedFiles.length === 0) || isLoading) return;

    let sectionToUse = currentSection;
    let uploadedFiles = [];

    // Upload files to FastAPI if any
    // if (selectedFiles.length > 0) {
    //   try {
    //     uploadedFiles = await Promise.all(
    //       selectedFiles.map(async (file) => {
    //         const res = await message_python(file);
    //         console.log(res, "user");
    //         return res; // contains file_id, filename, status, details
    //       })
    //     );
    //   } catch (error) {
    //     console.error("Error uploading files:", error);
    //     return;
    //   }
    // }

    // Create new local section if none exists
    if (!currentSection) {
      try {
        const title = message.substring(0, 30) || "Files upload";
        const newSection = await createSection();
        sectionToUse = newSection.data;
        setCurrentSection(sectionToUse);
        setSections((prev) => [sectionToUse, ...prev]);
      } catch (error) {
        console.error("Error creating section:", error);
        return;
      }
    }

    const messageToSend = message;
    const userMessage = {
      _id: Date.now() + "-user",
      message: messageToSend,
      isUser: true,
      createdAt: new Date(),
      files: uploadedFiles,
    };

    setChats((prev) => [...prev, userMessage]);
    setMessage("");
    setSelectedFiles([]);
    setIsLoading(true);

    try {
      const searchRes = await sendMessage(currentSection._id, {
        message: userMessage.message,
      });
      // console.log(searchRes,"rrrrr")
      const aiMessage = {
        _id: Date.now() + "-ai",
        message: searchRes.data.data.aiMessage.message || "",
        isUser: false,
        createdAt: new Date(),
      };
      setChats((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startEditing = (section, e) => {
    e.stopPropagation();
    setEditingSection(section._id);
    setEditTitle(section.title);
  };

  const saveTitle = async () => {
    if (!editTitle.trim()) return;
    try {
      setSections((prev) =>
        prev.map((s) =>
          s._id === editingSection ? { ...s, title: editTitle } : s
        )
      );
      setCurrentSection((prev) =>
        prev && prev._id === editingSection
          ? { ...prev, title: editTitle }
          : prev
      );
    } catch (error) {
      console.error("Error updating title:", error);
    }
    setEditingSection(null);
    setEditTitle("");
  };

  const handleDeleteSection = async (sectionId, e) => {
    e.stopPropagation();
    try {
      setSections((prev) => prev.filter((s) => s._id !== sectionId));
      if (currentSection?._id === sectionId) {
        setCurrentSection(null);
        setChats([]);
      }
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      // Manual stop - clear timeout and stop recognition
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Start recognition
      try {
        recognitionRef.current.start();
        setIsListening(true);

        // Set initial timeout in case no speech is detected at all
        silenceTimeoutRef.current = setTimeout(() => {
          if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
          }
        }, 3000);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const formatTime = (date = new Date()) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onClickBack={onClickBack}
        createNewSection={createNewSection}
        isLoadingSections={isLoadingSections}
        sections={sections}
        currentSection={currentSection}
        editingSection={editingSection}
        editTitle={editTitle}
        hoveredSection={hoveredSection}
        onSelectSection={selectSection}
        onStartEditing={startEditing}
        onSaveTitle={saveTitle}
        onDeleteSection={handleDeleteSection}
        setEditTitle={setEditTitle}
        setHoveredSection={setHoveredSection}
        formatTime={formatTime}
      />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <ChatHeader
          currentSection={currentSection}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Toggle sidebar button for desktop when sidebar is closed */}
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <MessagesArea
            chats={chats}
            isLoading={isLoading}
            formatTime={formatTime}
            setMessage={setMessage}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <InputArea
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          isListening={isListening}
          toggleSpeechRecognition={toggleSpeechRecognition}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </div>
    </div>
  );
}
