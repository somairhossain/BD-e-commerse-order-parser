/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface ParsedOrder {
  orderPerson: string;
  orderCountry: string;
  orderStatus: string;
  orderId: string;
  name: string;
  mobileNumber: string;
  detailAddress: string;
  district: string;
  thana: string;
  orderSet: string;
  note: string;
  salesPerson: string;
  qty: string;
  total: string;
  rawCsvRow: string;
}

export async function parseBengaliOrders(text: string): Promise<ParsedOrder[]> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please add it to your secrets.");
  }

  const prompt = `${SYSTEM_PROMPT}\n\nINPUT TEXT TO PARSE:\n${text}\n\nOUTPUT (CSV ROWS ONLY):`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use a stable current model name or one from the skill
      contents: prompt,
    });

    const csvContent = response.text || "";

    // Split rows and parse them
    return csvContent.split('\n').filter(row => row.trim().length > 0).map(row => {
      const columns = parseCSVRow(row);
      
      return {
        orderPerson: columns[0] || "",
        orderCountry: columns[1] || "",
        orderStatus: columns[2] || "",
        orderId: columns[3] || "",
        name: columns[4] || "",
        mobileNumber: columns[5] || "",
        detailAddress: columns[6] || "",
        district: columns[7] || "",
        thana: columns[8] || "",
        orderSet: columns[9] || "",
        note: columns[10] || "",
        salesPerson: columns[11] || "",
        qty: columns[12] || "",
        total: columns[13] || "",
        rawCsvRow: row
      };
    });
  } catch (error) {
    console.error("Error parsing orders with Gemini:", error);
    throw error;
  }
}

/**
 * Simple CSV row parser that handles quoted values
 */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}
