import { useState } from "react"
import WelcomeScreen from "./components/WelcomeScreen"
import StorySetup from "./components/StorySetup"
import TransitionScreen from "./components/TransitionScreen"
import StoryScreen from "./components/StoryScreen"

export default function App() {
  const [step, setStep] = useState("welcome")
  const [theme, setTheme] = useState(null)

  function startSetup() {
    setStep("setup")
  }

  function startStory(selectedTheme) {
    setTheme(selectedTheme)
    setStep("transition")

    setTimeout(() => {
      setStep("story")
    }, 2000)
  }

  return (
    <>
      {step === "welcome" && <WelcomeScreen onStart={startSetup} />}
      {step === "setup" && <StorySetup onSelect={startStory} />}
      {step === "transition" && <TransitionScreen />}
      {step === "story" && <StoryScreen theme={theme} />}
    </>
  )
}
