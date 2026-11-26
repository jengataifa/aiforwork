import { PROGRAM_IMAGES } from './program';

export interface CourseLessonModule {
  heading: string;
  explanation: string;
  practicalExample: string;
}

export interface DiverseUseCaseIdea {
  sector: string;
  idea: string;
  toolHint: string;
}

export interface DailyAssessmentQuestion {
  id: string;
  scenarioLabel: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseDayProgram {
  day: number;
  id: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  practicalRatio: string;
  imageUrl: string;
  imageAlt: string;
  objectives: string[];
  modules: CourseLessonModule[];
  diverseUseCases: DiverseUseCaseIdea[];
  dailyAssessment: DailyAssessmentQuestion[];
  onlineIncomePlaybook: {
    opportunityTitle: string;
    targetClients: string;
    pricingPackages: string[];
    stepByStepDemo: string[];
  };
  readyToUsePrompt: {
    label: string;
    promptText: string;
  };
  practicalCheckpoint: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const COURSE_INTRO_HOOK = {
  kicker: '10-Day Practical Digital Skills Program',
  headline: 'Turn Everyday Connectivity Into Real Work, Higher Productivity, and Sustainable Income',
  body:
    'Across Uganda’s shops, farms, clinics, schools, cooperatives, and service enterprises, valuable time and revenue are lost every week to slow paperwork, unpolished communication, manual records, and limited market visibility. You do not need expensive equipment or a coding degree to solve those challenges. Starting immediately inside familiar platforms like Meta AI on WhatsApp and expanding into ChatGPT, Canva, Google Workspace, and Google AI Studio, this 10-day guided program turns practical digital skills into dependable daily work and measurable business growth.',
} as const;

export const FULL_COURSE_PROGRAM: CourseDayProgram[] = [
  {
    day: 1,
    id: 'day-01',
    title: 'Everyday AI Where You Already Work: Meta AI on WhatsApp & Free Modern Assistants',
    subtitle:
      'Starting effortlessly with Meta AI directly inside WhatsApp chat alongside ChatGPT, Gemini, Google AI Studio, Canva, and Google Workspace.',
    durationLabel: '3 Hours · 70% Practical',
    practicalRatio: 'Free Tools & WhatsApp AI',
    imageUrl: PROGRAM_IMAGES.courseDay01,
    imageAlt: 'Rural Ugandan shopkeeper using Meta AI inside WhatsApp with portable 4G MiFi and solar bank',
    objectives: [
      'Use Meta AI directly inside WhatsApp (personal chats and group chats via @Meta AI) without installing extra apps or spending heavy data.',
      'Combine Meta AI, ChatGPT, Google Gemini / AI Studio, Canva Free, and Google Workspace depending on the job.',
      'Discover diversified income and career ideas across agriculture, education, health, retail, trades, events, and online services.',
    ],
    modules: [
      {
        heading: '1.1 Meta AI Inside WhatsApp Chat (Zero Extra App Needed)',
        explanation:
          'Most people already use WhatsApp every day. By tapping the Meta AI ring icon in WhatsApp or typing "@Meta AI" inside any group chat, you get an instant assistant on low mobile data. Ask it to draft polite customer replies, translate announcements between English and local languages (Luganda, Lusoga, Swahili, Runyankole, Acholi), check poultry/crop care steps, summarize lengthy WhatsApp message threads, or generate quick concept images right in chat.',
        practicalExample:
          'A hardware trader or farmer types "@Meta AI draft a polite WhatsApp reply confirming delivery at 2 PM and total balance of UGX 85,000" or translates a SACCO meeting invitation into Luganda in 4 seconds inside WhatsApp.',
      },
      {
        heading: '1.2 Picking the Right Free AI Assistant for Bigger Tasks',
        explanation:
          'Once you master quick help in WhatsApp Meta AI, graduate to ChatGPT and Google Gemini for long structured proposals, official SACCO letters, clean portrait restoration, and price-list templates; use Canva Free for crisp flyers and product labels; and use Google AI Studio to build clean mobile websites and simple web tools.',
        practicalExample:
          'Using Meta AI on WhatsApp for fast field customer replies while using ChatGPT + Canva at your desk to prepare full business profiles, school study packs, or event banners.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Retail & Trade',
        idea: 'WhatsApp automated-style customer greeting scripts, catalog item descriptions, and supplier price inquiries',
        toolHint: 'Meta AI in WhatsApp',
      },
      {
        sector: 'Agriculture',
        idea: 'Quick crop disease symptom Q&A, chicken vaccination reminders, and seasonal harvest checklists',
        toolHint: 'Meta AI + ChatGPT',
      },
      {
        sector: 'Education',
        idea: 'Translating parent notices into local languages and summarizing long reading chapters into bullet notes',
        toolHint: 'Meta AI in WhatsApp',
      },
      {
        sector: 'Job Seekers & Youth',
        idea: 'Turning rough personal bullet points into crisp ATS-ready CVs, cover letters, and interview practice drills',
        toolHint: 'ChatGPT + Google Docs',
      },
      {
        sector: 'SACCOs & Associations',
        idea: 'Converting handwritten or WhatsApp meeting notes into formal printed PDF committee minutes and letters',
        toolHint: 'ChatGPT + Docs',
      },
      {
        sector: 'Local Artisans',
        idea: 'Drafting professional carpentry, welding, plumbing, or catering work quotations on mobile phones',
        toolHint: 'Meta AI / ChatGPT',
      },
    ],
    dailyAssessment: [
      {
        id: 'd1-q1',
        scenarioLabel: 'WhatsApp Quick Access',
        question: 'How do you summon Meta AI directly inside an existing WhatsApp group chat without installing another app?',
        options: [
          'Type @Meta AI followed by your question or translation request.',
          'Restart your phone three times and wait for an SMS.',
          'Download a paid coding editor before opening WhatsApp.',
        ],
        correctIndex: 0,
        explanation: 'Typing @Meta AI in group chats or tapping the Meta AI ring icon opens instant assistance right inside WhatsApp on low data.',
      },
      {
        id: 'd1-q2',
        scenarioLabel: 'Matching Tool to Job',
        question: 'A SACCO asks you for a structured 4-page business proposal with an itemized budget table. Which combination fits best?',
        options: [
          'ChatGPT or Gemini paired with Google Docs formatting.',
          'Voice-only call with no written summary.',
          'A blank photo filter with no text.',
        ],
        correctIndex: 0,
        explanation: 'While Meta AI handles fast WhatsApp replies, ChatGPT + Google Docs gives structured tables and multi-page clean formatting.',
      },
      {
        id: 'd1-q3',
        scenarioLabel: 'Local Language Trust',
        question: 'A market vendor needs yesterday’s farmer instructions translated from English into Luganda or Lusoga fast. What is the quickest workflow?',
        options: [
          'Ask Meta AI right inside WhatsApp to translate clearly in bullet steps.',
          'Type every word into a binary calculator.',
          'Mail a handwritten request across district offices.',
        ],
        correctIndex: 0,
        explanation: 'Meta AI inside WhatsApp translates short notices and checklists rapidly so community buyers read with clarity.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Fast-Turnaround WhatsApp & Digital Desk Services',
      targetClients: 'Market vendors, teachers, mechanics, churches, landlords, and job seekers',
      pricingPackages: [
        'Starter: Clean 1-Page Letter / CV Update — UGX 10,000 ($3)',
        'Standard: Formatted Quotation / Minutes PDF — UGX 30,000 ($8)',
        'Monthly: Business WhatsApp Copy & Admin Support — UGX 120,000/mo ($33)',
      ],
      stepByStepDemo: [
        'Test Meta AI directly inside your WhatsApp chat for a 30-second client reply or translation.',
        'Use ChatGPT + Google Docs when the task needs multi-page structure or tables.',
        'Export clean PDF and deliver back to the client on WhatsApp.',
      ],
    },
    readyToUsePrompt: {
      label: 'WhatsApp Meta AI & ChatGPT Daily Helper Prompt',
      promptText:
        '@Meta AI Write 3 warm, clear, polite WhatsApp replies for my small business: (1) Confirming stock is available with price, (2) Requesting a 50% booking deposit via Mobile Money, and (3) Thanking a buyer after delivery. Keep messages short and friendly.',
    },
    practicalCheckpoint:
      'Open Meta AI in WhatsApp or ChatGPT and list 4 different services across at least 3 sectors (e.g., agriculture, schools, shops, or events) you can deliver using free AI tools.',
  },
  {
    day: 2,
    id: 'day-02',
    title: 'Official Letters, SACCO & Business Writing, Minutes & Proposals',
    subtitle:
      'Producing clean formal letters for SACCOs and local businesses, committee minutes, official resolutions, CVs, cover letters, and teaching packs.',
    durationLabel: '3.5 Hours · 70% Practical',
    practicalRatio: 'Document & Writing Lab',
    imageUrl: PROGRAM_IMAGES.courseDay02,
    imageAlt: 'Rural Ugandan teacher and student creating formatted documents on a smartphone-tethered laptop',
    objectives: [
      'Master the 4-Part Prompt Formula (Role + Context + Task + Output Format) across ChatGPT, Gemini, and Meta AI.',
      'Write formal letters for SACCOs & local shops, AGM minutes, committee resolutions, CVs, cover letters, and loan/grant applications.',
      'Format clean multi-section documents inside Google Docs ready for instant PDF sharing or printing.',
    ],
    modules: [
      {
        heading: '2.1 Official SACCO & Business Letters, Minutes & Applications',
        explanation:
          'Local cooperatives, shops, schools, and job seekers frequently lose opportunities when introduction letters, AGM minutes, resolutions, CVs, or grant applications look disorganised. Using clear prompt instructions, AI drafts formal correspondence, meeting minutes, and itemized proposals in minutes—ready for final proofreading and letterhead printing.',
        practicalExample:
          'Drafting a formal SACCO bank introduction letter, a crisp AGM resolution extract, or a complete 4-page poultry farm expansion proposal ready for printing.',
      },
      {
        heading: '2.2 Multilingual Translation & Clear Local Communication',
        explanation:
          'Use Meta AI or ChatGPT to convert dense policy rules, health awareness posters, or product safety instructions into simple English, Swahili, or Luganda handouts so every customer and family understands clearly.',
        practicalExample:
          'Turning a veterinary medicine dosage guide into clear numbered bullet steps for poultry farmers.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'SACCOs & Cooperatives',
        idea: 'Formal introduction letters, AGM minutes, official board resolutions, and member notice circulars',
        toolHint: 'ChatGPT + Google Docs',
      },
      {
        sector: 'Local Businesses & Shops',
        idea: 'Supplier inquiry letters, bank account opening requests, staff appointment letters, and client apologies',
        toolHint: 'Meta AI + Google Docs',
      },
      {
        sector: 'Schools & Tutors',
        idea: 'Weekly lesson plans, topical revision booklets with marking guides, and official parent letters',
        toolHint: 'ChatGPT + Google Docs',
      },
      {
        sector: 'Clinics & Pharmacies',
        idea: 'Clear patient after-care instruction leaflets and maternal nutrition handouts in simple language',
        toolHint: 'ChatGPT / Meta AI',
      },
      {
        sector: 'Real Estate & Landlords',
        idea: 'Clear tenancy agreements, property handover inspection checklists, and rent reminder notices',
        toolHint: 'ChatGPT + Docs',
      },
      {
        sector: 'Job Seekers & Contractors',
        idea: 'Tailored CVs, cover letters, tender cover notes, and event catering proposals',
        toolHint: 'ChatGPT + Canva PDF',
      },
    ],
    dailyAssessment: [
      {
        id: 'd2-q1',
        scenarioLabel: 'Prompt Precision',
        question: 'What are the 4 core elements of a strong official-letter or proposal prompt?',
        options: [
          'Role + Context + Specific Task + Clear Output Format.',
          'Only one random adjective with no details.',
          'Sending confidential bank PINs first.',
        ],
        correctIndex: 0,
        explanation: 'Giving AI a Role, Context, Task, and Format prevents vague replies and yields structured documents immediately.',
      },
      {
        id: 'd2-q2',
        scenarioLabel: 'SACCO Governance',
        question: 'Before handing a ChatGPT-drafted AGM resolution to a SACCO chairperson, what essential step must you perform?',
        options: [
          'Proofread names, figures, dates, and format cleanly with header & signature lines in Google Docs.',
          'Leave placeholder brackets like [Date] unedited and print immediately.',
          'Send a raw screenshot of the chat window instead of a PDF.',
        ],
        correctIndex: 0,
        explanation: 'AI drafts fast, but human verification of exact names, numbers, and clean PDF layout is what clients happily pay for.',
      },
      {
        id: 'd2-q3',
        scenarioLabel: 'Delivery Format',
        question: 'Which format keeps margins, tables, and signature blocks intact on any client phone or printer shop?',
        options: [
          'Exported clean PDF document.',
          'Unformatted 2,000-word WhatsApp wall of plain text.',
          'Blurred camera snap of a laptop screen.',
        ],
        correctIndex: 0,
        explanation: 'Sending an exported PDF preserves alignment on phones, laptops, and cyber-café printers.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Multi-Sector Letters, Minutes & Proposal Writing Desk',
      targetClients: 'SACCOs, local shops, private schools, contractors, landlords, and job applicants',
      pricingPackages: [
        'Official Letter / Tailored CV + Cover Letter — UGX 20,000 ($6)',
        'AGM Minutes & Resolution Pack / School Revision Sheet — UGX 50,000 ($14)',
        'Full Loan / Grant / Tender Business Proposal — UGX 120,000 ($33)',
      ],
      stepByStepDemo: [
        'Gather the client’s key points via WhatsApp chat bullets or written notes.',
        'Apply Role + Context + Task + Format inside ChatGPT to structure clean sections and formal tone.',
        'Paste into Google Docs, add header/signature block, proofread facts, and send as PDF.',
      ],
    },
    readyToUsePrompt: {
      label: '4-Part Multi-Purpose Proposal & Revision Architect',
      promptText:
        'Act as a senior project writer. Context: A local [Bakery / Poultry Farm / Primary School] needs a clean 3-page [Loan Proposal / Term Revision Pack]. Task: Write concise persuasive sections plus an itemized budget or marking guide table. Output cleanly for Google Docs.',
    },
    practicalCheckpoint:
      'Pick any two sectors above (for example Tourism + Schools or Real Estate + Clinics) and draft a 4-part prompt tailored to a real local buyer.',
  },
  {
    day: 3,
    id: 'day-03',
    title: 'Photo Restoration, Portrait Grooming & Visual Cleanup',
    subtitle:
      'Restoring damaged historical family photos, prepping clean passport/ID photos without real-life shaving, and sharpening real-estate or event photos.',
    durationLabel: '4 Hours · 75% Practical',
    practicalRatio: 'AI Photo Studio',
    imageUrl: PROGRAM_IMAGES.courseDay03,
    imageAlt: 'Rural Ugandan trading-center specialist restoring an old printed portrait alongside laptop and 4G router',
    objectives: [
      'Restore torn, faded, water-stained, or black-and-white family keepsake photos into crisp color portraits.',
      'Digitally tidy hair and overgrown beards while locking 100% authentic facial identity for formal IDs, passports, and CVs.',
      'Brighten dark interior rooms, graduation snapshots, and land/house listing photos cleanly.',
    ],
    modules: [
      {
        heading: '3.1 Historical Photo Restoration & Memory Preservation',
        explanation:
          'Families treasure old faded wedding, elder, and childhood photos that are cracking or stained. Upload a phone capture of the print to ChatGPT and instruct it to repair tears, sharpen eyes and clothing textures, and apply natural color tones without changing facial likeness.',
        practicalExample:
          'Restoring a faded 1988 family portrait for a memorial service or anniversary frame at UGX 45,000.',
      },
      {
        heading: '3.2 Passport Grooming + Real Estate & Event Photo Polish',
        explanation:
          'Beyond passport grooming (tidying unruly hair or shaving an overgrown beard digitally with exact identity lock), the same visual cleanup turns dim phone photos of rental apartments, wedding stages, and salon hairstyles into bright showcase visuals.',
        practicalExample:
          'Cleaning up distracting wires and dim shadows in a guesthouse room photo so it books faster online, or generating a clean-shaven white-background ID headshot from a selfie.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Families & Memorials',
        idea: 'Restoring cracked old portraits of grandparents and colorizing black-and-white heritage photos',
        toolHint: 'ChatGPT Image Edit',
      },
      {
        sector: 'Job Seekers & Travel',
        idea: 'Instant clean-shaven/neat-hair white-background passport & visa photo sheets from home selfies',
        toolHint: 'ChatGPT + Canva 4-up Grid',
      },
      {
        sector: 'Real Estate & Rentals',
        idea: 'Brightening dim apartment interiors, clearing clutter, and enhancing daylight exterior house shots',
        toolHint: 'ChatGPT / Canva',
      },
      {
        sector: 'Salons & Barbers',
        idea: 'Turning messy phone shots of finished braids or fades into studio-lit portfolio lookbooks',
        toolHint: 'ChatGPT + Canva',
      },
      {
        sector: 'Event Photographers',
        idea: 'Removing background photobombers and sharpening backlit graduation or kwanjula snapshots',
        toolHint: 'ChatGPT Image Edit',
      },
      {
        sector: 'Schools & Studios',
        idea: 'Batch-prepping uniform student ID portrait backgrounds cleanly for annual school printing',
        toolHint: 'Canva + ChatGPT',
      },
    ],
    dailyAssessment: [
      {
        id: 'd3-q1',
        scenarioLabel: 'Capture Quality',
        question: 'When photographing an old cracked printed family photo with your phone for AI restoration, how do you get the cleanest source shot?',
        options: [
          'Shoot evenly in bright indirect daylight with zero flash glare directly above the print.',
          'Use strong camera flash in a dark room so light bounces off the glossy surface.',
          'Fold the photo in half first.',
        ],
        correctIndex: 0,
        explanation: 'Indirect daylight prevents white flash reflection over faces, giving AI sharp details to reconstruct.',
      },
      {
        id: 'd3-q2',
        scenarioLabel: 'Identity Lock',
        question: 'Why must you specify "preserve the person’s exact facial geometry, eyes, nose, and expression 100% unchanged" for passport grooming?',
        options: [
          'So AI updates only hair, beard, attire, or background without altering the real person’s likeness.',
          'To turn the passport applicant into a completely different cartoon character.',
          'To delete the background and leave the photo empty.',
        ],
        correctIndex: 0,
        explanation: 'Official IDs require 100% natural identity accuracy; explicit identity-lock wording keeps facial structure faithful.',
      },
      {
        id: 'd3-q3',
        scenarioLabel: 'Sharp Delivery',
        question: 'How should you send a finished high-resolution restored portrait over WhatsApp so compression does not blur it?',
        options: [
          'Send as WhatsApp Document (full file resolution) or arrange a clean printable Canva PDF.',
          'Screenshot a tiny thumbnail preview three times.',
          'Reduce brightness to 10%.',
        ],
        correctIndex: 0,
        explanation: 'WhatsApp Document preserves full pixel crispness for framing and photo-lab printing.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Photo Restoration, Passport Studio & Property Visual Desk',
      targetClients: 'Families, visa/job applicants, real estate brokers, salons, and printing kiosks',
      pricingPackages: [
        'Passport Cleanup + 6-Up Printable Sheet — UGX 12,000 ($3)',
        'Property / Event Photo Touch-Up Pack (5 Photos) — UGX 35,000 ($10)',
        'Full Old Photo Restoration + Colorize — UGX 50,000 ($14)',
      ],
      stepByStepDemo: [
        'Ask client to photograph the old print or face clearly in bright indirect daylight (no flash glare).',
        'Run an explicit identity-preserving restoration or property cleanup prompt in ChatGPT.',
        'Send as WhatsApp Document mode (full resolution) or arrange print grid in Canva.',
      ],
    },
    readyToUsePrompt: {
      label: 'Identity-Locked Passport Grooming Prompt',
      promptText:
        'Using the uploaded portrait, preserve the person’s exact facial geometry, eyes, nose, skin tone, and expression 100% unchanged. Give them a neat short formal haircut and clean-shaven face, dress them in a crisp dark navy suit and white collar shirt, against a clean plain white passport studio background with soft even lighting.',
    },
    practicalCheckpoint:
      'Draft two image cleanup prompts: one for restoring a damaged old family print and one for tidying a dim rental room or passport portrait.',
  },
  {
    day: 4,
    id: 'day-04',
    title: 'Outfit Changes, Product Photography, Packaging & Lifestyle Mockups',
    subtitle:
      'Transforming plain smartphone product photos into commercial catalogs across food, fashion, cosmetics, electronics, and hospitality.',
    durationLabel: '4 Hours · 75% Practical',
    practicalRatio: 'Commercial Visuals Lab',
    imageUrl: PROGRAM_IMAGES.courseDay04,
    imageAlt: 'Rural Ugandan entrepreneur photographing honey jars and coffee packs on smartphone tripod beside laptop',
    objectives: [
      'Upgrade casual selfies into corporate LinkedIn headshots, medical scrubs, chef uniforms, or graduation gowns.',
      'Generate studio lifestyle product scenes for bottled honey, ground coffee, cakes, shoes, furniture, and cosmetics.',
      'Create realistic 3D packaging, t-shirt merchandise, and Airbnb/restaurant showcase visuals.',
    ],
    modules: [
      {
        heading: '4.1 Product Photography Without Expensive Cameras',
        explanation:
          'Local makers produce amazing shea butter, roasted coffee, chili sauce, pastries, and handmade bags—yet take photos on dark concrete tables. Upload the honest product photo and tell AI to keep the original bottle/label untouched while placing it on marble, wood, or sunlit café counters.',
        practicalExample:
          'A honey or skincare brand replaces dark shelf photos with sunlit wooden-counter catalog shots and doubles WhatsApp Status inquiries.',
      },
      {
        heading: '4.2 Uniforms, Merch Mockups & Fashion Lookbooks',
        explanation:
          'Tailors, boutiques, and corporate teams can preview branded uniforms, tote bags, mug merchandise, or traditional attire colorways before spending money printing or sewing bulk inventory.',
        practicalExample:
          'Showing a restaurant owner their actual logo cleanly placed on staff aprons, takeaway cups, and menu boards.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Agro-Processing & Food',
        idea: 'Jarred honey, spice jars, roasted coffee packs, and bakery cakes placed in sunlit lifestyle kitchens',
        toolHint: 'ChatGPT + Canva Price Tags',
      },
      {
        sector: 'Fashion & Tailoring',
        idea: 'Transforming hanger photos of dresses/suits into clean studio boutique catalog spreads',
        toolHint: 'ChatGPT Image Edit',
      },
      {
        sector: 'Hospitality & Cafes',
        idea: 'Enhancing plated food photos cleanly for delivery apps, menus, and Instagram promos',
        toolHint: 'ChatGPT + Canva',
      },
      {
        sector: 'Corporate & Graduates',
        idea: 'Turning phone selfies into crisp LinkedIn, CV, and speaker-bio executive portraits',
        toolHint: 'ChatGPT Image Edit',
      },
      {
        sector: 'Printing & Merch',
        idea: 'Mocking up branded hoodies, staff polo shirts, tote bags, and gift mugs for client approval',
        toolHint: 'Canva Mockups + AI',
      },
      {
        sector: 'Furniture & Carpenters',
        idea: 'Placing workshop sofas or dining tables inside clean modern living room staging scenes',
        toolHint: 'ChatGPT Background Swap',
      },
    ],
    dailyAssessment: [
      {
        id: 'd4-q1',
        scenarioLabel: 'Brand Label Protection',
        question: 'When placing a jar of local honey on a sunlit wooden counter using AI, what rule protects the seller’s product trust?',
        options: [
          'Instruct AI to keep the original bottle shape and printed label text 100% unaltered.',
          'Allow AI to invent fake spelling on the jar label.',
          'Hide the jar completely behind flowers.',
        ],
        correctIndex: 0,
        explanation: 'Keeping the genuine bottle and brand name intact ensures customers receive the exact product advertised.',
      },
      {
        id: 'd4-q2',
        scenarioLabel: 'Catalog Pricing',
        question: 'After generating crisp studio scenes of cakes or honey jars, where should you add UGX prices and WhatsApp phone numbers?',
        options: [
          'Inside Canva using sharp readable typography.',
          'Wait for random people in comments to guess the price.',
          'Hand-draw over the image with thick red scribble.',
        ],
        correctIndex: 0,
        explanation: 'Canva keeps fonts, UGX pricing, and order numbers razor-sharp with zero spelling distortion.',
      },
      {
        id: 'd4-q3',
        scenarioLabel: 'Client Shoot Guidance',
        question: 'What kind of source phone photo gives the strongest result for furniture or boutique outfit staging?',
        options: [
          'Straight-on clear daylight shot with minimal blur against a plain wall or yard.',
          'Shaky night photo taken while running.',
          'Dark silhouette with the product cut off.',
        ],
        correctIndex: 0,
        explanation: 'A clear daylight angle makes lighting direction match the new commercial backdrop seamlessly.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Product Catalog, Merch Mockup & Executive Portrait Agency',
      targetClients: 'Online shops, food processors, tailors, carpenters, restaurants, and professionals',
      pricingPackages: [
        '3 Executive Profile Headshots — UGX 25,000 ($7)',
        '10 Product Studio Catalog Images — UGX 55,000 ($15)',
        'Brand Merch Mockup + Full Lookbook PDF — UGX 125,000 ($34)',
      ],
      stepByStepDemo: [
        'Instruct the business owner to snap clear daylight photos straight-on against a plain wall.',
        'Generate clean commercial backdrops in ChatGPT while keeping product labels strictly unchanged.',
        'Finish inside Canva with crisp UGX prices, sizes, and WhatsApp order number.',
      ],
    },
    readyToUsePrompt: {
      label: 'Commercial Product Lifestyle Scene Prompt',
      promptText:
        'Keep the exact product container and label text from the uploaded photo 100% unaltered. Remove the messy background and place it cleanly on a warm sunlit natural wooden countertop with soft shadows, natural kitchen greenery blurred in the background, crisp commercial photography style.',
    },
    practicalCheckpoint:
      'Pick one local business type (furniture workshop, bakery, boutique, or cosmetics) and write a background-staging prompt to elevate their photos.',
  },
  {
    day: 5,
    id: 'day-05',
    title: 'Logos, Flyers, Event Cards, Stickers & Banners (AI + Canva)',
    subtitle:
      'Combining Meta AI / ChatGPT illustrations with Canva’s accurate typography for invitations, church posters, product stickers, certificates, and banners.',
    durationLabel: '4 Hours · 80% Practical',
    practicalRatio: 'Graphic Design Lab',
    imageUrl: PROGRAM_IMAGES.courseDay05,
    imageAlt: 'Two rural Ugandan designers crafting event flyers and product labels with portable Wi-Fi and printer',
    objectives: [
      'Avoid garbled AI text by generating pure visual backgrounds, botanical frames, and logo emblems in AI, then typesetting text in Canva.',
      'Design high-demand deliverables: wedding/kwanjula/kuhingira cards, church & concert flyers, product jar stickers, and roadside pull-up banners.',
      'Prepare proper WhatsApp PNG exports and print-shop-ready PDF Print files.',
    ],
    modules: [
      {
        heading: '5.1 The Golden Design Rule: AI Art + Canva Typography',
        explanation:
          'Raw AI generators frequently misspell phone numbers, dates, and local names. Professional AI designers generate clean floral borders, icons, or textured backdrops with ZERO text—and immediately drop them into Canva to apply crisp readable fonts, QR codes, and exact dimensions.',
        practicalExample:
          'Generating an emerald-and-gold crest illustration in ChatGPT or Meta AI, then assembling the full school anniversary banner inside Canva in 8 minutes.',
      },
      {
        heading: '5.2 Packaging Labels, Stickers, Certificates & IDs',
        explanation:
          'Small food makers, soap producers, schools, and sports leagues constantly need waterproof bottle labels, event passes, and participation certificates. Build reusable Canva templates paired with bespoke AI icons.',
        practicalExample:
          'Creating a round bottle sticker label + matching WhatsApp price flyer for a neighborhood juice or yoghurt maker.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Weddings & Cultural Events',
        idea: 'Digital WhatsApp invitation cards, save-the-date videos, program booklets, and thank-you cards',
        toolHint: 'ChatGPT Art + Canva',
      },
      {
        sector: 'Agro & Cosmetics Packaging',
        idea: 'Die-cut product sticker labels for honey jars, soap bars, spice packs, and cooking oil bottles',
        toolHint: 'Canva Labels + AI Icons',
      },
      {
        sector: 'Churches, Mosques & NGOs',
        idea: 'Conference posters, fundraising envelopes, outreach banners, and Sunday service slides',
        toolHint: 'Meta AI / ChatGPT + Canva',
      },
      {
        sector: 'Restaurants & Cafes',
        idea: 'Laminated counter menus, takeaway box stickers, and daily lunch special WhatsApp flyers',
        toolHint: 'Canva + AI Food Art',
      },
      {
        sector: 'Schools & Sports Academies',
        idea: 'Admission campaign flyers, tournament fixtures, student ID cards, and merit certificates',
        toolHint: 'Canva Bulk + AI',
      },
      {
        sector: 'New Businesses',
        idea: 'Starter brand identity packs: vector-style emblem logo, business card, stamp graphic, and signboard layout',
        toolHint: 'ChatGPT + Canva Brand Kit',
      },
    ],
    dailyAssessment: [
      {
        id: 'd5-q1',
        scenarioLabel: 'Golden Typography Rule',
        question: 'Why should AI artwork for flyers and wedding cards be generated with "zero letters or words in the image"?',
        options: [
          'Because Canva adds 100% accurate names, dates, venues, and phone numbers on top without spelling bugs.',
          'Because flyers never include event dates or phone contacts.',
          'Because Canva cannot open image files.',
        ],
        correctIndex: 0,
        explanation: 'Combining custom AI botanical/crest backgrounds with Canva typography gives studio polish and zero misspellings.',
      },
      {
        id: 'd5-q2',
        scenarioLabel: 'Print Shop Handoff',
        question: 'A juice maker wants you to supply sticker labels ready for commercial cutting at a local printing press. Which pair of files should you export?',
        options: [
          'WhatsApp preview PNG plus high-resolution Print-Ready PDF.',
          'Audio voice note only.',
          'Uncropped browser screenshot.',
        ],
        correctIndex: 0,
        explanation: 'Print shops need crisp PDF Print files with proper sizing, while clients preview cleanly via PNG.',
      },
      {
        id: 'd5-q3',
        scenarioLabel: 'Reusable Scaling',
        question: 'How can you fulfill 5 different shop flyers per day in under half the time?',
        options: [
          'Save clean master templates in Canva and swap client colors, logos, and offers systematically.',
          'Redesign every border margin from scratch every hour.',
          'Use illegible neon yellow text on white background.',
        ],
        correctIndex: 0,
        explanation: 'Smart reusable Canva layout systems turn your 1-hour effort into repeatable high-margin daily income.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Full-Service Branding, Stickers, Cards & Print-Prep Desk',
      targetClients: 'Event hosts, churches, beverage/food makers, salons, schools, and restaurants',
      pricingPackages: [
        'WhatsApp Flyer / Digital Invitation Card — UGX 25,000 ($7)',
        'Product Sticker Label + Print Sheet Setup — UGX 50,000 ($14)',
        'Logo + Business Card + Roll-Up Banner Bundle — UGX 140,000 ($38)',
      ],
      stepByStepDemo: [
        'Use ChatGPT or Meta AI to generate a clean symbol or border graphic with "zero text on image".',
        'Upload graphic into Canva, choose exact template size (A5 flyer, sticker circle, 85x200cm banner).',
        'Add crisp phone numbers, dates, QR links, and deliver PNG + Print-Ready PDF.',
      ],
    },
    readyToUsePrompt: {
      label: 'Zero-Text Custom Graphic Frame Prompt',
      promptText:
        'Create a refined vertical card background featuring a warm cream textured paper center framed by subtle botanical olive leaves and brushed dark-gold geometric borders at the top and bottom corners, wide clean blank space in the middle for text, zero letters or words anywhere in the image.',
    },
    practicalCheckpoint:
      'Choose two graphic products (for example, a juice bottle label and a school admission flyer) and plan the exact AI artwork + Canva text steps.',
  },
  {
    day: 6,
    id: 'day-06',
    title: 'Digital Books, Brochures, Study Packs & Business Profiles',
    subtitle:
      'Packaging practical expertise into sellable PDF e-books, poultry/farming handbooks, folded brochures, school study packs, and illustrated company profiles.',
    durationLabel: '3.5 Hours · 75% Practical',
    practicalRatio: 'Publishing & Print Layouts',
    imageUrl: PROGRAM_IMAGES.courseDay06,
    imageAlt: 'Ugandan rural poultry farmer authoring a digital farming handbook on a tablet with solar charger',
    objectives: [
      'Spot fast-selling local knowledge niches (layer poultry calendars, fish pond manuals, exam revision booklets, home baking, smartphone business tips).',
      'Co-author practical, zero-fluff guides in ChatGPT and lay out readable mobile-first PDF e-books and brochures in Canva.',
      'Combine custom AI cover illustrations with clean Canva typography for brochures, church programs, and company profiles.',
    ],
    modules: [
      {
        heading: '6.1 Micro E-Books, Checklists & Paid WhatsApp Guides',
        explanation:
          'You do not need a 200-page novel. Busy buyers gladly pay UGX 10,000–25,000 on Mobile Money for a focused, readable 20-page PDF guide packed with feed ratios, budgets, checklists, and real troubleshooting answers they can read directly on a smartphone.',
        practicalExample:
          'Selling a practical "100-Bird Layer Poultry Starter Manual & Weekly Budget" PDF with custom illustrated diagrams to aspiring farmers via WhatsApp.',
      },
      {
        heading: '6.2 Service Brochures, Company Profiles & Product Catalogs',
        explanation:
          'Clinics, builders, SACCOs, and salons win bigger contracts when they hand prospects a sharp 6-page company profile or tri-fold printed brochure instead of plain text messages. Draft concise service copy in ChatGPT and arrange photos neatly in Canva.',
        practicalExample:
          'Building a sleek 6-page visual company profile PDF for a welding workshop, construction team, or neighborhood clinic.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Agribusiness Guides',
        idea: 'Step-by-step illustrated PDF handbooks for poultry, tilapia fish farming, or greenhouse tomatoes',
        toolHint: 'ChatGPT + Canva PDF',
      },
      {
        sector: 'Students & Parents',
        idea: 'Downloadable holiday exam revision booklets, science revision summaries, and essay-writing guides',
        toolHint: 'ChatGPT + Google Docs',
      },
      {
        sector: 'Beauty & Culinary',
        idea: 'Illustrated recipe e-books (healthy snacks, pastries, juices) and natural haircare routine planners',
        toolHint: 'ChatGPT Art + Canva',
      },
      {
        sector: 'SMEs & Contractors',
        idea: 'Multi-page company profiles, service capability brochures, and illustrated WhatsApp product catalogs',
        toolHint: 'ChatGPT + Canva',
      },
      {
        sector: 'Churches & Events',
        idea: 'Printed anniversary magazines, funeral tribute booklets, and multi-page conference programs',
        toolHint: 'Google Docs + Canva',
      },
      {
        sector: 'Personal Finance',
        idea: 'Printable savings trackers, side-hustle startup checklists, and wedding/house-building budget planners',
        toolHint: 'Canva + Docs',
      },
    ],
    dailyAssessment: [
      {
        id: 'd6-q1',
        scenarioLabel: 'Mobile Readability',
        question: 'Why do concise 20-page action manuals sell faster on WhatsApp than dense 200-page academic textbooks?',
        options: [
          'Smartphone buyers prefer fast checklists, feed budgets, and easy-to-read step-by-step solutions they can apply today.',
          'Mobile PDFs cannot hold more than 2 words per page.',
          'Longer books are always illegal to read on phones.',
        ],
        correctIndex: 0,
        explanation: 'Busy farmers, bakers, and parents happily pay for immediate practical clarity formatted for mobile reading.',
      },
      {
        id: 'd6-q2',
        scenarioLabel: 'Company Profiles',
        question: 'What turns an ordinary welding shop or catering service into a stronger tender applicant?',
        options: [
          'A crisp 6-page illustrated Company Profile PDF showing past work, capacity, and clean contact channels.',
          'Texting only "we do welding" with no pricing or portfolio.',
          'Uploading blurry random clipart.',
        ],
        correctIndex: 0,
        explanation: 'Illustrated brochures and capability profiles establish instant institutional credibility with schools and NGOs.',
      },
      {
        id: 'd6-q3',
        scenarioLabel: 'Zero-Fluff Validation',
        question: 'Before authoring a digital PDF guide, how do you pick a topic guaranteed to attract buyers?',
        options: [
          'Focus on specific questions people repeatedly ask in community groups or trading centers (like layer chicken budgeting or exam revision).',
          'Write blindly about an imaginary topic nobody searches for.',
          'Hide the table of contents completely.',
        ],
        correctIndex: 0,
        explanation: 'Validating real buyer pain points guarantees your time produces an asset that solves an existing market need.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Digital Guides, Brochures & Company Profile Studio',
      targetClients: 'Direct buyers, agronomists, clinics, contractors, schools, and local shops',
      pricingPackages: [
        'Self-Published Niche Guide (Per Copy) — UGX 15,000 ($4)',
        '6-Page Illustrated Company Profile / Brochure — UGX 80,000 ($22)',
        'Done-For-You 25-Page E-Book + 3D Cover Image — UGX 240,000 ($65)',
      ],
      stepByStepDemo: [
        'Validate a specific question dozens of people ask repeatedly in Facebook/WhatsApp groups.',
        'Draft practical checklists + clear text sections with ChatGPT and generate bespoke illustrations.',
        'Format with 16pt mobile-friendly typography in Canva and sell directly via WhatsApp + Mobile Money.',
      ],
    },
    readyToUsePrompt: {
      label: 'Mobile-Friendly Handbook & Company Profile Prompt',
      promptText:
        'Act as a practical handbook editor. Outline a concise, easy-to-read 20-page guide on "[Topic, e.g. Starting Layer Poultry / Small Salon Company Profile]". Include clear section headings, startup checklists, and beginner mistakes to avoid. Write simply for mobile readers.',
    },
    practicalCheckpoint:
      'Choose one digital PDF guide OR a 6-page company profile brochure, write its title, target buyer, and 5 clear sections.',
  },
  {
    day: 7,
    id: 'day-07',
    title: 'Building Real Web Apps for Free with Gemini in Google AI Studio',
    subtitle:
      'Turning plain-English prompts into working mobile websites, calculators, booking portals, QR menus, and shop managers at zero hosting cost.',
    durationLabel: '4.5 Hours · 80% Practical',
    practicalRatio: 'AI App Engineering',
    imageUrl: PROGRAM_IMAGES.courseDay07,
    imageAlt: 'Rural Ugandan youth testing web apps under a tree beside a community solar wireless mast',
    objectives: [
      'Use Gemini inside Google AI Studio to build complete, responsive React web apps using plain English.',
      'Create practical interactive software tools businesses immediately pay for—far beyond static brochure sites.',
      'Deploy live web links to GitHub Pages or Vercel for free and hand clients an app that runs cleanly on phones.',
    ],
    modules: [
      {
        heading: '7.1 Describing Solutions, Not Code Syntax',
        explanation:
          'Inside Google AI Studio, you act as the product manager. Clearly specify who uses the app, what inputs they type or tap, what gets calculated or displayed, and how results export (for instance, formatting an order straight into a one-tap WhatsApp message or printable PDF receipt).',
        practicalExample:
          'Prompting a Salon & Barber Booking Web App where clients pick hairstyles with UGX prices, choose an appointment day, and tap once to confirm via WhatsApp.',
      },
      {
        heading: '7.2 8 Diverse Web Apps You Can Build & Sell This Month',
        explanation:
          '(1) Restaurant QR Digital Menu + WhatsApp Order Cart, (2) SACCO Savings & Loan Installment Calculator, (3) Clinic Queue & Appointment Scheduler, (4) Hardware Store Invoice & Receipt Maker, (5) Real Estate Property Listing Showcase, (6) Wedding RSVP & Contribution Tracker Micro-Site, (7) School Fee & Term Balance Estimator, (8) Freelancer Portfolio & Instant Quote Estimator.',
        practicalExample:
          'A neighborhood pharmacy or clinic pays UGX 350,000 for a clean browser-based daily sales + receipt app they run on any tablet or phone.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Restaurants & Cafes',
        idea: 'QR-code digital food menu with live subtotal cart and direct WhatsApp kitchen order button',
        toolHint: 'Google AI Studio',
      },
      {
        sector: 'Clinics, Salons & Spas',
        idea: 'Service price menu + interactive appointment time-slot picker for mobile customers',
        toolHint: 'Google AI Studio',
      },
      {
        sector: 'SACCOs & Traders',
        idea: 'Custom savings growth simulator, loan repayment schedule calculator, and mobile receipt maker',
        toolHint: 'Google AI Studio',
      },
      {
        sector: 'Real Estate & Rentals',
        idea: 'Filterable house/land showcase portal with neighborhood search and agent inquiry buttons',
        toolHint: 'Google AI Studio',
      },
      {
        sector: 'Events & Weddings',
        idea: 'Interactive digital wedding micro-site with venue map notes, program schedule, and guest RSVP',
        toolHint: 'Google AI Studio',
      },
      {
        sector: 'Schools & Tutors',
        idea: 'Interactive online revision flashcard quiz app tailored to primary and secondary students',
        toolHint: 'Google AI Studio',
      },
    ],
    dailyAssessment: [
      {
        id: 'd7-q1',
        scenarioLabel: 'Product Thinking Over Syntax',
        question: 'Inside Google AI Studio, what details help Gemini build a genuinely useful app on the first pass?',
        options: [
          'Who uses it, exact inputs/selections, UGX calculation rules, and one-tap output (like Send via WhatsApp).',
          'Typing simply "make something cool" with zero industry details.',
          'Writing raw machine assembly by hand.',
        ],
        correctIndex: 0,
        explanation: 'Clear business specs let Gemini engineer clean responsive UI, pricing carts, and WhatsApp order flows right away.',
      },
      {
        id: 'd7-q2',
        scenarioLabel: 'Closing Local Deals',
        question: 'What is the fastest way to convince a restaurant or clinic owner to buy a web app from you?',
        options: [
          'Build a working mobile prototype in Google AI Studio first and demonstrate it live on your phone with their name on it.',
          'Send a 12-page abstract computer theory essay.',
          'Ask for full upfront payment before explaining what a website does.',
        ],
        correctIndex: 0,
        explanation: 'Seeing their own salon, menu, or clinic working interactively on a phone screen removes hesitation immediately.',
      },
      {
        id: 'd7-q3',
        scenarioLabel: 'Zero Hosting Cost',
        question: 'Which free hosting options allow you to publish responsive front-end web apps cleanly for client access?',
        options: [
          'GitHub Pages or Vercel.',
          'Printing source code on paper and mailing it.',
          'Storing files only inside an offline USB drive.',
        ],
        correctIndex: 0,
        explanation: 'GitHub Pages and Vercel provide dependable free live HTTPS links accessible worldwide on phones.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Custom Web Apps, Digital Menus & Business Portals',
      targetClients: 'Restaurants, clinics, salons, real estate agents, SACCOs, schools, and event couples',
      pricingPackages: [
        'Digital QR Menu / Event RSVP Micro-Site — UGX 150,000 ($40)',
        'Custom Booking / Invoice / Quiz Web App — UGX 350,000 ($95)',
        'Multi-Page Business Portal + Free Live Hosting Setup — UGX 600,000+ ($160+)',
      ],
      stepByStepDemo: [
        'Interview one local owner to spot a slow paper task (menus, receipts, bookings, listings).',
        'Build a working first prototype in Google AI Studio in 15 minutes using clear screen-by-screen specs.',
        'Open the working prototype on your phone right in front of the client so they immediately see their brand live.',
      ],
    },
    readyToUsePrompt: {
      label: 'Google AI Studio Interactive Business App Prompt',
      promptText:
        'Build a mobile-first React + Tailwind web app for "[Business Name]", a [Clinic / Bakery / Hardware Shop]. Include: (1) A clean searchable catalog of services/products with UGX prices, (2) An interactive estimator or booking cart, (3) Light and Dark mode support, and (4) A one-tap "Send Order via WhatsApp" summary button.',
    },
    practicalCheckpoint:
      'Write a complete Google AI Studio app prompt for one industry above (e.g., Real Estate, School Quiz, Clinic Booking, or Receipt Maker).',
  },
  {
    day: 8,
    id: 'day-08',
    title: 'Quotations, Price Lists, Receipts & Everyday Business Documents',
    subtitle:
      'Producing clean ready-to-share price cards, itemized client quotations, printed/WhatsApp receipts, SACCO circulars, and reusable office letterheads.',
    durationLabel: '3.5 Hours · 75% Practical',
    practicalRatio: 'Everyday Business Kit',
    imageUrl: PROGRAM_IMAGES.courseDay08,
    imageAlt: 'Rural SACCO cooperative treasurer preparing clear quotations and member notices with laptop and solar power',
    objectives: [
      'Generate crisp, trustworthy itemized quotations and delivery notes directly inside ChatGPT + Google Docs or Canva.',
      'Design visual WhatsApp price lists and branded fee/rate cards that shops, salons, and artisans send customers instantly.',
      'Build reusable letterheads, SACCO circular notices, and clean shop receipt templates without complicated software.',
    ],
    modules: [
      {
        heading: '8.1 Instant Quotations, Price Lists & Branded Rate Cards',
        explanation:
          'When customers ask for prices on WhatsApp, sending messy unformatted text loses trust. Combine clear structured text from Meta AI or ChatGPT with a neat Canva card showing item descriptions, exact UGX prices, payment terms, and contact details so every reply looks established and reliable.',
        practicalExample:
          'Generating an itemized carpentry/welding job quotation with clear material breakdown and 60% deposit terms in 3 minutes.',
      },
      {
        heading: '8.2 Reusable Letterheads, Receipts & SACCO Official Notices',
        explanation:
          'Small businesses, schools, and cooperatives need clean stamped-style official letterheads, payment confirmation notes, and clean receipt layouts they can edit anytime on a phone or laptop using Google Docs or Canva.',
        practicalExample:
          'Creating a matched 3-piece office stationary pack (letterhead + quotation template + customer receipt slip) for a local clinic or hardware store.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Hardware & Tailoring',
        idea: 'Itemized material + labor quotation templates and clean measurement/order slips',
        toolHint: 'ChatGPT + Google Docs',
      },
      {
        sector: 'Salons, Spas & Gyms',
        idea: 'Shareable phone-screen service price menus and festive discount cards for WhatsApp Status',
        toolHint: 'Canva + Meta AI Copy',
      },
      {
        sector: 'SACCOs & Associations',
        idea: 'Official member notice letters, loan guarantor commitment letters, and payment receipts',
        toolHint: 'ChatGPT + Docs',
      },
      {
        sector: 'Catering & Events',
        idea: 'Per-plate buffet quotations, supplier purchase orders, and clear client deposit receipts',
        toolHint: 'ChatGPT + Canva PDF',
      },
      {
        sector: 'Schools & Nurseries',
        idea: 'Clean termly fee structure flyers, uniform requirement sheets, and official parent circulars',
        toolHint: 'Google Docs + Canva',
      },
      {
        sector: 'Retail & Wholesale',
        idea: 'Weekly wholesale commodity price lists with clean product thumbnails for shopkeepers',
        toolHint: 'Canva + ChatGPT',
      },
    ],
    dailyAssessment: [
      {
        id: 'd8-q1',
        scenarioLabel: 'Customer Trust in Quotes',
        question: 'Beyond listing item prices, what critical business safeguard belongs on every shop or contractor quotation?',
        options: [
          'Clear booking deposit percentage, quote validity window (e.g. 14 days), and delivery timeline.',
          'Unreadable slang abbreviations.',
          'Leaving total payable blank.',
        ],
        correctIndex: 0,
        explanation: 'Stating deposit terms and validity prevents disputes when raw material prices shift.',
      },
      {
        id: 'd8-q2',
        scenarioLabel: 'Mobile Price Cards',
        question: 'Why does a formatted Canva Price Card outperform plain typed paragraphs on WhatsApp Status?',
        options: [
          'Customers scan clean aligned services, UGX prices, and contact info in seconds and forward the card cleanly.',
          'Plain text paragraphs always auto-calculate totals.',
          'Image cards cannot be saved to phones.',
        ],
        correctIndex: 0,
        explanation: 'Visual clarity elevates small artisans and salons to institutional quality on smartphone screens.',
      },
      {
        id: 'd8-q3',
        scenarioLabel: 'Bundle Value',
        question: 'Instead of selling only one page, how can you grow a single UGX 25,000 request into a UGX 120,000 sale?',
        options: [
          'Offer a 4-document Stationery Kit (Letterhead + Quotation + Customer Receipt + Price Card) styled consistently.',
          'Raise the price without adding useful deliverables.',
          'Refuse small clients completely.',
        ],
        correctIndex: 0,
        explanation: 'Matching templates solve four real daily office bottlenecks at once, giving buyers strong value.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'SME Letterhead, Price List & Quotation Pack Service',
      targetClients: 'Contractors, boutiques, hardware stores, salons, schools, catering teams, and SACCOs',
      pricingPackages: [
        'Visual WhatsApp Price Card / Fee Circular — UGX 25,000 ($7)',
        'Itemized Quotation + Letterhead Template Set — UGX 55,000 ($15)',
        'Complete 4-Document Business Stationery Kit — UGX 120,000 ($33)',
      ],
      stepByStepDemo: [
        'Ask the business owner for their top 8–12 services/products and UGX prices.',
        'Use ChatGPT to write clean, polite service descriptions, deposit terms, and clear table layout.',
        'Drop the approved text into a branded Canva/Google Docs template and deliver editable link + PDF.',
      ],
    },
    readyToUsePrompt: {
      label: 'Professional Quotation & Price Card Prompt',
      promptText:
        'Act as a small business office assistant. Write a clean, polite, itemized Quotation & Terms template for a [Welding Workshop / Catering Business / Salon] including item name, unit price (UGX), clear 50% booking deposit rule, validity period (14 days), and thank-you sign-off.',
    },
    practicalCheckpoint:
      'Create one reusable Official Letterhead + Itemized Quotation structure tailored for a shop, contractor, salon, or SACCO.',
  },
  {
    day: 9,
    id: 'day-09',
    title: 'Digital Marketing: Meta AI, WhatsApp Channels, TikTok, IG & Facebook',
    subtitle:
      'Turning attention into paying buyers with 3-second video hooks, Before/After proof, Meta AI inside WhatsApp Business, and WhatsApp Channels.',
    durationLabel: '4 Hours · 80% Practical',
    practicalRatio: 'Growth & Conversion',
    imageUrl: PROGRAM_IMAGES.courseDay09,
    imageAlt: 'Young Ugandan creator filming a mobile product reel outside a rural Kitenge tailoring stall',
    objectives: [
      'Use the 3-Second Curiosity Hook + Before/After Transformation formula across TikTok, Instagram Reels, and Facebook.',
      'Pair Meta AI directly inside WhatsApp with WhatsApp Status, Groups, Business Catalogs, and WhatsApp Channels to close buyers daily without paid ads.',
      'Craft clear Bronze / Silver / Gold price menus and weekly content calendars for client businesses.',
    ],
    modules: [
      {
        heading: '9.1 High-Trust Content: Proof Over Hype',
        explanation:
          'Audiences scroll past generic posters, but stop instantly for real proof: a 15-second screen recording showing a torn photo becoming sharp, a messy paper menu becoming a sleek QR web app, or a farm harvest tip that saves money. Pair visual proof with one simple WhatsApp instruction.',
        practicalExample:
          'Posting a 15-second reel: "Stop typing customer invoices by hand — watch this free phone web app I built in 10 minutes!"',
      },
      {
        heading: '9.2 Meta AI + WhatsApp Business Funnel Mastery',
        explanation:
          'Inside WhatsApp Business, combine a tidy 3-package Catalog with daily Status slides (Slide 1: Client Problem, Slide 2: Real Result/Sample, Slide 3: Starter UGX Price + Tap to Message). When busy customers inquire, use Meta AI to polish clear replies and follow-ups fast.',
        practicalExample:
          'Running a free weekly "AI & Smart Business Tips" WhatsApp Channel that builds trust with 200+ local entrepreneurs and feeds inquiries every week.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Your AI Services Desk',
        idea: '15-sec Before/After TikTok & Reels showing photo repairs, flyers, and custom web apps',
        toolHint: 'CapCut/Canva + ChatGPT Hooks',
      },
      {
        sector: 'Boutiques & Salons',
        idea: 'Daily 3-slide WhatsApp Status catalog drops with clear size/price tags and quick order links',
        toolHint: 'Meta AI + WhatsApp Business',
      },
      {
        sector: 'Restaurants & Bakeries',
        idea: 'Mouth-watering daily lunch special reels + localized Facebook Marketplace neighborhood promos',
        toolHint: 'Canva + ChatGPT Captions',
      },
      {
        sector: 'Real Estate & Car Sales',
        idea: 'Structured property & vehicle listing captions highlighting schools, road access, and payment terms',
        toolHint: 'ChatGPT + Meta AI',
      },
      {
        sector: 'Agro-Input & Vets',
        idea: 'Helpful 30-sec pest-prevention tips in WhatsApp Channels that attract farmer bulk buyers',
        toolHint: 'Meta AI in WhatsApp',
      },
      {
        sector: 'Schools & Training Hubs',
        idea: 'Student project showcase reels and parent testimonial posts for admission drives',
        toolHint: 'Canva + ChatGPT',
      },
    ],
    dailyAssessment: [
      {
        id: 'd9-q1',
        scenarioLabel: 'Stopping the Scroll',
        question: 'What captures attention fastest in the first 3 seconds of a TikTok, Instagram Reel, or Facebook clip?',
        options: [
          'A sharp curiosity hook paired with immediate Before/After visual proof of a real problem being solved.',
          'Two minutes of silence before speaking.',
          'A blurry still wall of tiny paragraphs.',
        ],
        correctIndex: 0,
        explanation: 'Visual transformation builds instant credibility without needing expensive paid advertising.',
      },
      {
        id: 'd9-q2',
        scenarioLabel: '3-Slide WhatsApp Funnel',
        question: 'In a daily 3-slide WhatsApp Status sales sequence, what is the cleanest flow?',
        options: [
          'Slide 1: Familiar problem -> Slide 2: Real result/sample -> Slide 3: Starter UGX price + Direct Tap to Order.',
          'Posting 45 unrelated memes followed by zero business info.',
          'Hiding all contact prices.',
        ],
        correctIndex: 0,
        explanation: 'A calm 3-slide story guides contacts from recognition to action without fatiguing viewers.',
      },
      {
        id: 'd9-q3',
        scenarioLabel: 'Converting Interest',
        question: 'Where should bio links across TikTok, Instagram, Facebook, and WhatsApp Channels send warm local prospects?',
        options: [
          'Directly into a pre-filled WhatsApp chat so inquiries close quickly.',
          'To a broken dead webpage.',
          'To an unmonitored spam form.',
        ],
        correctIndex: 0,
        explanation: 'Direct WhatsApp links capture local buyers while their intent is highest.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Social Media Content, WhatsApp Funnels & Video Scripting Retainer',
      targetClients: 'Boutiques, restaurants, salons, clinics, real estate agents, and hardware shops',
      pricingPackages: [
        'Starter Pack: 8 Branded Posts + Captions — UGX 120,000 ($33)',
        'Growth Retainer: 16 Posts + 4 Short Video Scripts/Mo — UGX 280,000/mo ($76)',
        'Full WhatsApp Catalog + Channel Launch Kit — UGX 180,000 ($49)',
      ],
      stepByStepDemo: [
        'Use ChatGPT to write 10 curiosity-driven 3-second opening hooks tailored to the client’s buyers.',
        'Batch-design 8 clean Canva graphics or record 4 short raw proof clips on a smartphone.',
        'Connect every TikTok, Instagram, and Facebook bio link straight to a pre-filled WhatsApp chat.',
      ],
    },
    readyToUsePrompt: {
      label: 'Multi-Industry Viral Reel & WhatsApp Funnel Prompt',
      promptText:
        'Write 5 short 20-second TikTok/Reels/Facebook video scripts for a [Salon / Poultry Farm / Digital Designer / Real Estate Broker]. Each script must start with an attention-grabbing 3-second hook, show a real proof moment, state one clear benefit, and finish with a direct WhatsApp call-to-action.',
    },
    practicalCheckpoint:
      'Draft one 20-second video hook + a matching 3-slide WhatsApp Status sequence for either your own AI services or a local business.',
  },
  {
    day: 10,
    id: 'day-10',
    title: 'Client Pricing, Delivery Protection, Remote Work & Final Certification',
    subtitle:
      'Packaging your multi-industry portfolio, winning local & remote diaspora clients, collecting 50% deposits safely, and earning your certificate.',
    durationLabel: '3 Hours · Launch & Final Exam',
    practicalRatio: 'Portfolio & Certification',
    imageUrl: PROGRAM_IMAGES.courseDay10,
    imageAlt: 'Rural Ugandan graduates celebrating with printed certificates, laptops, and smartphones beside solar mast',
    objectives: [
      'Assemble a crisp 4-sample showcase folder across different formats (1 Restored/Product Photo, 1 Card/Flyer/Sticker, 1 Proposal/Sheet, 1 Web App link).',
      'Protect your labor with watermarked previews and polite 50% booking deposit workflows.',
      'Learn how to pitch both neighborhood businesses and diaspora / international remote buyers cleanly.',
    ],
    modules: [
      {
        heading: '10.1 Professional Pricing, Watermarks & 50% Deposit Rules',
        explanation:
          'Never give away finished unwatermarked files before confirmation. Share a polite 3-tier price card upfront, collect a 50% booking deposit before custom execution, present a watermarked preview screenshot for tweaks, and deliver crisp print/HD files immediately upon final settlement.',
        practicalExample:
          'Sending a clean Canva watermarked preview screenshot on WhatsApp; once the client clears the 50% balance via Mobile Money, releasing the final print-ready PDF.',
      },
      {
        heading: '10.2 Local + Remote Freelancing & Your Final Exam',
        explanation:
          'Your skills work both across town and internationally: combine local contracts (schools, clinics, SACCOs, events, shops) with remote diaspora/global tasks (e-book formatting, LinkedIn headshots, web prototypes, promotional flyers). Proceed to the Final Exam tab now to claim your Official PDF Certificate!',
        practicalExample:
          'Securing two steady monthly retainers locally while selling custom e-books or web portals online.',
      },
    ],
    diverseUseCases: [
      {
        sector: 'Remote Freelancing',
        idea: 'Offering fast CV revamps, product visuals, and e-book formatting to diaspora & global clients',
        toolHint: 'ChatGPT + Canva + Workspace',
      },
      {
        sector: 'Monthly Local Retainers',
        idea: 'Managing weekly social flyers, WhatsApp catalogs, and quotation packs for 3–5 local businesses',
        toolHint: 'Meta AI + Canva + Docs',
      },
      {
        sector: 'Community AI Bureaus',
        idea: 'Running a shared neighborhood digital desk offering printing, passport grooming, letters, and proposals',
        toolHint: 'Full AI Toolkit',
      },
      {
        sector: 'SACCO Enterprise Teams',
        idea: 'Teaming up 3–5 cohort graduates to deliver full web apps, branding, and marketing to bigger clients',
        toolHint: 'Google AI Studio + Canva',
      },
    ],
    dailyAssessment: [
      {
        id: 'd10-q1',
        scenarioLabel: 'Deposit Protection',
        question: 'Before starting custom client designs or delivering unwatermarked print files, what safeguard keeps your income reliable?',
        options: [
          'Request a 50% booking deposit upfront, share watermarked preview screenshots for feedback, and send final files after balance clearance.',
          'Deliver final print files for free first and hope for future payment.',
          'Quote no price until finishing the entire project.',
        ],
        correctIndex: 0,
        explanation: '50% deposits filter serious clients, while watermarked proofs protect finished creative work.',
      },
      {
        id: 'd10-q2',
        scenarioLabel: 'Portfolio Diversity',
        question: 'Which 4 items form a persuasive starter digital showcase folder on your phone?',
        options: [
          '1 Restored/Product Photo + 1 Card/Flyer/Sticker + 1 Clean Letter/Quotation + 1 Live Web App link.',
          '4 blank empty folders with no samples.',
          'Only private passwords from past employers.',
        ],
        correctIndex: 0,
        explanation: 'Demonstrating four high-demand deliverables covers quick same-day cashflow and bigger monthly contracts.',
      },
      {
        id: 'd10-q3',
        scenarioLabel: 'Scaling With Retainers',
        question: 'Why pair fast same-day jobs (CVs, flyers, photo repairs) with monthly retainers?',
        options: [
          'Same-day jobs fund daily cashflow while monthly retainers provide steady recurring revenue every month.',
          'Monthly retainers forbid serving any new clients.',
          'Fast jobs cannot be advertised on WhatsApp.',
        ],
        correctIndex: 0,
        explanation: 'Combining immediate micro-orders with monthly business retainers creates sustainable financial independence.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: '30-Day Multi-Income Launch Blueprint',
      targetClients: 'Neighborhood SMEs, schools, clinics, event committees, and remote online buyers',
      pricingPackages: [
        'Fast Cashflow (Same Day): Photos, Passports, CVs, Letters — UGX 10K–45K',
        'Project Contracts: Flyers, Stickers, Price Cards, E-Books — UGX 50K–240K',
        'High-Value Systems: Web Apps & Monthly Retainers — UGX 150K–600K',
      ],
      stepByStepDemo: [
        'Save your 4 best diverse samples in a clean phone & Google Drive portfolio folder.',
        'Message 5 known contacts or local business owners today offering a clear starter package.',
        'Complete the Final Practical Exam now and download your official Digital PDF Certificate.',
      ],
    },
    readyToUsePrompt: {
      label: 'Confident Client Pitch & 50% Deposit Reply Prompt',
      promptText:
        'Write two warm, professional WhatsApp replies: (1) Presenting 3 clear packages (Starter, Standard, Pro) in UGX with turnaround times when a prospect asks "How much?", and (2) Politely explaining my 50% booking deposit + watermarked preview process before releasing final HD files.',
    },
    practicalCheckpoint:
      'Summarize your top 3 income services across different sectors, your deposit rule, and take the Final Exam to generate your Official PDF Certificate.',
  },
];

export const FINAL_COURSE_EXAM: ExamQuestion[] = [
  {
    id: 'q1',
    question:
      'Which built-in AI option works directly inside WhatsApp personal and group chats (@Meta AI) with no extra app download needed?',
    options: [
      'Meta AI inside WhatsApp',
      'Microsoft Paint only',
      'Bluetooth File Transfer',
      'Offline Calculator',
    ],
    correctIndex: 0,
  },
  {
    id: 'q2',
    question:
      'A client needs a clean formal passport photo with tidy hair and a clean-shaven face, without shaving in real life. What is the most important instruction to include in your ChatGPT image prompt?',
    options: [
      'Ask AI to generate a completely random face in a suit.',
      'Explicitly instruct AI to keep the exact face, proportions, eyes, nose, and identity 100% unchanged while adjusting only hair/beard grooming and white studio background.',
      'Replace their face with a cartoon avatar.',
      'Blur the entire face so details disappear.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    question:
      'When creating wedding cards, product sticker labels, flyers, or banners using AI and Canva, what is the best professional workflow?',
    options: [
      'Let AI generate tiny unreadable paragraphs directly inside the raw image and skip proofreading.',
      'Generate crisp clean background artwork or emblem marks with zero small text in AI, then add exact dates, names, and phone numbers in Canva.',
      'Send an unedited rough sketch straight to clients.',
      'Copy another company’s watermarked image from search results.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q4',
    question:
      'Which free platform covered in this course turns plain-English descriptions into complete interactive web apps (such as QR menus, clinic bookings, or loan calculators)?',
    options: [
      'Google AI Studio with Gemini',
      'Notepad text viewer',
      'Music player app',
      'PDF reader only',
    ],
    correctIndex: 0,
  },
  {
    id: 'q5',
    question:
      'What type of post gets the highest organic buyer engagement across TikTok, Instagram Reels, Facebook, and WhatsApp Status?',
    options: [
      'Long text walls with no visuals or call to action.',
      'A fast Before-and-After proof post with a 3-second curiosity hook and a direct WhatsApp message instruction.',
      'Spamming huge PDF files to strangers without context.',
      'Hiding all examples of your past work.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q6',
    question:
      'When sending a custom design, restored portrait, or e-book draft to a new client before full payment, how do professionals protect their labor?',
    options: [
      'Deliver the unwatermarked print-ready HD file upfront for free and hope they pay later.',
      'Collect a 50% booking deposit, send a lightly watermarked preview screenshot for approval, and deliver the final HD file upon balance settlement.',
      'Refuse to show any preview before full payment.',
      'Delete the project if a small tweak is requested.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q7',
    question:
      'How can small shops, artisans, and SACCOs quickly upgrade unformatted price messages and informal paper notes into reliable customer documents?',
    options: [
      'Use AI text prompting plus Google Docs or Canva templates to produce clean itemized quotations, shareable price cards, receipts, and formal notice letters.',
      'Stop giving customers written quotations altogether.',
      'Write unclear prices on temporary scrap paper.',
      'Avoid mentioning clear delivery dates or deposit terms.',
    ],
    correctIndex: 0,
  },
  {
    id: 'q8',
    question:
      'Which privacy habit must always be followed before pasting client records or letters into any AI assistant?',
    options: [
      'Include bank PINs, private passwords, and confidential National ID numbers freely in every prompt.',
      'Remove or anonymize private bank PINs, passwords, and sensitive personal IDs before prompting.',
      'Post private client photographs publicly without consent.',
      'Save client passwords inside public flyer templates.',
    ],
    correctIndex: 1,
  },
];
