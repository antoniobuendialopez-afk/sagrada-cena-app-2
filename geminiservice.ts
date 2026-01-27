
import { GoogleGenAI } from "@google/genai";

export async function polishAnnouncement(draft: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres el secretario de la Agrupación Musical Sagrada Cena de Córdoba. Redacta el siguiente borrador de aviso interno de forma clara, elegante y motivadora para los músicos. Usa un tono profesional pero cercano:\n\n"${draft}"`,
    });
    return response.text || draft;
  } catch (error) {
    console.error("Error polishing announcement:", error);
    return draft;
  }
}

export async function generateInvitationEmail(memberName: string, role: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres el secretario de la Agrupación Musical Sagrada Cena de Córdoba. Redacta un mensaje de bienvenida breve y emocionante para ${memberName}, que se une a la banda como ${role}. Es IMPRESCINDIBLE que menciones que para entrar en la Intranet debe usar el código de acceso: CENA2024. El mensaje debe ser ideal para enviar por WhatsApp.`,
    });
    return response.text || `¡Bienvenido a la Sagrada Cena, ${memberName}! Estamos encantados de tenerte como ${role}. Descarga nuestra App y regístrate usando el código: CENA2024.`;
  } catch (error) {
    console.error("Error generating invitation:", error);
    return `¡Bienvenido a la banda! Usa el código CENA2024 para registrarte en nuestra aplicación.`;
  }
}
