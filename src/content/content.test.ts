import { describe, expect, it } from "vitest";
import { categories } from "./categories";
import { projects, projectsIn } from "./projects";
import { services } from "./services";

describe("content", () => {
  it("has at most two teal project sections, never two in a row", () => {
    expect(categories.filter((c) => c.tone === "teal").length).toBeLessThanOrEqual(2);
    categories.forEach((c, i) => {
      if (i > 0) expect(c.tone === "teal" && categories[i - 1].tone === "teal").toBe(false);
    });
  });

  it("has unique slugs and every project in a known category", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    const ids = categories.map((c) => c.id);
    projects.forEach((p) => expect(ids).toContain(p.category));
  });

  it("gives every category at least one project and every service a real section", () => {
    categories.forEach((c) => expect(projectsIn(c.id).length).toBeGreaterThan(0));
    services.forEach((s) => expect(categories.map((c) => c.id)).toContain(s.category));
  });
});
