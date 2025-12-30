export function useSpeechRecognition(onResult) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported")
    return { startListening: () => {} }
  }

  const recognition = new SpeechRecognition()
  recognition.lang = "id-ID"
  recognition.interimResults = false
  recognition.continuous = false

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript
    onResult(text)
  }

  recognition.onerror = (e) => {
    console.error("Speech error", e)
  }

  function startListening() {
    recognition.start()
  }

  return { startListening }
}