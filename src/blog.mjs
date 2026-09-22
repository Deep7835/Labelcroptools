// ─── Blog config: marketplaces act as topic silos ─────────────────────────
export const blog = {
  base: '/blog',
  title: 'Seller Playbook',
  tagline: 'Practical, tested guides for the jobs Indian sellers do every single day.',
  description:
    'Daily-operations guides for Meesho, Flipkart and Amazon sellers: label printing, dispatch, returns, GST, fees, images and packaging. Written from hands-on testing, not theory.',
  author: { name: 'The LabelCropTools team', bio: 'We build the free seller tools on this site and dispatch our own orders, so every guide here starts from a real packing table.' },
  postsPerHub: 50,
};

export const marketplaces = [
  {
    slug: 'meesho', name: 'Meesho', short: 'Meesho',
    title: 'Meesho Seller Guides — Labels, Returns, Payments & Catalog',
    description: 'Hands-on Meesho supplier guides: cropping label PDFs, cutting RTO losses, reading your payment statement, fixing catalog image rejections and packing faster.',
    intro: 'Meesho runs on volume and thin margins, so the small daily jobs (printing labels, packing, handling returns) decide whether a month is profitable. These guides cover those jobs specifically.',
  },
  {
    slug: 'flipkart', name: 'Flipkart', short: 'Flipkart',
    title: 'Flipkart Seller Guides — Labels, SKUs, Fees & Listings',
    description: 'Practical Flipkart seller guides: thermal vs A4 label printing, organising SKU IDs and FSNs, volumetric weight, listing image specs and a daily dispatch checklist.',
    intro: 'Flipkart gives you a lot of control over how you dispatch, which also means a lot of ways to quietly lose money. These guides focus on the settings and habits that actually move your margin.',
  },
  {
    slug: 'amazon', name: 'Amazon', short: 'Amazon',
    title: 'Amazon India Seller Guides — Easy Ship, Fees & Images',
    description: 'Amazon.in seller guides from real dispatch work: printing Easy Ship labels at true 4x6, working out referral and closing fees, meeting image rules and reducing returns.',
    intro: 'Amazon.in is strict about formats, and that strictness is actually good news: once you match the spec exactly, most daily problems disappear. These guides show you the exact specs.',
  },
];
