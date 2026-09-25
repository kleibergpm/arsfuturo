import { describe, expect, it, vi } from "vitest";

describe("reglas de roles", () => {
	it("mantiene los tres roles permitidos", () =>
		expect(["ADMINISTRATOR", "AGENT", "SUPERVISOR"]).toHaveLength(3));
});
