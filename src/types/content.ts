export type ContentSection = {
  title: string;
  content: string;
  updatedAt?: Date;
  updatedBy?: string;
};

export type PageConfig = {
  title: string;
  value: string;
  table: string;
  getQuery: string;
  updateQuery: string;
  titleColumn?: string;
  contentColumn?: string;
};

export const pageConfigs = {
  about: {
    title: "About Me",
    value: "about",
    table: "T3Test_site_content",
    getQuery: "getAboutMeContent",
    updateQuery: "updateAboutMe",
    titleColumn: "title",
    contentColumn: "content",
  },
  projects: {
    title: "Projects",
    value: "projects",
    table: "T3Test_projects",
    getQuery: "getProjectsContent",
    updateQuery: "updateProjects",
    titleColumn: "title",
    contentColumn: "content",
  },
  contact: {
    title: "Contact",
    value: "contact",
    table: "T3Test_contact",
    getQuery: "getContactContent",
    updateQuery: "updateContact",
    titleColumn: "title",
    contentColumn: "content",
  },
  blog: {
    title: "Blog",
    value: "blog",
    table: "T3Test_blog",
    getQuery: "getBlogContent",
    updateQuery: "updateBlog",
    titleColumn: "title",
    contentColumn: "content",
  },
} as const;

// Update PageKey to use the pageConfigs keys
type PageKey = keyof typeof pageConfigs;
