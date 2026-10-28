export const BLOG_BASE_PATH = "/blog";

export function isBlogPath(path: string) {
  return path === BLOG_BASE_PATH || path.startsWith(`${BLOG_BASE_PATH}/`);
}

export function isBlogPreview(path: string) {
  return path.startsWith(`${BLOG_BASE_PATH}/preview/`);
}

export const blogSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const blogReservedSlugs = new Set(["category", "tag", "author", "page", "search", "feed", "preview", "api"]);

export function safeBlogPath(path: string) {
  return isBlogPath(path) && !/[\\\u0000-\u001f?#]/.test(path) && !path.includes("//") && !path.split("/").some((part) => part === "." || part === "..");
}

export function headingAnchor(id: string) {
  return `section-${id}`;
}
