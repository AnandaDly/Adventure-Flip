let elevenConfig = null;
const VOICE_MAP = {
  narrator: "21m00Tcm4TlvDq8ikWAM",
  naga: "onwK4e9ZLuTAKqWW03F9",
  raksasa: "onwK4e9ZLuTAKqWW03F9",
  peri: "MF3mGyEYCl7XYWbV9V6O",
  robot: "AZnzlk1XvdvUeBnXmlld",
  default: "21m00Tcm4TlvDq8ikWAM",
};

function getElevenConfig() {
  if (!elevenConfig) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY is missing");
    elevenConfig = { apiKey };
  }
  return elevenConfig;
}

function getVoiceId(speaker) {
  const key = speaker ? speaker.toLowerCase() : "default";
  return VOICE_MAP[key] || VOICE_MAP.default;
}

export async function speakWithAgent(text, speaker = "narrator") {
  const { apiKey } = getElevenConfig();
  const voiceId = getVoiceId(speaker);

  const modelId =
    speaker === "narrator" ? "eleven_turbo_v2_5" : "eleven_multilingual_v2";

  let voiceSettings = {
    stability: 0.5, // Default
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
  };

  if (speaker === "narrator") {
    voiceSettings = {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.0,
    };
  } else if (speaker === "naga") {
    voiceSettings = {
      stability: 0.3,
      similarity_boost: 0.8,
      style: 0.5,
    };
  } else if (speaker === "peri") {
    voiceSettings = {
      stability: 0.4,
      similarity_boost: 0.7,
      style: 0.4,
    };
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: voiceSettings,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("ElevenLabs error:", err);
    throw new Error("ElevenLabs TTS error");
  }

  const audioBuffer = await response.arrayBuffer();
  return Buffer.from(audioBuffer).toString("base64");
}
