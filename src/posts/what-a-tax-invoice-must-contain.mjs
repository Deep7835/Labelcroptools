export default {
  slug: 'what-a-tax-invoice-must-contain',
  marketplace: 'tools',
  keyword: 'what a tax invoice must contain',
  type: 'Type 3 — Informational / Educational',
  sentiment: '0.55 to 0.75 · Curious + Warm + Trustworthy',
  title: 'What a Tax Invoice Must Contain Under GST, in Plain English',
  metaTitle: 'What a Tax Invoice Must Contain Under GST',
  description: 'What a tax invoice must contain under GST, field by field in plain English, plus why the missing field usually costs your buyer rather than you.',
  excerpt: 'An invoice is not a receipt. It is the document your buyer uses to claim input credit, which is why the required fields are not optional decoration.',
  published: '2026-09-23',
  updated: '2026-09-23',
  cover: 'statement',
  coverAlt: 'Diagram of a tax invoice with its required fields highlighted in sequence',
  tools: ['gst-invoice-generator', 'gst-calculator', 'profit-calculator'],
  faq: [
    { q: 'What must a GST tax invoice contain?', a: 'Broadly: your name, address and GSTIN, a consecutive serial number, the date, the buyer details, a description with HSN code, quantity and value, the taxable value, the tax rate and amount split correctly, the place of supply and a signature.' },
    { q: 'Why does the invoice number have to be sequential?', a: 'Because a consecutive series makes gaps visible. A number missing from a sequence is the simplest signal that an invoice was issued and not accounted for.' },
    { q: 'CGST and SGST or IGST, how do I choose?', a: 'It follows the place of supply. A sale within your own state is split into CGST and SGST. A sale to another state is IGST. Getting it wrong creates work for both sides to correct.' },
    { q: 'Is a marketplace order summary a tax invoice?', a: 'Not necessarily. A summary or receipt may lack required fields. Check what your marketplace issues on your behalf and what remains your responsibility.' },
  ],
  body: `
A buyer once asked me to reissue an invoice because his accountant had rejected it. The document looked perfectly professional. It was missing the place of supply, and without it he could not claim his input credit.

That is the thing worth understanding about what a tax invoice must contain. These fields are not formatting preferences. Each one exists because somebody downstream needs it to do something specific.

## Why an invoice is not a receipt

Let me draw the line clearly, because the words get mixed up constantly.

A receipt says money changed hands. It is proof of payment, and it is for the person who paid.

A tax invoice is a tax document. Under GST it is what allows a registered buyer to claim input tax credit, meaning they offset the tax you charged against tax they owe.

That is why a missing field usually hurts your buyer rather than you. They cannot claim, so they come back asking for a corrected document, and you do the work twice.

## What a tax invoice must contain

The required particulars are set out in the CGST Rules, which India's Central Board of Indirect Taxes and Customs administers. In plain English, here is what each field is doing.

1. **Your name, address and GSTIN.** Identifies who made the supply, and proves you are registered to charge tax.
2. **A consecutive serial number.** Unique within a financial year. Gaps are visible, which is rather the point.
3. **The date of issue.** Fixes which tax period the supply belongs to.
4. **Buyer name, address and GSTIN.** Their GSTIN is what connects the credit to them.
5. **Description of goods or services, with HSN code.** The code classifies the item so the rate can be checked.
6. **Quantity and unit.** Makes the value checkable rather than a bare total.
7. **Taxable value.** The base amount before tax, after any discount.
8. **Rate and amount of tax, split correctly.** CGST and SGST together for a sale inside your state, IGST for a sale to another state.
9. **Place of supply.** Determines which split applies, which is exactly what my buyer's invoice was missing.
10. **Signature or digital signature.** Authenticates the document.

Rules are amended from time to time, so treat this as an explanation rather than current legal advice, and confirm the specifics with your accountant.

## The split that catches people out

This is the field I see wrong most often, and it is easy to get right once the logic is clear.

The place of supply decides the split. Same state as you, and the tax divides into CGST and SGST, two halves adding to the same total. Different state, and it becomes IGST as a single line.

The total the buyer pays is identical either way. What differs is which government gets which portion, which is why it cannot be approximated.

If you quote inclusive prices, the [GST Calculator](/gst-calculator/) gives you the base value and tax amount to put on the invoice, since those have to appear as separate lines.

The [GST Invoice Generator](/gst-invoice-generator/) applies the split from the place of supply rather than leaving it as a box to tick, which removes the most common correction.

## Why sequence matters more than it looks

Most people are surprised that the numbering rule is taken as seriously as the amounts.

A consecutive series means an absent number is evidence of something. If invoices run 41, 42, 44, the question asks itself.

So a numbering scheme you can maintain matters more than a clever one. Simple and unbroken beats a system with a prefix for every product line that you abandon three months in.

## What marketplaces do and do not do for you

Worth checking rather than assuming, because sellers get caught here.

Marketplaces often generate invoice documents for orders placed through them. Whether that document is a complete tax invoice, and which parts remain your responsibility, depends on the platform and your registration status.

Your own direct sales, wholesale orders and anything off-platform are entirely yours to issue. Those are the ones where a self-made template tends to be missing a field.

## The fields people leave off most

From invoices I have been asked to look at, three go missing far more often than the rest.

**Place of supply** is the most common, because it feels redundant when the address is already printed. It is not: the address and the place of supply can legitimately differ.

**HSN code** is the second, usually because nobody looked it up when the template was built and it never got added.

**The buyer's GSTIN** is the third, and it is the one that most directly blocks a claim. Without it the credit cannot be matched to them at all.

None of these are hard. They are just easy to omit once and then repeat forever.

## What this means day to day

The useful habit is checking against a list rather than against memory.

Take one invoice you have issued recently and walk it down the ten points above. Most sellers find they have nine of them and have never noticed the tenth was missing, because nobody had needed it yet.

Fix the template once and every future invoice is right. This is genuinely a one-evening job.

## A warm takeaway

None of this is complicated, it is just specific.

Knowing what a tax invoice must contain turns an anxious document into a form you fill correctly without thinking. Get the template right, keep the numbers sequential, let the place of supply decide the split, and the whole topic stops being something you worry about.
`,
};
