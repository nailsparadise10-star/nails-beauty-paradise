import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { sendBookingConfirmationEmail } from "./email";
import { processDailyReminders, sendReminderEmail } from "./reminder";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Group Booking routes (multiple customers, multiple services per booking)
  groupBookings: router({
    list: publicProcedure.query(() => db.getAllGroupBookings()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getGroupBookingById(input.id)),
    
    create: publicProcedure
      .input(z.object({
        groupName: z.string(),
        date: z.string(),
        time: z.string().optional(),
        notes: z.string().optional(),
        members: z.array(z.object({
          name: z.string(),
          email: z.string().email(),
          phone: z.string(),
          services: z.array(z.string()),
        })),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createGroupBooking(input);
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.updateGroupBooking(input.id, { status: input.status, notes: input.notes });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteGroupBooking(input.id);
      }),
  }),

  // Booking routes
  bookings: router({
    list: publicProcedure.query(() => db.getAllBookings()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getBookingById(input.id)),
    
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        service: z.string(),
        date: z.string(),
        time: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Create booking in database
        const result = await db.createBooking(input);
        
        // Generate booking ID
        const bookingId = `BOOK-${Date.now()}`;
        
        // Send confirmation email
        try {
          await sendBookingConfirmationEmail({
            customerName: input.name,
            customerEmail: input.email,
            serviceName: input.service,
            date: input.date,
            time: input.time || "To be confirmed",
            bookingId,
            phone: input.phone,
            notes: input.notes,
          });
          console.log(`[Booking] Confirmation email sent to ${input.email}`);
        } catch (error) {
          console.error(`[Booking] Failed to send confirmation email:`, error);
          // Don't throw error - booking is still created even if email fails
        }
        
        return result;
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.updateBooking(input.id, { status: input.status, notes: input.notes });
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteBooking(input.id);
      }),
  }),

  // Reminder routes
  reminders: router({
    sendDaily: protectedProcedure
      .mutation(async ({ ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const result = await processDailyReminders();
        return result;
      }),
    
    sendForBooking: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        
        const booking = await db.getBookingById(input.bookingId);
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        
        const success = await sendReminderEmail({
          customerName: booking.name,
          customerEmail: booking.email,
          serviceName: booking.service,
          date: booking.date,
          time: booking.time || "To be confirmed",
          phone: booking.phone,
        });
        
        if (!success) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send reminder email" });
        
        return { success: true, message: `Reminder sent to ${booking.email}` };
      }),
  }),

  // Blog routes
  blog: router({
    list: publicProcedure.query(() => db.getAllBlogPosts()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getBlogPostById(input.id)),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => db.getBlogPostBySlug(input.slug)),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        author: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createBlogPost({ ...input, published: 1 });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        published: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        return db.updateBlogPost(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteBlogPost(input.id);
      }),
  }),

  emailHistory: router({
    getByBookingId: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(({ input }) => db.getEmailHistoryByBookingId(input.bookingId)),
  }),

  scheduledEmails: router({
    getByBookingId: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(({ input }) => db.getScheduledEmailsByBookingId(input.bookingId)),
    
    schedule: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        subject: z.string(),
        message: z.string(),
        scheduledAt: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        
        const booking = await db.getBookingById(input.bookingId);
        if (!booking) throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
        
        const result = await db.createScheduledEmail({
          bookingId: input.bookingId,
          customerEmail: booking.email,
          customerName: booking.name,
          subject: input.subject,
          message: input.message,
          scheduledAt: input.scheduledAt,
          status: "pending",
        });
        
        return { success: true, message: "Email scheduled successfully" };
      }),
    
    cancel: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        
        await db.updateScheduledEmail(input.id, { status: "cancelled" });
        return { success: true, message: "Email scheduling cancelled" };
      }),
  }),

  // Services management
  services: router({
    list: publicProcedure.query(() => db.getAllServices()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getServiceById(input.id)),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string(),
        duration: z.number().min(1),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createService(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        duration: z.number().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.updateService(input.id, input);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteService(input.id);
      }),
  }),

  // Staff management
  staff: router({
    list: publicProcedure.query(() => db.getAllStaff()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getStaffById(input.id)),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        specialties: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        workStartTime: z.string().optional(),
        workEndTime: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createStaff(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        specialties: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        isActive: z.number().optional(),
        workStartTime: z.string().optional(),
        workEndTime: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.updateStaff(input.id, input);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteStaff(input.id);
      }),
  }),

  // Customers management
  customers: router({
    list: publicProcedure.query(() => db.getAllCustomers()),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getCustomerById(input.id)),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string(),
        address: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.createCustomer(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.updateCustomer(input.id, input);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        return db.deleteCustomer(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
