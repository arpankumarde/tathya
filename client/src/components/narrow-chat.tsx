"use client"

import * as React from "react"
import { Streamdown } from "streamdown"
import { Send, Sparkles, User, AlertCircle, ChevronRight, Mic, MicOff, Volume2, Square } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Image from "next/image"

const INSURANCE_SUGGESTIONS = [
    "Show average claims per insurer",
    "Compare revenue by quarter",
    "Top 5 insurere in pie graph",
]

const GENERIC_SUGGESTIONS = [
    "Show distribution of values",
    "Top 10 rows by highest value",
    "Compare columns across categories",
]

function getInitialMessages(isDefaultDataset: boolean): Message[] {
    return [
        {
            id: 1,
            role: "assistant",
            text: isDefaultDataset
                ? "Hi! I can help you build and modify your dashboard. Describe what you want to see, and I'll generate it for you."
                : "Custom dataset loaded! Ask me anything about your data and I'll generate charts for you.",
            suggestions: isDefaultDataset ? INSURANCE_SUGGESTIONS : GENERIC_SUGGESTIONS,
        },
    ]
}

type Message = {
    id: number
    role: "user" | "assistant" | "error"
    text: string
    suggestions?: string[]
}

type Props = {
    onQuery: (query: string) => Promise<{
        summary: string
        suggestions: string[]
        error: string | null
    }>
    datasetId: string | null
}

export interface NarrowChatHandle {
    populate: (text: string) => void
}

export const NarrowChat = React.forwardRef<NarrowChatHandle, Props>(function NarrowChat({ onQuery, datasetId }, ref) {
    const [messages, setMessages] = React.useState<Message[]>(() => getInitialMessages(datasetId === null))
    const [input, setInput] = React.useState("")
    const [isTyping, setIsTyping] = React.useState(false)
    const [isListening, setIsListening] = React.useState(false)
    const [speakingId, setSpeakingId] = React.useState<number | null>(null)
    const bottomRef = React.useRef<HTMLDivElement>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const recognitionRef = React.useRef<any>(null)

    React.useImperativeHandle(ref, () => ({
        populate: (text: string) => {
            setInput(text)
            textareaRef.current?.focus()
        },
    }))

    // Reset chat when dataset changes
    React.useEffect(() => {
        setMessages(getInitialMessages(datasetId === null))
    }, [datasetId])

    // Speech recognition setup
    React.useEffect(() => {
        if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "speechRecognition" in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = "en-US"

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setInput(transcript)
                setIsListening(false)
                // Optionally auto-send
                // sendMessage(transcript)
            }

            recognitionRef.current.onerror = () => {
                setIsListening(false)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
            }
        }
    }, [])

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop()
        } else {
            setIsListening(true)
            recognitionRef.current?.start()
        }
    }

    const speakMessage = (id: number, text: string) => {
        if (!("speechSynthesis" in window)) return
        if (speakingId === id) {
            window.speechSynthesis.cancel()
            setSpeakingId(null)
            return
        }
        window.speechSynthesis.cancel()
        const plain = text.replace(/[#*_`~>\[\]]/g, "").replace(/\n+/g, " ").trim()
        const utterance = new SpeechSynthesisUtterance(plain)
        utterance.onend = () => setSpeakingId(null)
        utterance.onerror = () => setSpeakingId(null)
        setSpeakingId(id)
        window.speechSynthesis.speak(utterance)
    }

    // Auto-resize textarea
    React.useEffect(() => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = Math.min(el.scrollHeight, 120) + "px"
    }, [input])

    const sendMessage = async (text?: string) => {
        const trimmed = (text ?? input).trim()
        if (!trimmed || isTyping) return

        const userMsg: Message = { id: Date.now(), role: "user", text: trimmed }
        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        const result = await onQuery(trimmed)
        setIsTyping(false)

        if (result.error) {
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "error", text: result.error! },
            ])
        } else {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    text: result.summary || "Charts have been generated on the canvas.",
                    suggestions: result.suggestions,
                },
            ])
        }
    }

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    return (
        <div className="h-full flex flex-col border-l border-border bg-background w-80 shrink-0">
            {/* Header */}
            <div className="h-9 border-b border-border flex items-center justify-between px-3 shrink-0">
                <div className="flex items-center gap-2">
                    <Image src="/brand/logo.png" alt="Tathya" width={20} height={20} />
                    <span className="text-xs font-semibold text-foreground">Tathya Copilot</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-medium">Live</span>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0">
                <div className="p-3 space-y-4">
                    {messages.map((m) => (
                        <div key={m.id} className="space-y-2">
                            <div className={cn("flex gap-2 items-start", m.role === "user" && "flex-row-reverse")}>
                                {/* Avatar */}
                                {m.role !== "error" && (
                                    <div
                                        className={cn(
                                            "size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                            m.role === "assistant"
                                                ? "bg-emerald-50 dark:bg-emerald-950"
                                                : "bg-zinc-100 dark:bg-zinc-800"
                                        )}
                                    >
                                        {m.role === "assistant" ? (
                                            <Sparkles className="size-3 text-emerald-600" />
                                        ) : (
                                            <User className="size-3 text-zinc-500" />
                                        )}
                                    </div>
                                )}

                                {/* Bubble */}
                                {m.role === "error" ? (
                                    <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl px-3 py-2 text-[11px] text-red-600 dark:text-red-400">
                                        <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                                        <span>{m.text}</span>
                                    </div>
                                ) : (
                                    <div className={cn("max-w-[85%] flex flex-col gap-1", m.role === "assistant" && "group/bubble")}>
                                        <div
                                            className={cn(
                                                "rounded-xl px-3 py-2 text-[12px] leading-relaxed",
                                                m.role === "assistant"
                                                    ? "bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                                                    : "bg-foreground text-background"
                                            )}
                                        >
                                            {m.role === "assistant" ? <Streamdown>{m.text}</Streamdown> : m.text}
                                        </div>
                                        {m.role === "assistant" && (
                                            <button
                                                onClick={() => speakMessage(m.id, m.text)}
                                                className={cn(
                                                    "self-start flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md transition-colors",
                                                    speakingId === m.id
                                                        ? "text-emerald-600 dark:text-emerald-400"
                                                        : "text-zinc-400 dark:text-zinc-500 opacity-0 group-hover/bubble:opacity-100 hover:text-zinc-600 dark:hover:text-zinc-300"
                                                )}
                                            >
                                                {speakingId === m.id
                                                    ? <><Square className="size-2.5 fill-current" /> Stop</>
                                                    : <><Volume2 className="size-2.5" /> Read aloud</>
                                                }
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Follow-up suggestions */}
                            {m.suggestions && m.suggestions.length > 0 && (
                                <div className="pl-8 flex flex-col gap-1">
                                    {m.suggestions.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => { setInput(s); textareaRef.current?.focus() }}
                                            className="cursor-pointer flex items-center gap-1.5 text-left text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                                        >
                                            <ChevronRight className="size-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex gap-2 items-start">
                            <div className="size-6 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                                <Sparkles className="size-3 text-emerald-600" />
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl px-3 py-2.5 flex items-center gap-1">
                                <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                <span className="size-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="px-4 p-2 border-t border-border bg-background">
                <div className="flex items-end gap-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-2.5 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 transition-colors">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                            }
                        }}
                        placeholder="Describe your dashboard..."
                        rows={1}
                        className="flex-1 mb-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground outline-none resize-none min-h-[20px] max-h-[120px]"
                    />
                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleListening}
                            disabled={isTyping}
                            className={cn(
                                "size-7 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                isTyping
                                    ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                    : isListening
                                        ? "bg-red-500 text-white animate-pulse"
                                        : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            {isListening ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
                        </button>
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isTyping}
                            className="size-7 rounded-lg bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                        >
                            <Send className="size-3" />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-2">
                    Press Enter to send · Shift+Enter for new line
                </p>
            </div>
        </div>
    )
})
