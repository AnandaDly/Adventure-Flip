export async function playAudioFromApi(blob) {
  return new Promise((resolve) => {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.onended = resolve;
    audio.play();
  });
}
