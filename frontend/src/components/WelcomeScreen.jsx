export default function WelcomeScreen({ onStart }) {
  return (
    <div className="screen center">
      <h1>🎧 Cerita Interaktif</h1>
      <p>Dengarkan cerita dan jawab dengan suaramu</p>

      <button className="start-button" onClick={onStart}>
        🎤 Mulai Cerita
      </button>

      <div className="disclaimer-footer">
        <p>⚠️ <b>Perhatian Orang Tua:</b> Aplikasi ini menggunakan AI. Harap awasi penggunaan anak.</p>
      </div>
    </div>
  )
}