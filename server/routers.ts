import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

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
      .mutation(({ input }) => db.createBooking(input)),
    
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
});

export type AppRouter = typeof appRouter;
