import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Group bookings table (main booking group)
export const groupBookings = mysqlTable("group_bookings", {
  id: int("id").autoincrement().primaryKey(),
  groupName: varchar("groupName", { length: 255 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 20 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GroupBooking = typeof groupBookings.$inferSelect;
export type InsertGroupBooking = typeof groupBookings.$inferInsert;

// Booking members table (individual members in a group booking)
export const bookingMembers = mysqlTable("booking_members", {
  id: int("id").autoincrement().primaryKey(),
  groupBookingId: int("groupBookingId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookingMember = typeof bookingMembers.$inferSelect;
export type InsertBookingMember = typeof bookingMembers.$inferInsert;

// Booking services table (services for each member)
export const bookingServices = mysqlTable("booking_services", {
  id: int("id").autoincrement().primaryKey(),
  bookingMemberId: int("bookingMemberId").notNull(),
  service: varchar("service", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookingService = typeof bookingServices.$inferSelect;
export type InsertBookingService = typeof bookingServices.$inferInsert;

// Legacy bookings table (for backward compatibility)
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  service: varchar("service", { length: 255 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 20 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Blog posts table
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  imageUrl: text("imageUrl"),
  author: varchar("author", { length: 255 }).default("Admin"),
  published: int("published").default(0),
  views: int("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
// Email history table
export const emailHistory = mysqlTable("email_history", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  emailType: mysqlEnum("emailType", ["confirmation", "reminder", "custom"]).notNull(),
  customMessage: text("customMessage"),
  status: mysqlEnum("status", ["sent", "failed", "pending"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailHistory = typeof emailHistory.$inferSelect;
export type InsertEmailHistory = typeof emailHistory.$inferInsert;

// Scheduled emails table
export const scheduledEmails = mysqlTable("scheduled_emails", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed", "cancelled"]).default("pending").notNull(),
  sentAt: timestamp("sentAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScheduledEmail = typeof scheduledEmails.$inferSelect;
export type InsertScheduledEmail = typeof scheduledEmails.$inferInsert;
