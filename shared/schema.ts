import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
 
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});
 
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  recipient: text("recipient").notNull(),
  memo: text("memo"),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'blocked', 'flagged'
  riskScore: decimal("risk_score", { precision: 3, scale: 2 }),
  location: text("location"),
  deviceInfo: text("device_info"),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow(),
});
 
export const riskAssessments = pgTable("risk_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull().references(() => transactions.id),
  ruleEngine: jsonb("rule_engine"),
  mlModel: jsonb("ml_model"),
  llmAnalysis: jsonb("llm_analysis"),
  finalScore: decimal("final_score", { precision: 3, scale: 2 }).notNull(),
  modelVersion: text("model_version"),
  traceId: varchar("trace_id"),
  createdAt: timestamp("created_at").defaultNow(),
});
 
export const cdpPositions = pgTable("cdp_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  collateralAmount: decimal("collateral_amount", { precision: 18, scale: 8 }).notNull(),
  debtAmount: decimal("debt_amount", { precision: 18, scale: 8 }).notNull(),
  healthRatio: decimal("health_ratio", { precision: 5, scale: 4 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});
 
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  messages: jsonb("messages").notNull().default("[]"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
 
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});
 
export const evaluationResults = pgTable("evaluation_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelName: text("model_name").notNull(),
  version: text("version").notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
  precision: decimal("precision", { precision: 5, scale: 4 }),
  recall: decimal("recall", { precision: 5, scale: 4 }),
  f1Score: decimal("f1_score", { precision: 5, scale: 4 }),
  latency: integer("latency"), // in milliseconds
  evaluatedAt: timestamp("evaluated_at").defaultNow(),
});
 
// Relations (truncated for brevity - see full schema file)
 
// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
 
export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  timestamp: true,
});
 
// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
// ... other types
