import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { clients, getProject, projects, showcase } from "./projects";
import { services } from "./services";

describe("content", () => {
  it("has at most two teal types, never two in a row", () => {
    expect(categories.filter((c) => c.tone === "teal").length).toBeLessThanOrEqual(2);
    categories.forEach((c, i) => i > 0 && expect(c.tone === "teal" && categories[i - 1].tone === "teal").toBe(false));
  });

  it("has unique slugs, known clients and types, and media on every project", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    projects.forEach((p) => {
      expect(clients.map((c) => c.id)).toContain(p.client);
      expect(categories.map((c) => c.id)).toContain(p.category);
      expect(p.media.length).toBeGreaterThan(0);
    });
  });

  it("points every showcase piece at a real media", () => {
    showcase.forEach((b) => {
      expect(b.pieces).toHaveLength(3);
      b.pieces.forEach(([slug, i]) => expect(getProject(slug)?.media[i]).toBeDefined());
    });
  });

  it("points every service at a real type", () => {
    services.forEach((s) => expect(categories.map((c) => c.id)).toContain(s.category));
  });
});
