import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, bookings, blogPosts, Booking, InsertBooking, BlogPost, InsertBlogPost, emailHistory, EmailHistory, InsertEmailHistory, scheduledEmails, ScheduledEmail, InsertScheduledEmail, groupBookings, GroupBooking, InsertGroupBooking, bookingMembers, BookingMember, InsertBookingMember, bookingServices, BookingService, InsertBookingService, services, Service, InsertService, staff, Staff, InsertStaff, customers, Customer, InsertCustomer } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Booking queries
export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBooking(booking: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(bookings).values(booking);
  return result;
}

export async function updateBooking(id: number, booking: Partial<Booking>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(bookings).set(booking).where(eq(bookings.id, id));
}

export async function deleteBooking(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(bookings).where(eq(bookings.id, id));
}

// Blog queries
export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(post);
  return result;
}

export async function updateBlogPost(id: number, post: Partial<BlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// Email history queries
export async function getEmailHistoryByBookingId(bookingId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(emailHistory).where(eq(emailHistory.bookingId, bookingId)).orderBy(desc(emailHistory.createdAt));
}

export async function createEmailHistory(record: InsertEmailHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(emailHistory).values(record);
  return result;
}

export async function updateEmailHistory(id: number, record: Partial<EmailHistory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(emailHistory).set(record).where(eq(emailHistory.id, id));
}

// Scheduled emails queries
export async function getScheduledEmailsByBookingId(bookingId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(scheduledEmails).where(eq(scheduledEmails.bookingId, bookingId)).orderBy(desc(scheduledEmails.scheduledAt));
}

export async function getPendingScheduledEmails() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return await db.select().from(scheduledEmails).where(eq(scheduledEmails.status, "pending")).orderBy(scheduledEmails.scheduledAt);
}

export async function createScheduledEmail(email: InsertScheduledEmail) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(scheduledEmails).values(email);
  return result;
}

export async function updateScheduledEmail(id: number, email: Partial<ScheduledEmail>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(scheduledEmails).set(email).where(eq(scheduledEmails.id, id));
}

export async function deleteScheduledEmail(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(scheduledEmails).where(eq(scheduledEmails.id, id));
}

// Group Booking queries
export async function getAllGroupBookings() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(groupBookings).orderBy(desc(groupBookings.createdAt));
}

export async function getGroupBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(groupBookings).where(eq(groupBookings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createGroupBooking(data: {
  groupName: string;
  date: string;
  time?: string;
  notes?: string;
  members: Array<{
    name: string;
    email: string;
    phone: string;
    services: string[];
  }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Create group booking
    const groupResult = await db.insert(groupBookings).values({
      groupName: data.groupName,
      date: data.date,
      time: data.time,
      notes: data.notes,
      status: "pending",
    });
    
    const groupBookingId = groupResult[0].insertId;
    
    // Create members and their services
    for (const member of data.members) {
      const memberResult = await db.insert(bookingMembers).values({
        groupBookingId: groupBookingId,
        name: member.name,
        email: member.email,
        phone: member.phone,
      });
      
      const memberId = memberResult[0].insertId;
      
      // Create services for this member
      for (const service of member.services) {
        await db.insert(bookingServices).values({
          bookingMemberId: memberId,
          service: service,
        });
      }
    }
    
    return { success: true, id: groupBookingId };
  } catch (error) {
    console.error("[Database] Failed to create group booking:", error);
    throw error;
  }
}

export async function updateGroupBooking(id: number, booking: Partial<GroupBooking>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(groupBookings).set(booking).where(eq(groupBookings.id, id));
}

export async function deleteGroupBooking(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Delete booking services
    const members = await db.select().from(bookingMembers).where(eq(bookingMembers.groupBookingId, id));
    for (const member of members) {
      await db.delete(bookingServices).where(eq(bookingServices.bookingMemberId, member.id));
    }
    
    // Delete booking members
    await db.delete(bookingMembers).where(eq(bookingMembers.groupBookingId, id));
    
    // Delete group booking
    return await db.delete(groupBookings).where(eq(groupBookings.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete group booking:", error);
    throw error;
  }
}

export async function getGroupBookingWithMembers(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const booking = await getGroupBookingById(id);
  if (!booking) return undefined;
  
  const members = await db.select().from(bookingMembers).where(eq(bookingMembers.groupBookingId, id));
  
  const membersWithServices = await Promise.all(
    members.map(async (member) => {
      const services = await db.select().from(bookingServices).where(eq(bookingServices.bookingMemberId, member.id));
      return {
        ...member,
        services: services.map(s => s.service),
      };
    })
  );
  
  return {
    ...booking,
    members: membersWithServices,
  };
}


// ============= SERVICES MANAGEMENT =============
export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services);
}

export async function getServiceById(id: number): Promise<Service | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id));
  return result[0];
}

export async function createService(data: InsertService): Promise<Service> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(services).values(data);
  return getServiceById(result[0].insertId as number) as Promise<Service>;
}

export async function updateService(id: number, data: Partial<InsertService>): Promise<Service> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(services).set(data).where(eq(services.id, id));
  return getServiceById(id) as Promise<Service>;
}

export async function deleteService(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(services).where(eq(services.id, id));
  return true;
}

// ============= STAFF MANAGEMENT =============
export async function getAllStaff(): Promise<Staff[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(staff);
}

export async function getStaffById(id: number): Promise<Staff | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(staff).where(eq(staff.id, id));
  return result[0];
}

export async function createStaff(data: InsertStaff): Promise<Staff> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(staff).values(data);
  return getStaffById(result[0].insertId as number) as Promise<Staff>;
}

export async function updateStaff(id: number, data: Partial<InsertStaff>): Promise<Staff> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(staff).set(data).where(eq(staff.id, id));
  return getStaffById(id) as Promise<Staff>;
}

export async function deleteStaff(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(staff).where(eq(staff.id, id));
  return true;
}

// ============= CUSTOMERS MANAGEMENT =============
export async function getAllCustomers(): Promise<Customer[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customers);
}

export async function getCustomerById(id: number): Promise<Customer | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(customers).where(eq(customers.id, id));
  return result[0];
}

export async function createCustomer(data: InsertCustomer): Promise<Customer> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customers).values(data);
  return getCustomerById(result[0].insertId as number) as Promise<Customer>;
}

export async function updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(customers).set(data).where(eq(customers.id, id));
  return getCustomerById(id) as Promise<Customer>;
}

export async function deleteCustomer(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(customers).where(eq(customers.id, id));
  return true;
}
