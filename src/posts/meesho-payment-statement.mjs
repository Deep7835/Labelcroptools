export default {
  slug: 'read-meesho-payment-statement',
  marketplace: 'meesho',
  keyword: 'Meesho payment statement',
  type: 'Type 3 — Informational / Educational',
  sentiment: '0.55 to 0.75 · Curious + Warm + Trustworthy',
  title: 'How to Read Your Meesho Payment Statement (Line by Line)',
  metaTitle: 'Meesho Payment Statement Explained, Line by Line',
  description: 'Your Meesho payment statement explains exactly why the amount in your bank is lower than your order value. Here is what each deduction means and how to reconcile it.',
  excerpt: 'The number that lands in your bank is never the number on your orders page. Here is what every line on a Meesho payment statement actually means.',
  published: '2026-09-20',
  updated: '2026-09-20',
  cover: 'statement',
  coverAlt: 'Diagram of a payment statement showing deduction rows above a highlighted net payout line',
  tools: ['profit-calculator', 'gst-calculator', 'picklist-generator'],
  faq: [
    { q: 'Why is my Meesho payout lower than my order value?', a: 'The order value is what the customer paid. Your payout is that figure minus shipping and reverse logistics charges, any penalties, GST adjustments and returns settled in that cycle. The payment statement itemises each one.' },
    { q: 'How often does Meesho pay suppliers?', a: 'Meesho settles on a defined payment cycle after delivery. The exact timing is shown in your supplier panel and can change, so treat the cycle listed in your own panel as the source of truth.' },
    { q: 'What is TCS on my Meesho statement?', a: 'TCS is Tax Collected at Source. Under Section 52 of the CGST Act, e-commerce operators collect a small percentage of the net taxable supply and deposit it against your GSTIN. You can claim it in your GST returns, so it is not a lost cost.' },
    { q: 'Do I need to reconcile every order?', a: 'Not manually. Reconcile at the SKU and cycle level first, and only drill into individual orders when a SKU behaves differently than you expect.' },
  ],
  body: `
A seller once messaged me a screenshot with one line highlighted: "Order value Rs. 499, payout Rs. 214. Where did my money go?"

Nothing had gone wrong. Every rupee was explained on his statement. He had just never been shown how to read it.

Here is something most new suppliers do not realise: the Meesho payment statement is not a bill, it is an audit trail. Once you can read it, it becomes the most useful document in your business.

## Start with the two numbers that are never equal

Your orders page shows **order value**: what the customer paid.

Your bank shows **net payout**: what actually arrived.

The gap between them is not a mystery and it is not (usually) an error. It is a stack of specific deductions, each of which appears as its own line.

Let me explain the main ones.

## Your Meesho payment statement, deduction by deduction

**Shipping charges.** Meesho arranges the courier. The cost of that forward journey shows against the order. Weight matters here, which is why the same product in a smaller bag can genuinely earn you more. If you want to check whether your packaging is costing you a slab, the [Volumetric Weight Calculator](/volumetric-weight-calculator/) shows what a courier will actually bill.

**Reverse shipping.** If a parcel comes back (RTO or customer return), the return journey has a cost too. This is the line that surprises sellers most, because it can appear in a later cycle than the original sale.

**Penalties or claims.** Late dispatch, cancelled orders, or quality claims can each create a deduction. These are worth reading carefully because they are often preventable.

**GST adjustments.** Tax handling on marketplace sales has specific rules, and the statement reflects them.

**TCS (Tax Collected at Source).** Under Section 52 of the CGST Act, e-commerce operators collect a small percentage of your net taxable supply and deposit it against your GSTIN. Here is the part people miss: this is not a fee. It is your own tax, paid forward. You claim it when you file. If you ignore it, you are leaving your own money with the government.

**Compensation and incentives.** Occasionally money goes the other way, for example when Meesho compensates a lost shipment.

## Why one order can appear in two cycles

This is the single most confusing thing about marketplace statements, so let me be specific.

An order placed on the 3rd may be delivered on the 8th and settled in the cycle that covers the 8th. If that same order is returned on the 20th, the reverse charge lands in a later cycle.

So a single cycle contains a mix: sales from a few weeks ago, and returns from sales even older than that.

> This is why comparing "this month's orders" against "this month's payout" never balances. You are comparing two different sets of orders. Reconcile by order, or by cycle, never by calendar month.

## A simple reconciliation routine

You do not need accounting software for this. I would suggest a rhythm rather than a one-off audit.

**Every cycle (about 10 minutes)**

1. Download the payment statement as a spreadsheet.
2. Sum each deduction type into its own column. Shipping, reverse shipping, penalties, TCS.
3. Note the totals in a running sheet, one row per cycle.

After three cycles you will have something far more valuable than any single statement: a trend. You will see whether reverse shipping is creeping up, whether penalties appeared after you changed your dispatch routine, whether one category eats more shipping than you assumed.

**Every month (about 20 minutes)**

Group by SKU. This is where the real decisions live. A SKU with healthy gross margin and a heavy reverse-shipping line can easily be your least profitable product while looking like your best seller.

## Turning the statement into a price

Here is why this actually matters to you. Once you know your real average deductions per order, you can price properly instead of guessing.

Take your statement numbers and put them into the [Seller Profit Calculator](/profit-calculator/). The Meesho preset starts at zero commission, which reflects Meesho's advertised supplier model, and leaves the other fields for you to fill from your own statement. Add your real return rate and real cost per return.

The number it gives you for "expected profit after returns" is the one to price against. The best-case number is the one that gets sellers into trouble.

If you need to split a GST-inclusive price to check your taxable value against the statement, the [GST Calculator](/gst-calculator/) does that in one step.

## Two things worth double-checking

**Your GSTIN details.** TCS is deposited against your GSTIN. If the number on your Meesho account has a typo, the credit does not reach you cleanly. It is a two-minute check that can save a painful reconciliation later.

**Weight slabs on your highest-volume SKU.** If your best seller sits just above a slab boundary, a smaller bag or less filler can move it down a slab on every single order. That is a permanent, compounding saving on the product you ship most.

## What I find genuinely interesting about this

The payment statement is the only document in the whole Meesho workflow that tells you the truth about your business. The orders page tells you about demand. The statement tells you about profit.

Most sellers open it, look at the final number, feel something, and close it. The ones who grow open it, export it, and put the totals in a sheet.

You do not need to do this daily. Once a cycle, ten minutes, and within three cycles you will know exactly which of your products deserve more stock and which one is quietly funding everyone else's losses.
`,
};
