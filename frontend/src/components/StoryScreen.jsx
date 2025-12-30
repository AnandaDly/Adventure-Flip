import { useEffect, useState, useRef } from "react"
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"

import imgNarrator from "../assets/characters/narrator.png" 
import imgNaga from "../assets/characters/naga.png"
import imgPeri from "../assets/characters/peri.png"
import imgDefault from "../assets/characters/default.png"

const CHARACTER_IMAGES = {
  narrator: imgNarrator,
  naga: imgNaga,
  peri: imgPeri,
  default: imgDefault
}

export default function StoryScreen({ theme }) {
  // State
  const [segments, setSegments] = useState([]) 
  const [currentSegment, setCurrentSegment] = useState(null)
  const [storyHistory, setStoryHistory] = useState("")
  const [mode, setMode] = useState("loading")
  const [turnCount, setTurnCount] = useState(1);
  const isPlayingRef = useRef(false)

  // --- LOGIC REQUEST ---
  async function requestStory(userAnswer = null) {
    setMode("loading")
    setCurrentSegment(null)

    try {
      const contextToSend = storyHistory + (userAnswer ? `\nAnak: "${userAnswer}"` : "")

      const res = await fetch("http://localhost:3001/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyContext: trimHistory(contextToSend),
          userAnswer,
          theme,
          turnCount: turnCount
        })
      })
      const data = await res.json()

      if (data.segments && data.segments.length > 0) {
        const fullText = data.segments.map(s => s.text).join(" ")
        setStoryHistory(contextToSend + "\n" + fullText)
        
        playQueue(data.segments)
      }
      setTurnCount(prev => prev + 1);
    } catch (err) {
      console.error("Error:", err)
    }
  }

  function trimHistory(history, maxLength = 2000) {
    if (history.length <= maxLength) return history;
    return "...(cerita sebelumnya)...\n" + history.slice(-maxLength);
  }
  function playQueue(queue) {
    if (queue.length === 0) {
      setMode("listening")
      setCurrentSegment(null)
      startListening()
      return
    }

    const [first, ...rest] = queue
    setCurrentSegment(first)
    setMode("speaking")
    
    if (first.audio) {
      const audio = new Audio("data:audio/mpeg;base64," + first.audio)
      audio.onended = () => playQueue(rest)
      audio.play().catch(e => {
        console.error("Playback error", e)
        playQueue(rest)
      })
    } else {
      setTimeout(() => playQueue(rest), 2000)
    }
  }

  // --- SPEECH RECOGNITION ---
  const { startListening } = useSpeechRecognition((userSpeech) => {
    setStoryHistory(prev => prev + `\nAnak: "${userSpeech}"`)
    requestStory(userSpeech)
  })

  useEffect(() => {
    requestStory()
  }, [])

  const getCharacterImage = () => {
    const speaker = currentSegment?.speaker?.toLowerCase() || "default"
    return CHARACTER_IMAGES[speaker] || CHARACTER_IMAGES.default
  }

  const getOrbStyle = () => {
    if (mode === "listening") return "orb-listening"
    if (mode === "loading") return "orb-loading"
    
    switch (currentSegment?.speaker) {
      case "naga": return "orb-dragon"
      case "peri": return "orb-fairy"
      default: return "orb-narrator"
    }
  }

  return (
  <div className={`story-stage bg-${currentSegment?.speaker || "default"}`}>
    
    {/* Progress */}
    <div className="story-progress">
      <div className={`dot ${mode === "speaking" ? "active" : ""}`}></div>
      <div className={`dot ${mode === "listening" ? "active" : ""}`}></div>
      <div className={`dot ${mode === "loading" ? "active" : ""}`}></div>
    </div>

    {/* Karakter */}
    <div className={`character-wrapper ${mode}`}>
      <img
        src={getCharacterImage()}
        alt="character"
        className="character-main"
      />
    </div>

    {/* Subtitle Cerita */}
    <div className="story-caption">
      {mode === "loading" && "Pendongeng sedang berpikir..."}
      {mode === "listening" && "Sekarang giliran kamu bicara 🎤"}
      {mode === "speaking" && currentSegment?.text}
    </div>

    {/* Voice Indicator */}
    <div className={`voice-indicator ${mode}`}>
      {mode === "speaking" && "🔊 Cerita berlangsung"}
      {mode === "listening" && "🎧 Mendengarkan suaramu"}
    </div>
    <div className="disclaimer-footer">
        <p>⚠️ <b>Perhatian Orang Tua:</b> Aplikasi ini menggunakan AI. Harap awasi penggunaan anak.</p>
    </div>
  </div>
)
}