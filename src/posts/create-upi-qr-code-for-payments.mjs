export default {
  slug: 'create-upi-qr-code-for-payments',
  marketplace: 'tools',
  keyword: 'create a UPI QR code for payments',
  type: 'Type 2 — How-To / Guide',
  sentiment: '0.70 to 0.90 · Encouraging + Confidence-building',
  title: 'How to Create a UPI QR Code for Payments at Your Counter',
  metaTitle: 'Create a UPI QR Code for Payments: Step by Step',
  description: 'Create a UPI QR code for payments in a minute. What the code actually contains, static versus fixed amount, and the checks to run before you print it.',
  excerpt: 'A UPI QR is just a short line of text drawn as squares. Knowing what is inside it tells you exactly what to check before you print a hundred copies.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'qr',
  coverAlt: 'Diagram showing payment details being encoded into a QR code for a shop counter',
  tools: ['qr-code-generator', 'thank-you-card-maker', 'barcode-generator'],
  faq: [
    { q: 'What is inside a UPI QR code?', a: 'A short text link containing your UPI ID, your display name, and optionally an amount and a note. The squares are just a way of printing that text so a camera can read it.' },
    { q: 'Should I put an amount in the QR code?', a: 'Only for a fixed price item. A code with no amount lets the payer type any value, which is what you want for a counter QR used across different purchases.' },
    { q: 'How do I test a UPI QR code before printing it?', a: 'Scan it with your own payment app and check the payee name that appears. Do not complete a payment to test it; the name screen already confirms the ID resolved correctly.' },
    { q: 'What size should I print a UPI QR code?', a: 'Large enough to scan comfortably from where people stand. For a counter card, around 3 to 5 cm (about 1.2 to 2 in) across works well, with clear white space around it.' },
  ],
  body: `
The first UPI QR I ever printed had a typo in the payment ID. It scanned beautifully. It just pointed at nothing, and I found out when a customer held up their phone and asked what to do.

Here is the good news. Once you understand what is actually inside the code, checking it takes ten seconds and that whole category of mistake disappears. You can create a UPI QR code for payments in about a minute, and the checking is the part worth slowing down for.

## What a UPI QR code really contains

This part is genuinely more interesting than it sounds.

The squares are not the payment. They are a way of printing text so a camera can read it reliably. What gets encoded is a short link in a defined format, holding your UPI ID, your display name, and optionally an amount and a note.

UPI itself is run by the National Payments Corporation of India, which defines that link format so every payment app reads the same code the same way. That is why a code you generate works in any UPI app rather than only one.

The QR symbol format is its own published standard, ISO/IEC 18004. So you have a standard link inside a standard symbol, which is why this works so consistently.

## How to create a UPI QR code for payments

Three steps, and the third one is the one people skip.

### Step 1: get your UPI ID exactly right

Open your payment app and copy your UPI ID rather than typing it. It looks like a short name, an at sign, and a bank handle.

Copying instead of typing removes the single most common failure. My typo was one wrong character in the middle of an otherwise plausible ID.

### Step 2: generate the code

Put the ID and your display name into the [QR Code Generator](/qr-code-generator/). Add an amount only if the code is for one fixed price.

Everything runs in your browser, so your payment ID is not being sent to a server to have a picture made.

### Step 3: scan your own code before printing

Open your payment app and scan the code on your screen.

You are checking one thing: does the payee name that appears match you? If it does, the ID resolved correctly. You do not need to complete a payment to confirm this.

## Static or fixed amount: both are useful

Neither is better. They suit different moments.

**A static code, with no amount**, is the counter code. The payer enters whatever the purchase came to. Print it once and it works for every sale.

**A fixed amount code** suits a single known price. A workshop fee, a specific product, a deposit. It removes the chance of someone typing the wrong figure.

| | No amount | Fixed amount |
| --- | --- | --- |
| Reusable across sales | Yes | No |
| Risk of wrong figure typed | Present | Removed |
| Best for | Counter, shop card | One product, one fee |

For most sellers the counter version is the one to print, with fixed amount codes made as needed.

## Printing it so it actually scans

A few practical things that decide whether this works in the real world.

Keep a clear white margin around the code. QR codes need that quiet zone to be found by a camera, and a border printed right up to the edge is a common reason for slow scans.

Print it big enough for the distance people stand at. Around 3 to 5 cm (about 1.2 to 2 in) is comfortable for a counter card.

Avoid glossy lamination directly over it if your counter is under a bright light. Glare defeats more scans than size does, in my experience.

## Where else it belongs

The counter is the obvious place, and it is not the only one.

A small QR on a parcel insert gives repeat customers a direct way to pay you for their next order. The [Thank You Card Maker](/thank-you-card-maker/) can carry one alongside your message.

One caution worth taking seriously: marketplaces have their own rules about what you may include in a parcel and about directing customers off-platform. Check your seller policy before putting a payment code in a marketplace order, because the rules differ and they do change.

## A safety note worth repeating

Since a QR is just encoded text, a QR can point anywhere.

Teach whoever works your counter to read the payee name on their screen before approving anything, and never to scan a code a stranger brings in. That habit costs nothing and it is the only real defence against a swapped sticker.

## My take

Copy the ID, generate, scan your own code, then print.

That order matters because the scan happens while fixing a mistake is still free. Once you create a UPI QR code for payments this way a couple of times, the check becomes automatic and you will never print a hundred useless cards. You have got this.
`,
};
