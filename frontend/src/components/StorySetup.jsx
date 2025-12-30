import imgNaga from "../assets/story/naga.jpg"
import imgSpace from "../assets/story/space.jpg"
import imgSurprise from "../assets/story/surprise.jpg"

export default function StorySetup({ onSelect }) {
  return (
    <div className="screen story-setup">
      <h2>Pilih Cerita</h2>

      <div className="story-grid">
        <div
          className="story-card-grid"
          onClick={() => onSelect("naga")}
        >
          <img src={imgNaga} alt="Petualangan Naga" />
          <div className="story-card-overlay" />
          <div className="story-card-center">
            <h3>🐉 Petualangan Naga</h3>
            <p>Dunia fantasi penuh keberanian</p>
          </div>
        </div>

        <div
          className="story-card-grid"
          onClick={() => onSelect("luar angkasa")}
        >
          <img src={imgSpace} alt="Luar Angkasa" />
          <div className="story-card-overlay" />
          <div className="story-card-center">
            <h3>🚀 Luar Angkasa</h3>
            <p>Menjelajah galaksi tak terbatas</p>
          </div>
        </div>

        <div
          className="story-card-grid"
          onClick={() => onSelect("kejutan")}
        >
          <img src={imgSurprise} alt="Kejutan Cerita" />
          <div className="story-card-overlay" />
          <div className="story-card-center">
            <h3>🎲 Kejutan Cerita</h3>
            <p>AI memilih petualanganmu</p>
          </div>
        </div>
      </div>

      <div className="disclaimer-footer">
        <p>
          ⚠️ <b>Perhatian Orang Tua:</b> Aplikasi ini menggunakan AI.
          Harap awasi penggunaan anak.
        </p>
      </div>
    </div>
  )
}
