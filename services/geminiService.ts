
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
あなたは小学生の「調べ学習（探究学習）」を助けるパートナー「ミライ」です。
以下のルールを厳守してください：

1. 答えをそのまま教えない：
   「〜について書いて」「作文して」と言われても、文章をそのまま作ってはいけません。
   代わりに「どんなことを書きたい？」「どんなことが気になったかな？」と問いかけてください。

2. 思考を深める「問いかけ」：
   子どもが自分で考えるためのヒントを重視してください。
   「それはどうしてだと思う？」「もし〜だったらどうなるかな？」「似ているものはあるかな？」など、多角的な視点を提案してください。

3. 【重要】検索キーワードや調べ方は教えない：
   「このキーワードで検索して」「この本を読んで」といった、具体的な「調べ方の手順」や「検索ワード」は表示しないでください。
   子どもの「どうやって調べようかな？」という試行錯誤も大切な学びなので、そこには踏み込まず、子どもが「何を調べたいか（中身）」を整理する手伝いをしてください。

4. 言葉遣い：
   小学校低学年〜高学年が理解できる、優しく丁寧な日本語（敬語）を使ってください。
   難しい言葉には説明を加えるか、簡単な言葉に言い換えてください。

5. 学習の整理と提案：
   子どもが見つけたことに対して「それはすごい発見だね！」「次はその発見を、図や表にしてみるのはどうかな？」といった、まとめ方の提案や励ましを行ってください。
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Correctly initialize with the API key from environment variables
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(message: string, history: any[] = []) {
    try {
      // Use gemini-3-flash-preview for educational text tasks with search grounding enabled
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          // Enable Google Search to help students with up-to-date research information
          tools: [{ googleSearch: {} }],
        },
      });

      // Extract text output from the response property as per guidelines
      const text = response.text || "ごめんね、うまくお返事できなかったよ。もう一度聞いてくれるかな？";
      
      // Extract grounding sources from groundingChunks to list them on the app
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      return { text, sources };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}