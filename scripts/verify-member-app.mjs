// Isolated browser acceptance. API replies are synthetic; no emails or live bookings.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(
  path.join(
    process.env.CODEX_NODE_MODULES ||
      path.join(
        process.env.USERPROFILE,
        ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
      ),
    "package.json",
  ),
);
const { chromium } = require("playwright");
const base = process.env.MEMBER_REVIEW_URL || "http://localhost:3314";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw Error("Only isolated local acceptance is supported.");
const output = path.join(process.env.TEMP || "/tmp", "attic-member-app-review");
const publishedPlans = JSON.parse(await fs.readFile(new URL("../src/generated/gym/manifest.json", import.meta.url), "utf8")).plans.map((plan) => ({
  id: plan.id, name: plan.name, description: plan.description,
  audience: plan.audience, price: plan.price_label,
}));
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.MEMBER_REVIEW_BROWSER ||
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const errors = [],
  checks = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    let signedIn = false,
      booked = false,
      cancelled = false,
      bookingKey = null,
      created = 0,
      ambiguous = true,
      dataRequests = 0,
      planFailure = false,
      paymentsEnabled = false,
      purchaseState = null,
      checkoutKeys = [],
      loseCheckoutResponse = true,
      useKyle = false,
      familyMode = false,
      familyBookings = [],
      testingGranted = false,
      emailCodeRequests = 0;
    const starts = new Date(Date.now() + 86400000);
    starts.setUTCHours(18, 0, 0, 0);
    const ends = new Date(starts.getTime() + 3600000),
      id = "00000000-0000-4000-8000-000000000001";
    const data = () => ({
      participant_id: familyMode ? "parent" : undefined,
      people: familyMode ? [{contact_id:"parent",name:"Alex Member",is_self:true,role:"adult",household_id:null,household_name:null,membership:null},...(["Mia","Noah"].map((name,i)=>({contact_id:`child-${i}`,name,role:"child",is_self:false,household_id:"family",household_name:"Murphy family",membership:{label:"Kids family membership",service_ids:["class"],weekly_limit:i+1,starts_at:new Date(Date.now()-86400000).toISOString(),ends_at:null,status:"active"}})))] : undefined,
      site_name: "Attic",
      member: { name: "Alex Member", email: useKyle ? "kyle@ingeniumconsulting.net" : "alex@example.invalid" },
      membership: {
        label: purchaseState === "paid" ? "Purchased membership" : "Adult membership",
        service_ids: ["class"],
        weekly_limit: 2,
        starts_at: new Date(Date.now() - 86400000).toISOString(),
        ends_at: null,
        status: "active",
      },
      booking_window_hours: 72,
      classes: [
        {
          id: "class",
          name: "Gi · Mixed levels",
          description: "Technique and training.",
          requires_membership: true,
          requires_payment: false,
        },
      ],
      sessions: [
        {
          id,
          service_id: "class",
          starts_at: starts.toISOString(),
          ends_at: ends.toISOString(),
          location: "Attic Jiu Jitsu, Charlotte Street, Carlow",
          capacity: 24,
          remaining_spots: booked && !cancelled ? 23 : 24,
          coach: "Attic coaching team",
          price_required: false,
        },
      ],
      bookings: familyMode ? familyBookings : booked
        ? [
            {
              id: "reservation",
              session_id: id,
              status: cancelled ? "cancelled" : "confirmed",
              session_status: "scheduled",
              name: "Gi · Mixed levels",
              starts_at: starts.toISOString(),
              ends_at: ends.toISOString(),
              location: "Attic Jiu Jitsu, Charlotte Street, Carlow",
              cancel_before: new Date(starts.getTime() - 3600000).toISOString(),
              self_service: true,
            },
          ]
        : [],
    });
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (["https://checkout.stripe.com", "https://billing.stripe.com"].includes(url.origin)) return route.fulfill({ contentType: "text/html", body: "<h1>Synthetic payment provider</h1>" });
      if (url.origin !== base) return route.abort();
      if (url.pathname === "/members/plans") return route.fulfill({
        status: planFailure ? 503 : 200,
        contentType: "application/json",
        body: JSON.stringify(planFailure ? { error: "Membership catalogue unavailable" } : { plans: publishedPlans, purchasing_enabled: false }),
      });
      if (url.pathname === "/members/api") {
        const body = route.request().postDataJSON();
        let status = 200,
          payload = { ok: true };
        if (body.action === "data") {
          dataRequests++;
          status = signedIn ? 200 : 401;
          payload = signedIn ? data() : { error: "Sign in to continue." };
        }
        if (body.action === "plans") {
          status = planFailure ? 503 : 200;
          payload = planFailure ? { error: "Membership catalogue unavailable" } : {
            plans: publishedPlans.map((p) => ({ ...p, checkout: { enabled: paymentsEnabled && !["paid", "past_due"].includes(purchaseState) && (familyMode?p.name==="Family Plan":p.name === "Membership"), ...(familyMode?{enrollment:{household_id:"family",revision:2},coverage:[{name:"Mia",weekly_limit:1},{name:"Noah",weekly_limit:2}]}:{}), reason: "Online purchasing is being set up", terms: "Monthly membership. Renews automatically until cancelled.", billing_label: "Renews every month" } })), purchasing_enabled: paymentsEnabled,
            purchase: purchaseState ? { id, plan_id: publishedPlans.find((p) => p.name === "Membership").id, name: "Membership", status: purchaseState, recurring: true, can_manage: purchaseState !== "pending", paid_until: null } : null,
          };
        }
        if (body.action === "checkout") {
          const key = route.request().headers()["idempotency-key"];
          if(familyMode)assert.deepEqual(body.input.enrollment,{household_id:"family",revision:2});
          checkoutKeys.push(key); purchaseState = "pending";
          if (loseCheckoutResponse) { loseCheckoutResponse = false; return route.abort("failed"); }
          payload = { purchase_id: id, url: "https://checkout.stripe.com/c/pay/synthetic" };
        }
        if (body.action === "checkout_status") payload = { purchase: { id, status: purchaseState, plan_id: publishedPlans.find((p) => p.name === "Membership").id, name: "Membership", recurring: true, can_manage: purchaseState === "paid", paid_until: null } };
        if (body.action === "cancel_checkout") { purchaseState = null; payload = { purchase: { id, status: "expired" } }; }
        if (body.action === "billing_portal") payload = { url: "https://billing.stripe.com/p/session/synthetic" };
        if (body.action === "request_code") {
          emailCodeRequests++;
          payload = { ok: true, challenge: "synthetic-challenge" };
        }
        if (body.action === "test_signin") { testingGranted = true; signedIn = false; payload = { email: "kyle@ingeniumconsulting.net", challenge: "synthetic-test-challenge", testing: true, expires_at: new Date(Date.now()+2*3600000).toISOString() }; }
        if (body.action === "verify_code") {
          if (body.input.code === "12345678" || (testingGranted && body.input.code === "00000000")) signedIn = true;
          else {
            status = 401;
            payload = { error: "The code is invalid or expired." };
          }
        }
        if (body.action === "book" && familyMode) {
          assert.ok(["child-0","child-1"].includes(body.input.participant_id));
          if(!familyBookings.some(b=>b.participant_id===body.input.participant_id))familyBookings.push({id:`family-${body.input.participant_id}`,participant_id:body.input.participant_id,participant_name:body.input.participant_id==="child-0"?"Mia":"Noah",session_id:id,status:"confirmed",session_status:"scheduled",name:"Gi · Mixed levels",starts_at:starts.toISOString(),ends_at:ends.toISOString(),location:"Attic",cancel_before:new Date(starts.getTime()-3600000).toISOString(),self_service:true});
        }
        if (body.action === "book" && !familyMode) {
          const key = route.request().headers()["idempotency-key"];
          if (bookingKey)
            assert.equal(
              key,
              bookingKey,
              "Ambiguous retries retain their request key",
            );
          else bookingKey = key;
          if (!booked) {
            booked = true;
            created++;
          }
          if (ambiguous) {
            ambiguous = false;
            return route.abort("failed");
          }
        }
        if (body.action === "cancel" && familyMode) familyBookings=familyBookings.map(b=>b.id===body.input.reservation_id?{...b,status:"cancelled"}:b);
        if (body.action === "cancel" && !familyMode) cancelled = true;
        if (body.action === "logout") { signedIn = false; testingGranted = false; }
        return route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(payload),
        });
      }
      return route.continue();
    });
    await page.goto(base + "/members");
    await page.getByRole("heading", { name: "Welcome back" }).waitFor();
    assert.equal(
      await page.locator('script[src*="ingenium-tracker"]').count(),
      0,
    );
    assert.equal(
      await page.getByRole("link", { name: "Home", exact: true }).count(),
      0,
    );
    await page.screenshot({
      path: path.join(output, `login-${width}.png`),
      fullPage: true,
    });
    await page
      .getByLabel("Email address", { exact: true })
      .fill("alex@example.invalid");
    await page.getByRole("button", { name: "Continue with email" }).click();
    await page.getByLabel("Sign-in code", { exact: true }).fill("11111111");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "The code is invalid" })
      .waitFor();
    await page.getByLabel("Sign-in code", { exact: true }).fill("12345678");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByRole("heading", { name: "Find your next class" }).waitFor();
    checks.push(`private email code login at ${width}`);
    const navigation = page.getByRole("navigation", {
      name: width < 600 ? "Mobile member navigation" : "Member navigation",
      exact: true,
    });
    const shell = await page.locator(".memberShell").elementHandle();
    const header = await page.locator(".memberTopbar").elementHandle();
    const navElement = await navigation.elementHandle();
    const initialRequests = dataRequests;
    const titles = {
      timetable: "Find your next class", bookings: "My bookings",
      membership: "Your membership", account: "Your account",
    };
    for (const section of ["timetable", "bookings", "membership", "account"]) {
      await navigation.locator(`a[href="/members/${section}"]`).click();
      await page.getByRole("heading", { level: 1, name: titles[section], exact: true }).waitFor();
      for (const element of [shell, header, navElement])
        assert.equal(await element.evaluate((node) => node.isConnected), true,
          "Section navigation preserves the mounted app shell, header and navigation");
      assert.equal(dataRequests, initialRequests, "Navigation does not restart the session check");
      await page
        .getByText("Checking your secure session…")
        .waitFor({ state: "hidden" });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${section} has no page overflow`,
      );
      assert.equal(await page.getByRole("tab").count(), 0);
      if (section === "membership") {
        await page.getByText(`${publishedPlans.length} memberships available`, { exact: true }).waitFor();
        assert.equal(await page.locator(".memberPlanCard").count(), publishedPlans.length);
        await page.getByLabel("Memberships for", { exact: true }).selectOption("Family");
        assert.equal(await page.locator(".memberPlanCard").count(), publishedPlans.filter((p) => p.audience === "Family").length);
        await page.getByRole("button", { name: "View Family Plan", exact: true }).click();
        await page.getByRole("dialog").getByRole("heading", { name: "Family Plan", exact: true }).waitFor();
        assert.equal(await page.getByRole("dialog").getByRole("button", { name: "Purchase membership · coming soon", exact: true }).isDisabled(), true);
        await page.screenshot({ path: path.join(output, `membership-plan-${width}.png`), fullPage: true });
        await page.getByRole("button", { name: "Close membership details", exact: true }).click();
        await page.getByLabel("Memberships for", { exact: true }).selectOption("");
        planFailure = true;
        await page.getByRole("button", { name: "Refresh plans", exact: true }).click();
        await page.getByRole("alert").filter({ hasText: "Membership catalogue unavailable" }).waitFor();
        assert.equal(await shell.evaluate((node) => node.isConnected), true);
        planFailure = false;
        await page.getByRole("button", { name: "Try again", exact: true }).click();
        await page.getByText(`${publishedPlans.length} memberships available`, { exact: true }).waitFor();
        await page.locator(".memberPlanCatalogue").scrollIntoViewIfNeeded();
        checks.push(`all published membership options, filter and payment gate at ${width}`);
        checks.push(`membership catalogue failure and recovery preserve shell at ${width}`);
      }
      await page.screenshot({
        path: path.join(output, `${section}-${width}.png`),
        fullPage: true,
      });
      checks.push(`${section} layout at ${width}`);
    }
    await page.goBack();
    await page.getByRole("heading", { level: 1, name: titles.membership, exact: true }).waitFor();
    assert.equal(await shell.evaluate((node) => node.isConnected), true);
    await page.goForward();
    await page.getByRole("heading", { level: 1, name: titles.account, exact: true }).waitFor();
    assert.equal(await shell.evaluate((node) => node.isConnected), true);
    checks.push(`persistent shell and browser history at ${width}`);
    await page.goto(base + "/members/timetable");
    await page.getByRole("button", { name: "Book class", exact: true }).click();
    await page
      .getByRole("button", { name: "Confirm booking", exact: true })
      .click();
    await page.getByRole("dialog").getByRole("alert").waitFor();
    await page
      .getByRole("button", { name: "Confirm booking", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page
      .getByRole("status")
      .filter({ hasText: "You’re booked in" })
      .waitFor();
    assert.equal(created, 1);
    checks.push(`idempotent booking after network failure at ${width}`);
    await page.goto(base + "/members/bookings");
    await page
      .getByRole("button", { name: "Cancel booking", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Keep my booking", exact: true })
      .click();
    assert.equal(cancelled, false);
    await page
      .getByRole("button", { name: "Cancel booking", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Confirm cancellation", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(cancelled, true);
    checks.push(`confirmed cancellation at ${width}`);
    paymentsEnabled = true;
    await page.goto(base + "/members/membership");
    await page.getByRole("button", { name: "View Membership", exact: true }).click();
    await page.getByRole("button", { name: "Continue to secure checkout", exact: true }).click();
    await page.getByRole("dialog").getByRole("alert").waitFor();
    const checkoutHandoff = page.waitForRequest("https://checkout.stripe.com/c/pay/synthetic");
    await page.getByRole("button", { name: "Continue to secure checkout", exact: true }).click();
    await checkoutHandoff;
    await page.getByRole("heading", { name: "Synthetic payment provider" }).waitFor();
    assert.equal(checkoutKeys.length, 2); assert.equal(checkoutKeys[0], checkoutKeys[1]);
    purchaseState = "paid";
    await page.goto(base + `/members/membership?purchase=${id}`);
    await page.getByRole("status").filter({ hasText: "Payment confirmed" }).waitFor();
    await page.getByRole("heading", { name: "Purchased membership", exact: true }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Manage billing", exact: true }).isEnabled(), true);
    await page.screenshot({ path: path.join(output, `membership-paid-${width}.png`), fullPage: true });
    const billingHandoff = page.waitForRequest("https://billing.stripe.com/p/session/synthetic");
    await page.getByRole("button", { name: "Manage billing", exact: true }).click(); await billingHandoff;
    await page.getByRole("heading", { name: "Synthetic payment provider" }).waitFor();
    checks.push(`checkout retry, verified return and billing handoff at ${width}`);
    familyMode=true;
    await page.goto(base+"/members/family");
    await page.getByRole("heading",{name:"Murphy family",exact:true}).waitFor();
    await page.screenshot({path:path.join(output,`family-${width}.png`),fullPage:true});
    await page.locator(".memberSidebar").evaluate(el=>{el.dataset.familyShell="persistent";return true;});
    await page.getByRole("link",{name:"View classes for Mia",exact:true}).click();
    await page.getByLabel("Training participant").selectOption("child-0");
    assert.equal(await page.locator(".memberSidebar").getAttribute("data-family-shell"),"persistent");
    await page.getByRole("button",{name:"Book class",exact:true}).click();
    await page.getByRole("dialog").getByText("Mia",{exact:true}).waitFor();
    await page.getByRole("button",{name:"Confirm booking",exact:true}).click();
    await page.getByRole("dialog").waitFor({state:"hidden"});
    await page.getByLabel("Training participant").selectOption("child-1");
    await page.getByRole("button",{name:"Book class",exact:true}).click();
    await page.getByRole("dialog").getByText("Noah",{exact:true}).waitFor();
    await page.getByRole("button",{name:"Confirm booking",exact:true}).click();
    await page.getByRole("dialog").waitFor({state:"hidden"});
    assert.equal(familyBookings.length,2);
    await page.screenshot({path:path.join(output,`family-timetable-${width}.png`),fullPage:true});
    await page.getByRole("link",{name:"My bookings",exact:true}).first().click();
    await page.getByLabel("Training participant").selectOption("all");
    assert.equal(await page.getByRole("button",{name:"Cancel booking",exact:true}).count(),2);
    await page.getByRole("button",{name:"Cancel booking",exact:true}).first().click();
    await page.getByRole("dialog").getByText("For Mia",{exact:true}).waitFor();
    await page.getByRole("button",{name:"Confirm cancellation",exact:true}).click();
    await page.getByRole("dialog").waitFor({state:"hidden"});
    assert.equal(familyBookings.find(b=>b.participant_id==="child-1").status,"confirmed");
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:path.join(output,`family-bookings-${width}.png`),fullPage:true});
    checks.push(`family selection, named confirmations, two sibling places and individual cancellation at ${width}`);
    purchaseState=null;
    await page.goto(base+"/members/membership");
    await page.getByRole("button",{name:"View Family Plan",exact:true}).click();
    await page.getByRole("dialog").getByText("Covered family members",{exact:true}).waitFor();
    await page.getByRole("dialog").getByText(/Mia · 1 class(?:es)? per week/).waitFor();
    await page.screenshot({path:path.join(output,`family-checkout-${width}.png`),fullPage:true});
    const familyPaymentHandoff=page.waitForRequest("https://checkout.stripe.com/c/pay/synthetic");
    await page.getByRole("button",{name:"Continue to secure checkout",exact:true}).click();
    await familyPaymentHandoff;
    checks.push(`named family checkout and confirmed allocation revision at ${width}`);
    familyMode=false;
    useKyle = true;
    await page.goto(base + "/members/account");
    await page.getByRole("button", { name: "Open test sign-in", exact: true }).click();
    await page.getByText(/Enter 00000000 for your test sign-in/).waitFor();
    await page.screenshot({ path: path.join(output, `test-signin-${width}.png`), fullPage: true });
    const emailsBeforeTest = emailCodeRequests;
    await page.getByLabel("Sign-in code", { exact: true }).fill("00000000");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByRole("heading", { name: "Your account", exact: true }).waitFor();
    assert.equal(emailCodeRequests, emailsBeforeTest);
    checks.push(`authorised zero-code test sign-in without email at ${width}`);
    await page
      .getByRole("button", { name: "Add to home screen" })
      .last()
      .click();
    await page.getByText(/On iPhone or iPad/).waitFor();
    await page.getByRole("button", { name: "Sign out of this device" }).click();
    await page.getByRole("heading", { name: "Welcome back" }).waitFor();
    checks.push(`install help and sign-out at ${width}`);
    await context.close();
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(
    path.join(output, "results.json"),
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ passed: checks.length, errors, output }));
} finally {
  await browser.close();
}
