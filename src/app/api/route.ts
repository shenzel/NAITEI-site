import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// .tsxにするとページコンポートとして認識される
// APIキー
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

export async function POST(request: NextRequest) {
  try {
    // APIキーの存在確認
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

    const { text } = await request.json();
    if (!text) { // テキストが空の場合
        return Response.json({ error: 'Text is required' }, { status: 400 });
    }
    const correctedText = await generateProofreadText(text);
    return Response.json({ correctedText });
  } catch (error) {
    console.error('API Error:', error);
    // APIエラー
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}

export async function generateProofreadText(text: string): Promise<string> {
  const prompt = `以下の文章を校正してください。誤字脱字、文法の間違い、より読みやすい文章にしてください。大きな意味の変更はしないでください。校正後の文章のみを返してください。説明は不要です。\n\n文章:\n${text}`;

  // モデル指定
  const result = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt, // ここにプロンプト
  });

  // result.candidates[0].content.parts[0].text から校正済みテキストを取得
  // 無理やりすぎる...
  const correctedText = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  return correctedText.trim(); // 余分な空白を削除して返す
}