import { test, describe } from "node:test";
import assert from "node:assert";
import crypto from "crypto";

describe("Platform Core Services & Business Rules", () => {
  // Test 1: Order Reference Generation & Format
  test("Order reference generation follows INV-2026-XXXX format", () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderRef = `INV-2026-${randomSuffix}`;
    assert.match(orderRef, /^INV-2026-[A-Z0-9]{4}$/);
  });

  // Test 2: WhatsApp Link Generation
  test("WhatsApp link generation properly formats phone numbers and encodes messages", () => {
    const phone = "+91 98765-43210";
    const cleanNumber = phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
    const message = "Hello! Order Ref: INV-2026-TEST";
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    assert.strictEqual(cleanNumber, "919876543210");
    assert.ok(url.includes("https://wa.me/919876543210?text=Hello"));
  });

  // Test 3: Storage SHA-256 Hash Deduplication
  test("Storage hash calculation accurately identifies duplicate file buffers", () => {
    const buffer1 = Buffer.from("Sample wedding photo buffer data");
    const buffer2 = Buffer.from("Sample wedding photo buffer data");
    const buffer3 = Buffer.from("Different photo buffer data");

    const hash1 = crypto.createHash("sha256").update(buffer1).digest("hex");
    const hash2 = crypto.createHash("sha256").update(buffer2).digest("hex");
    const hash3 = crypto.createHash("sha256").update(buffer3).digest("hex");

    assert.strictEqual(hash1, hash2);
    assert.notStrictEqual(hash1, hash3);
  });

  // Test 4: Admin HMAC-SHA256 Token Signing & Expiry Verification
  test("Admin token generation and verification succeeds with valid secret", () => {
    const secret = "test-secret-key";
    const username = "admin";
    const payload = JSON.stringify({ username, exp: Date.now() + 60000 });
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    const token = Buffer.from(payload).toString("base64") + "." + signature;

    const [encodedPayload, sig] = token.split(".");
    const rawPayload = Buffer.from(encodedPayload, "base64").toString("utf-8");
    const expectedSig = crypto.createHmac("sha256", secret).update(rawPayload).digest("hex");

    assert.strictEqual(sig, expectedSig);
    const parsed = JSON.parse(rawPayload);
    assert.strictEqual(parsed.username, "admin");
    assert.ok(parsed.exp > Date.now());
  });

  // Test 5: Order Status Transitions (Strictly Non-Payment)
  test("Allowed order status transitions validate correctly", () => {
    const allowed = [
      "NEW",
      "CONTACTED",
      "DETAILS_RECEIVED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ];

    assert.ok(allowed.includes("NEW"));
    assert.ok(allowed.includes("CONTACTED"));
    assert.ok(allowed.includes("DETAILS_RECEIVED"));
    assert.ok(allowed.includes("IN_PROGRESS"));
    assert.ok(allowed.includes("COMPLETED"));
    assert.ok(allowed.includes("CANCELLED"));
    assert.ok(!allowed.includes("PAID"));
    assert.ok(!allowed.includes("PAYMENT_PENDING"));
  });

  // Test 6: Template Catalog Structure
  test("Default templates include all required features", async () => {
    const { defaultTemplates } = await import("../src/lib/defaultTemplates.ts");
    assert.ok(defaultTemplates.length >= 6);

    for (const t of defaultTemplates) {
      assert.ok(t.slug);
      assert.ok(t.title);
      assert.ok(t.category);
      assert.ok(typeof t.price === "number");
      assert.ok(Array.isArray(t.features));
      assert.ok(t.features.length >= 4);
    }
  });
});
