
import { GoogleGenAI, Type } from "@google/genai";

const getAIInstance = () => {
  const apiKey = (window as any).process?.env?.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export async function analyzeCsvStructure(sampleRows: string[]) {
  const ai = getAIInstance();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these CSV headers and sample data from a YouTube Members export. 
      Identify which column indices correspond to: 
      1. Member Name
      2. Member Tier
      3. Channel ID/Link
      4. Membership Duration (Total Months)
      
      Data: ${JSON.stringify(sampleRows)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nameIndex: { type: Type.INTEGER },
            tierIndex: { type: Type.INTEGER },
            idIndex: { type: Type.INTEGER },
            monthsIndex: { type: Type.INTEGER },
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

export async function getTierInsights(members: any[]) {
  const ai = getAIInstance();
  const summary = members.reduce((acc: any, m: any) => {
    acc[m.tier] = (acc[m.tier] || 0) + 1;
    return acc;
  }, {});

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I have these members tiers: ${JSON.stringify(summary)}. 
      Generate a catchy one-sentence summary for the live stream ticker about my community.`,
    });

    return response.text || "Community roster is confirmed. Squadron active.";
  } catch (error) {
    return "Mission update: All members standing by for launch.";
  }
}
