import { integer, json, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer()
});


export const sessionChatTable = pgTable("SessionChat", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar().notNull(),
  createdBy: varchar().references(() => usersTable.email),
  notes: text(),
  selectedDoctor: json(),
  conversation: json(),
  report: json(),
  createdOn: varchar({ length: 100 }).$default(() => { return new Date().toString() })
})

export const realDoctorsTable = pgTable("RealDoctors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  doctorAgentId: integer().notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  specialist: varchar({ length: 255 }).notNull(),
  phoneNumber: varchar({ length: 20 }).notNull(),
  email: varchar({ length: 255 }),
  createdAt: varchar({ length: 100 }).$default(() => { return new Date().toString() })
})