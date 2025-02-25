import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  pgEnum,
  boolean,
  date,
  numeric,
  uuid,
  type PgEnum,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

// Create enums
export const techTypeEnum = pgEnum("techType", [
  "language",
  "UI",
  "framework",
  "api-auth-db",
  "other",
]);

export const productTypeEnum = pgEnum("productType", [
  "web",
  "iOS",
  "android",
  "macOS",
  "api",
  "hardware",
]);

export const progressEnum = pgEnum("progress", [
  "in-progress",
  "completed",
  "active-complete",
]);

export const schoolTypeEnum = pgEnum("schoolType", [
  "high_school",
  "college",
  "bootcamp",
]);

export const progressEnumType = pgEnum("progressEnum", [
  "que",
  "pending",
  "complete",
]);

export const mediaTypeEnum = pgEnum("mediatype", [
  "image",
  "document",
  "video",
  "code",
]);

export const workTypeEnum = pgEnum("workType", [
  "employed",
  "contract",
  "self-employed",
]);

export const moodTypeEnum = pgEnum("moodtype", [
  "happy",
  "sad",
  "mad",
  "angry",
  "expressive",
  "thankful",
  "inquisitive",
  "excited",
  "grateful",
  "interested",
  "amazed",
  "introspective",
  "energized",
  "sleepy",
  "depressed",
  "hungry",
  "cold",
  "hot",
  "jealous",
]);

export const positionEnum = pgEnum("positionEnum", [
  "Front End Developer",
  "Full Stack Developer",
  "Backend Developer",
  "Mobile Developer",
  "Web Developer",
  "UI Developer / Designer",
]);

export const messageTypeEnum = pgEnum("messageType", [
  "quoteRequest",
  "hireMe",
  "generalInquiry",
]);

export const deliveryStatusEnum = pgEnum("deliveryStatus", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "canceled",
  "returned",
]);

export const discountTypeEnum = pgEnum("discounttype", [
  "multiple",
  "minus",
  "free",
]);

// Create tables
export const createTable = pgTableCreator((name) => `${name}`);

// Content tables first
export const aboutMe = createTable("about_me", {
  id: integer("id").primaryKey(),
  content: text("content").notNull(),
});

export const blogContent = createTable("blog_content", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pinned: integer("pinned").array(),
});

export const projectsContent = createTable("projects_content", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
});

// Then siteContent with references
export const siteContent = createTable("site_content", {
  key: varchar("key", { length: 255 }).primaryKey(),
  content: text("content").notNull(),
  title: text("title").notNull(),
  logoUrl: text("logo_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by", { length: 255 }),
  aboutMeId: integer("about_me_id").references(() => aboutMe.id),
  blogContentId: integer("blog_content_id").references(() => blogContent.id),
  projectsContentId: integer("projects_content_id").references(
    () => projectsContent.id,
  ),
});

// Blog related tables
export const blogs = createTable("blogs", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  authorId: varchar("author_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const blogContentDetails = createTable("blog_content", {
  id: integer("id").primaryKey(),
  blogId: integer("blog_id")
    .notNull()
    .references(() => blogs.id),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Technology table
export const technology = createTable("technology", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  link: text("link").notNull(),
  type: techTypeEnum("type").notNull(),
  logoUrl: text("logo_url"),
  description: text("description").notNull(),
  experience: integer("experience").notNull(),
  logo: text("logo"),
  currentStack: boolean("current_stack").notNull(),
  productTypes: text("product_type").array().notNull(),
});

export const users = createTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.user_id),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.user_id], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.user_id),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.user_id], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Relations
export const siteContentRelations = relations(siteContent, ({ one }) => ({
  aboutMe: one(aboutMe, {
    fields: [siteContent.aboutMeId],
    references: [aboutMe.id],
  }),
  blogContent: one(blogContent, {
    fields: [siteContent.blogContentId],
    references: [blogContent.id],
  }),
  projectsContent: one(projectsContent, {
    fields: [siteContent.projectsContentId],
    references: [projectsContent.id],
  }),
}));

// Project-related tables
export const projects = createTable("projects", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescript: text("short_descript"),
  productImages: text("product_images").array().notNull(), // JSON stringified productImage objects
  techStack: integer("tech_stack").array().notNull(),
  githubLink: text("github_link"),
  figmaLink: text("figma_link"),
  liveLink: text("live_link"),
  tags: text("tags").array().notNull(),
  created: date("created").notNull(),
  features: text("features").array().notNull(),
  localLink: text("local_link"),
  progress: progressEnum("progress").notNull().default("in-progress"),
});

// Education-related tables
export const formal = createTable("formal", {
  id: integer("id").primaryKey(),
  schools: text("schools").array().notNull(), // JSON stringified school objects
});

export const courses = createTable("courses", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  imagePreview: text("image_preview"),
  instructor: text("instructor").notNull(),
  description: text("description").notNull(),
  tags: text("tags").array().notNull(),
  technologies: integer("technologies").array().notNull(),
  certification: text("certification"),
  progress: progressEnumType("progress").notNull(),
});

export const education = createTable("education", {
  id: integer("id").primaryKey(),
  formalId: integer("formal_id")
    .notNull()
    .references(() => formal.id),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  technologies: many(technology),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  technologies: many(technology),
}));

export const educationRelations = relations(education, ({ one }) => ({
  formal: one(formal, {
    fields: [education.formalId],
    references: [formal.id],
  }),
  course: one(courses, {
    fields: [education.courseId],
    references: [courses.id],
  }),
}));

// Review tables
export const reviews = createTable("reviews", {
  id: integer("id").primaryKey(),
  reviewerId: varchar("reviewer_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  entityType: text("entity_type").notNull(), // 'project', 'course', 'technology', etc.
  entityId: integer("entity_id").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  reviewDate: timestamp("review_date", { withTimezone: true }).defaultNow(),
});

// Social media tables
export const socialMediaProfiles = createTable("social_media_profiles", {
  id: integer("id").primaryKey(),
  platformName: text("platform_name").notNull(),
  profileUrlFormat: text("profile_url_format").notNull(),
  description: text("description"),
});

// Message tables
export const messages = createTable("messages", {
  id: integer("id").primaryKey(),
  type: messageTypeEnum("type").notNull(),
  quoteRequest: text("quote_request"), // JSON stringified quoteRequest
  hireMeRequest: text("hire_me_request"), // JSON stringified hireMeRequest
  generalInquiry: text("general_inquiry"), // JSON stringified generalInquiry
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow(),
});

// Website general settings
export const websiteGeneral = createTable("website_general", {
  id: integer("id").primaryKey(),
  websiteName: text("website_name").notNull(),
  websiteLogo: text("website_logo").notNull(),
  resume: text("resume").notNull(),
});

// Relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

// Roles and permissions
export const roles = createTable("roles", {
  id: integer("id").primaryKey(),
  roleName: text("role_name").notNull().unique(),
});

export const userRoles = createTable(
  "user_roles",
  {
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.roleId] }),
  }),
);

// Active sites monitoring
export const activeSites = createTable("active_sites", {
  id: integer("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  website: text("website").notNull(),
  apiEndpoint: text("api_endpoint").notNull(),
  recurrence: text("recurrence").notNull(),
});

// Updates and status
export const updates = createTable("updates", {
  id: integer("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  lastUpdate: timestamp("last_update", { withTimezone: true }).notNull(),
  currentMood: moodTypeEnum("current_mood"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

// Media storage
export const media = createTable("media", {
  id: integer("id").primaryKey(),
  media: text("media").notNull(), // Base64 or URL
  mediaType: mediaTypeEnum("media_type").notNull(),
  alt: text("alt"),
  description: text("description"),
  mediaUrl: text("media_url").notNull(),
});

// Relations
export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.user_id],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

// Contact references
export const contactReferences = createTable("contact_references", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  contactInfo: text("contact_info").notNull(),
  relationship: text("relationship").notNull(),
});

// Work history
export const workHistory = createTable("work_history", {
  id: integer("id").primaryKey(),
  companyName: text("company_name").notNull(),
  jobTitle: text("job_title").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  jobDescription: text("job_description").notNull(),
  location: text("location"),
  responsibilities: text("responsibilities").array(),
  workType: workTypeEnum("work_type").notNull(),
  referenceId: integer("reference_id").references(() => contactReferences.id),
});

// Tools
export const tools = createTable("tools", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  techType: text("tech_type"),
  productType: text("product_type"),
  description: text("description").notNull(),
});

// Work history projects junction
export const workHistoryProjects = createTable(
  "work_history_projects",
  {
    workHistoryId: integer("work_history_id")
      .notNull()
      .references(() => workHistory.id),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.workHistoryId, table.projectId] }),
  }),
);

// Relations
export const workHistoryRelations = relations(workHistory, ({ one, many }) => ({
  reference: one(contactReferences, {
    fields: [workHistory.referenceId],
    references: [contactReferences.id],
  }),
  projects: many(projects),
}));

// Subscription and e-commerce tables
export const products = createTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'digital' or 'physical'
  stripeProductId: text("stripe_product_id").unique(),
});

export const prices = createTable("prices", {
  id: integer("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  currency: text("currency").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  stripePriceId: text("stripe_price_id").unique(),
});

export const subscriptions = createTable("subscriptions", {
  id: integer("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  interval: text("interval").notNull(), // 'day', 'week', 'month', 'year'
  intervalCount: integer("interval_count").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
});

export const subscribers = createTable("subscribers", {
  id: integer("id").primaryKey(),
  user_id: text("user_id").references(() => users.id),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
});

export const discountCodes = createTable("discount_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  discountCode: text("discount_code").notNull(),
  discountInteger: numeric("discount_integer").notNull(),
  discountType: discountTypeEnum("discount_type"),
  description: text("description"),
  expires: date("expires"),
  usedIn: text("used_in"),
  currentlyActive: boolean("currently_active").default(true),
});

export const customers = createTable("customers", {
  id: integer("id").primaryKey(),
  user_id: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").unique(),
});

export const purchases = createTable("purchases", {
  id: integer("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id),
  productId: integer("product_id").references(() => products.id),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  purchaseDate: timestamp("purchase_date", { withTimezone: true }).defaultNow(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
});

export const deliveries = createTable("deliveries", {
  id: integer("id").primaryKey(),
  purchaseId: integer("purchase_id")
    .notNull()
    .references(() => purchases.id),
  status: deliveryStatusEnum("status").notNull().default("pending"),
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  estimatedDeliveryDate: date("estimated_delivery_date"),
  actualDeliveryDate: date("actual_delivery_date"),
  stripeOrderId: text("stripe_order_id").unique(),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
  subscriptions: many(subscriptions),
}));

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  user: one(users, {
    fields: [subscribers.user_id],
    references: [users.id],
  }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.user_id],
    references: [users.id],
  }),
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  customer: one(customers, {
    fields: [purchases.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [purchases.productId],
    references: [products.id],
  }),
  subscription: one(subscriptions, {
    fields: [purchases.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// Initial data
export const initialUpdates = sql`
  INSERT INTO "updates" (id, created_at, last_update, current_mood, updated_at)
  VALUES 
    (1, '2024-12-03 00:51:58.384464+00', '2024-12-03 00:51:50+00', 'mad', '2024-12-03 00:51:52+00'),
    (2, '2024-12-07 00:52:06+00', '2024-12-07 00:52:03+00', 'amazed', '2024-12-07 00:52:12+00'),
    (3, '2024-12-11 00:52:41+00', '2024-12-11 00:52:43+00', 'expressive', '2024-12-11 00:52:49+00')
  ON CONFLICT (id) DO UPDATE SET
    created_at = EXCLUDED.created_at,
    last_update = EXCLUDED.last_update,
    current_mood = EXCLUDED.current_mood,
    updated_at = EXCLUDED.updated_at;
`;

export const initialActiveSites = sql`
  INSERT INTO "active_sites" (id, created_at, website, api_endpoint, recurrence)
  VALUES
    (
      1,
      '2024-12-12 15:34:22.628632+00',
      'https://www.davidsgarage.pro',
      'api/supabase_cron_job',
      '0 0 * * *'
    ),
    (
      2,
      '2024-12-12 15:34:51.61703+00',
      'https://www.michaelmartell.com',
      'api/supabase_cron_job',
      '0 0 * * *'
    )
  ON CONFLICT (id) DO UPDATE SET
    created_at = EXCLUDED.created_at,
    website = EXCLUDED.website,
    api_endpoint = EXCLUDED.api_endpoint,
    recurrence = EXCLUDED.recurrence;
`;
