export async function sendStoryAnswer(answer, context) {
  const response = await fetch("http://localhost:3001/story", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userAnswer: answer,
      storyContext: context,
    }),
  });

  return await response.blob();
}
