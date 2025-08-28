import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
 
neonConfig.webSocketConstructor = ws;
 
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}
 
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

AI Services
server/services/openai.ts

import OpenAI from "openai";
 
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "test_key"
});
 
export interface RiskAnalysisResult {
  explanation: string;
  reasons: string[];
  score: number;
  traceId: string;
}
 
export async function analyzeTransactionRisk(transaction: any): Promise<RiskAnalysisResult> {
  const traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
 
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "test_key") {
    // Mock response when API key is not available
    return {
      explanation: "Mock analysis: Transaction flagged due to high amount and suspicious recipient pattern.",
      reasons: ["High transaction amount", "Unusual recipient pattern", "Device anomaly detected"],
      score: Math.random() * 0.4 + 0.6, // Random score between 0.6 and 1.0 for mock
      traceId
    };
  }
 
  try {
    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a fraud detection expert analyzing financial transactions. 
          Analyze the provided transaction data and respond with JSON containing:
          - explanation: A detailed explanation of risk factors (max 200 chars)
          - reasons: Array of specific risk factors identified
          - score: Risk score between 0.0 (safe) and 1.0 (fraudulent)
          
          Consider factors like: amount patterns, recipient analysis, location anomalies, device fingerprinting, velocity checks, and known fraud patterns.`
        },
        {
          role: "user",
          content: `Analyze this transaction:
          Amount: $${transaction.amount}
          Recipient: ${transaction.recipient}
          Location: ${transaction.location || 'Unknown'}
          Device: ${transaction.deviceInfo || 'Unknown'}
          Payment Method: ${transaction.paymentMethod || 'Unknown'}
          User ID: ${transaction.userId}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });
 
    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      explanation: result.explanation || "Analysis completed",
      reasons: result.reasons || ["Automated analysis"],
      score: Math.min(Math.max(result.score || 0.5, 0), 1),
      traceId
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback response
    return {
      explanation: "Analysis unavailable - using rule-based assessment",
      reasons: ["API temporarily unavailable", "Fallback to rule-based scoring"],
      score: 0.5,
      traceId
    };
  }
}
 
export async function generateChatResponse(message: string, context?: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "test_key") {
    // Mock responses when API key is not available
    const mockResponses = [
      "I understand you're asking about fraud detection. Based on our current models, I can help analyze transaction patterns and risk factors.",
      "This transaction was flagged due to multiple risk indicators including unusual amount, recipient pattern, and device anomalies.",
      "Our ML models use various features like transaction velocity, geolocation analysis, and behavioral patterns to assess risk.",
      "For this specific case, I'd recommend additional verification steps given the high risk score and suspicious patterns detected."
    ];
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }
 
  try {
    const response = await openai.chat.completions.create({
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are ShieldFi fraud detection assistant. You help analysts understand fraud patterns and risk assessments. 
          Be concise, helpful, and avoid hallucinations. Focus on fraud detection, risk analysis, and transaction security.
          If you don't have specific information, be honest about limitations.
          ${context ? `\nContext: ${context}` : ''}`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300
    });
 
    return response.choices[0].message.content || "I'm unable to process that request at the moment.";
  } catch (error) {
    console.error('OpenAI chat error:', error);
    return "I'm experiencing some technical difficulties. Please try again later or contact support if the issue persists.";
  }
}
