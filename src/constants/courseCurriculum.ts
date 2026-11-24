import { PROGRAM_IMAGES } from './program';

export interface CourseLessonModule {
  heading: string;
  explanation: string;
  practicalExample: string;
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

export const FULL_COURSE_PROGRAM: CourseDayProgram[] = [
  {
    day: 1,
    id: 'day-01',
    title: 'Introduction to Free Modern AI Tools & Digital Income',
    subtitle:
      'Setting up ChatGPT, Google Gemini (AI Studio), Canva, and Google Workspace to immediately deliver high-value paid work from a phone or computer.',
    durationLabel: '3 Hours · 70% Practical',
    practicalRatio: 'Free Tools Setup',
    imageUrl: PROGRAM_IMAGES.trainingHub,
    imageAlt: 'Participants learning practical AI workflows on laptops and mobile devices',
    objectives: [
      'Understand the exact free tools needed to run a digital services desk (ChatGPT, Gemini, Google AI Studio, Canva, Google Docs/Sheets/Forms).',
      'Identify 10+ everyday services businesses and families already pay cash for today.',
      'Practice safe digital habits—never upload private passwords, PINs, or sensitive financial credentials.',
    ],
    modules: [
      {
        heading: '1.1 Your Zero-Cost Digital Agency Toolkit',
        explanation:
          'You do not need expensive software to produce global-standard work. With a free ChatGPT account, Google Gemini / AI Studio, Canva Free, and Google Workspace (Docs, Sheets, Forms), you have a complete writing, graphic design, photo editing, and web app development studio in your pocket.',
        practicalExample:
          'A student with one laptop or smartphone opens ChatGPT and Canva Free to deliver typed reports, logos, and event cards to local shops and schools within the same afternoon.',
      },
      {
        heading: '1.2 How Clients Pay for Results, Not Software',
        explanation:
          'Clients do not care how long a task took you; they pay for clean, fast, stress-free results. Turning a messy voice note or faded photograph into a polished deliverable in 10 minutes creates high-margin income.',
        practicalExample:
          'Turning a client’s rough WhatsApp voice message into a formal printed letter or clean quotation PDF in under 5 minutes.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Express Document & Business Typing Desk',
      targetClients: 'Students, clinics, landlords, church committees, and small retail shops',
      pricingPackages: [
        'Starter: Clean 1-Page Official Letter / Notice — UGX 10,000 ($3)',
        'Standard: 3-Page Formatted Report / Proposal — UGX 35,000 ($10)',
        'Pro: Monthly Document & Admin Support — UGX 150,000/mo ($40)',
      ],
      stepByStepDemo: [
        'Collect rough notes, voice notes, or handwritten photos from the client via WhatsApp.',
        'Paste the details into ChatGPT with a clear structure prompt to produce error-free text.',
        'Format inside Google Docs with clean headings, export as PDF, and deliver immediately.',
      ],
    },
    readyToUsePrompt: {
      label: 'Official Document Formatter Prompt',
      promptText:
        'Act as an executive office assistant. Turn these rough notes into a formal, polite, error-free official letter ready for printing. Use clear headings, short paragraphs, and placeholders for signature and date: [Paste Notes]',
    },
    practicalCheckpoint:
      'List 3 paid digital services (e.g. photo editing, flyer design, CV formatting, or web app setup) you will offer first in your community.',
  },
  {
    day: 2,
    id: 'day-02',
    title: 'Mastering ChatGPT Prompting for Professional Documents & Printables',
    subtitle:
      'Producing sellable school reports, business proposals, structured spreadsheets, and printables people happily buy.',
    durationLabel: '3.5 Hours · 70% Practical',
    practicalRatio: 'Document Engineering',
    imageUrl: PROGRAM_IMAGES.digitalFreelance,
    imageAlt: 'Digital creator crafting formatted documents and spreadsheets with AI',
    objectives: [
      'Master the 4-Part Prompt Formula (Role + Context + Task + Output Format).',
      'Generate structured school term reports, academic worksheets, and business templates.',
      'Export AI tables straight into Google Sheets and formatted Google Docs printables.',
    ],
    modules: [
      {
        heading: '2.1 Producing School Reports & Academic Printables',
        explanation:
          'Teachers, tutors, and school administrators spend countless hours writing individualized student report remarks, exam revision sheets, and printable timetables. ChatGPT generates structured remarks and clean printable layouts in seconds.',
        practicalExample:
          'Helping a local primary or secondary school generate personalized end-of-term student comment templates, neat grading tables in Google Sheets, and printable revision booklets.',
      },
      {
        heading: '2.2 High-Precision Business Proposals & Quotations',
        explanation:
          'Use ChatGPT to write itemized client quotations, supplier agreements, rental contracts, and project proposals that help local tradespeople win bigger contracts.',
        practicalExample:
          'A welder, caterer, or decorator wins a major contract because you prepared their clean 3-page itemized PDF quotation and work schedule.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'School Printables, Reports & Proposal Studio',
      targetClients: 'Private schools, parents, contractors, caterers, and event planners',
      pricingPackages: [
        'Single Event Quotation / Contract PDF — UGX 20,000 ($5)',
        'School Revision / Report Template Pack — UGX 50,000 ($14)',
        'Full Business Proposal (5–8 Pages) — UGX 100,000 ($27)',
      ],
      stepByStepDemo: [
        'Ask the client for raw figures, subject list, or service items via WhatsApp.',
        'Instruct ChatGPT to format tables and persuasive executive summary sections.',
        'Paste tables into Google Sheets / Google Docs, add client header & logo, and export clean PDF.',
      ],
    },
    readyToUsePrompt: {
      label: 'School Report & Printable Generator Prompt',
      promptText:
        'Act as an experienced academic coordinator. Create a clean printable end-of-term student progress report template with sections for Subject Scores, Teacher Remarks (positive & constructive), Attendance, and Next Term Goals. Present as a neat markdown table ready for Google Docs.',
    },
    practicalCheckpoint:
      'Write a 4-part prompt to generate either a school revision sheet or a client service quotation with itemized pricing.',
  },
  {
    day: 3,
    id: 'day-03',
    title: 'ChatGPT Image Restoration & Facial Grooming Enhancement',
    subtitle:
      'Restoring damaged old family photos, fixing blurry portraits, and creating clean formal passport photos without changing the person’s real face.',
    durationLabel: '4 Hours · 75% Practical',
    practicalRatio: 'AI Photo Studio',
    imageUrl: PROGRAM_IMAGES.digitalFreelance,
    imageAlt: 'Designer performing high-resolution portrait enhancement on screen',
    objectives: [
      'Restore torn, faded, black-and-white, or stained historical family photographs into crisp full-color portraits.',
      'Clean up unruly hair, shave or trim overgrown beards digitally, and preserve 100% authentic facial identity for formal passport or job photos.',
      'Color-correct lighting and sharpen low-light smartphone selfies into studio-quality portraits.',
    ],
    modules: [
      {
        heading: '3.1 Old & Damaged Photograph Restoration',
        explanation:
          'Millions of families hold priceless torn, water-damaged, or faded photos of parents and grandparents. Using ChatGPT’s latest multimodal image model, you upload the scanned photo and instruct it to repair creases, reconstruct textures naturally, and optionally colorize realistically while keeping every facial feature identical.',
        practicalExample:
          'Taking a scratched 1980s wedding or graduation snapshot photographed with a phone, restoring full color and clarity, and delivering a frame-ready digital & print file for UGX 30,000–60,000.',
      },
      {
        heading: '3.2 Passport Photo Grooming (Hair & Beard Adjustment Without Shaving)',
        explanation:
          'Imagine a client urgently needs a clean passport, visa, or corporate ID photo, but their hair is untidy or their beard is overgrown—and they do not want to shave in real life. Upload their clear selfie to ChatGPT and instruct it precisely to keep their exact facial structure, eyes, nose, skin tone, and expression 100% unchanged while giving them a neat clean-shaven or trimmed beard, tidy formal haircut, and plain white studio background.',
        practicalExample:
          'A job applicant sends a casual outdoor selfie on WhatsApp; in 3 minutes you generate a crisp, clean-shaven, suited, white-background passport sheet ready for printing or online portal upload.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'AI Photo Restoration & Instant Passport Studio',
      targetClients: 'Job seekers, visa applicants, graduates, families, and printing shops',
      pricingPackages: [
        'Passport Photo Cleanup & White BG — UGX 10,000 ($3)',
        'Digital Grooming + Suit Outfit Swap — UGX 20,000 ($5)',
        'Full Old Photo Restoration + Colorize — UGX 45,000 ($12)',
      ],
      stepByStepDemo: [
        'Receive the client’s original clear front-facing photo or photo of an old print.',
        'Upload to ChatGPT and run an identity-locking restoration or grooming prompt.',
        'Inspect carefully to confirm the face looks 100% like the real person, arrange 4-up or 6-up grid in Canva for printing if needed, and deliver via WhatsApp Document mode (full HD).',
      ],
    },
    readyToUsePrompt: {
      label: 'Passport Grooming & Identity-Lock Prompt',
      promptText:
        'Using the uploaded photo, keep the person’s exact face, facial proportions, eyes, nose, skin tone, and natural expression 100% unchanged. Cleanly give them a neat short professional haircut and a clean-shaven face (remove overgrown beard naturally), dress them in a crisp navy-blue formal suit and white shirt, place them against a pure plain white passport studio background with soft even studio lighting, straight front-facing posture.',
    },
    practicalCheckpoint:
      'Write your own custom prompt for restoring an old faded family photo OR preparing a clean formal ID portrait while preserving identity.',
  },
  {
    day: 4,
    id: 'day-04',
    title: 'Outfit Changes, Background Swaps & Professional Product Mockups',
    subtitle:
      'Transforming casual snapshots into executive headshots, swapping backgrounds, and making local products look like luxury brands.',
    durationLabel: '4 Hours · 75% Practical',
    practicalRatio: 'Visual Editing Lab',
    imageUrl: PROGRAM_IMAGES.digitalFreelance,
    imageAlt: 'Creative specialist editing outfits and backgrounds for client campaigns',
    objectives: [
      'Swap casual t-shirts into sharp corporate suits, medical scrubs, graduation gowns, or traditional formal wear.',
      'Replace cluttered home or shop backgrounds with clean studio backdrops, modern offices, or lifestyle environments.',
      'Turn plain phone photos of bottled honey, skincare, shoes, or snacks into high-converting e-commerce product shots.',
    ],
    modules: [
      {
        heading: '4.1 Outfit Swaps & Executive Portrait Makeovers',
        explanation:
          'Young graduates and business owners often lack studio suits or photography budgets. With ChatGPT image editing, you change their outfit, adjust lighting so shadows match naturally, and place them in a clean corporate studio background.',
        practicalExample:
          'Converting a phone photo of a small boutique owner into a sharp executive LinkedIn & WhatsApp Business profile portrait.',
      },
      {
        heading: '4.2 Product Photography & Background Replacement',
        explanation:
          'Remove messy tables or concrete floors behind products. Place client merchandise onto sunlit marble, wooden kitchen counters, or clean minimalist studio pedestals for instant social media ads.',
        practicalExample:
          'A home baker or clothing seller sends 5 messy table photos; you return 5 polished studio catalog shots ready for Instagram and WhatsApp Status.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'E-Commerce Product & Executive Headshot Service',
      targetClients: 'Online boutiques, food vendors, cosmetics sellers, real estate agents, LinkedIn users',
      pricingPackages: [
        '3 Executive LinkedIn / Profile Headshots — UGX 25,000 ($7)',
        '10 Product Studio Background Edits — UGX 50,000 ($14)',
        'Full Brand Catalog Makeover (25 Photos) — UGX 120,000 ($33)',
      ],
      stepByStepDemo: [
        'Ask the seller to take well-lit photos of their products in daylight.',
        'Upload each photo to ChatGPT or Canva Background Remover with a studio scene prompt.',
        'Add crisp UGX price tags and contact number inside Canva and send back as a ready-to-post carousel.',
      ],
    },
    readyToUsePrompt: {
      label: 'Product Studio Background Prompt',
      promptText:
        'Keep the exact product bottle/item from the uploaded image completely accurate with its original label and text. Remove the cluttered background and place the product cleanly on a sunlit natural wooden countertop with soft shadows, fresh green leaves softly blurred behind it, commercial lifestyle photography lighting.',
    },
    practicalCheckpoint:
      'Describe how you would transform a casual smartphone product photo into a high-value commercial catalog image.',
  },
  {
    day: 5,
    id: 'day-05',
    title: 'Logos, Flyers, Banners & Invitation Cards with ChatGPT + Canva',
    subtitle:
      'Designing wedding/graduation invitation cards, business flyers, roadside banners, and brand logos in minutes.',
    durationLabel: '4 Hours · 80% Practical',
    practicalRatio: 'Graphic Design Lab',
    imageUrl: PROGRAM_IMAGES.enterprisePitch,
    imageAlt: 'Professionals reviewing branding flyers and invitation cards',
    objectives: [
      'Generate original vector-style emblems, icons, and backgrounds in ChatGPT Image Generation.',
      'Combine AI illustrations with Canva’s crisp typography, grids, and print-bleed templates so text is always 100% spelling-accurate.',
      'Deliver printable and WhatsApp-ready wedding cards, birthday invites, church posters, and pull-up banners.',
    ],
    modules: [
      {
        heading: '5.1 The Golden Combo: ChatGPT Art + Canva Typography',
        explanation:
          'While AI generates stunning illustrations, backgrounds, and logo marks, finishing your final layout inside Canva guarantees razor-sharp phone numbers, dates, QR codes, and print dimensions (A5 flyers, 6x3 ft tarpaulin banners, or 1080x1350 Instagram posts).',
        practicalExample:
          'Creating an ornate gold-and-emerald floral invitation background in ChatGPT, importing it into Canva, and typing the exact wedding ceremony schedule cleanly on top.',
      },
      {
        heading: '5.2 Logos, Brand Kits & High-Impact Flyers',
        explanation:
          'Every new salon, restaurant, hardware shop, or logistics rider needs a clean logo and opening flyer. Offer bundled Starter Brand Kits combining logo + business card + WhatsApp flyer.',
        practicalExample:
          'Delivering a complete brand pack (Logo + Price List Poster + Business Card PDF) to a newly opened salon within 2 hours.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Cards, Flyers, Banners & Brand Logo Desk',
      targetClients: 'Wedding committees, churches, schools, salons, restaurants, events',
      pricingPackages: [
        'Digital WhatsApp Invitation Card / Flyer — UGX 25,000 ($7)',
        'Print-Ready Banner + Flyer Bundle — UGX 60,000 ($16)',
        'Complete Logo + Business Card + Social Kit — UGX 120,000 ($33)',
      ],
      stepByStepDemo: [
        'Generate the clean background artwork or emblem symbol in ChatGPT (no cluttered small text).',
        'Upload the artwork to Canva, select the exact print or social size, and add crisp readable fonts.',
        'Export high-resolution PNG for WhatsApp and CMYK PDF Print for physical print shops.',
      ],
    },
    readyToUsePrompt: {
      label: 'Luxury Invitation Card Background Prompt',
      promptText:
        'Design a refined vertical luxury invitation card background with soft cream linen texture, subtle botanical eucalyptus and gold foil corner floral frame, clean empty center space for wedding text, soft natural studio lighting, zero text or letters on the image.',
    },
    practicalCheckpoint:
      'Outline the exact steps to combine a ChatGPT graphic with Canva text to produce an error-free flyer or invitation card.',
  },
  {
    day: 6,
    id: 'day-06',
    title: 'Creating & Selling Digital Books (E-Books), Guides & Printables',
    subtitle:
      'Packaging practical knowledge into sellable PDF e-books, recipe guides, revision booklets, and Notion/Sheets planners.',
    durationLabel: '3.5 Hours · 75% Practical',
    practicalRatio: 'Digital Publishing',
    imageUrl: PROGRAM_IMAGES.digitalFreelance,
    imageAlt: 'Author assembling digital books and educational guides on laptop',
    objectives: [
      'Identify profitable e-book and printable niches (exam prep, poultry feeding guides, skincare recipes, parenting, small business checklists).',
      'Use ChatGPT to outline, draft, and edit clear chapters grounded in real local experience.',
      'Design an eye-catching 3D book cover and clean interior layout in Canva ready to sell via WhatsApp, Selar, or Paystack/Mobile Money.',
    ],
    modules: [
      {
        heading: '6.1 Write Once, Sell 1,000 Times',
        explanation:
          'Physical services trade your hours for money. Digital books and printable planners are built once and sold repeatedly for UGX 10,000–30,000 per copy with near-zero delivery cost over WhatsApp or Telegram.',
        practicalExample:
          'Packaging a practical "Beginner’s Guide to Starting Profitable Layer Poultry" or "40 Fast Healthy Lunchbox Recipes" as a crisp 25-page PDF booklet with checklists.',
      },
      {
        heading: '6.2 Ghostwriting & E-Book Formatting for Experts',
        explanation:
          'Doctors, pastors, fitness coaches, and experienced farmers have valuable knowledge but lack time to write. Interview them for 30 minutes, use AI to structure their exact insights into a polished e-book, and charge a setup fee.',
        practicalExample:
          'Turning a nutritionist’s 4 voice notes into a branded 30-page wellness guide they sell to their followers.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Digital Book Publishing & Ghostwriting',
      targetClients: 'Content creators, coaches, teachers, farmers, and direct social media buyers',
      pricingPackages: [
        'Self-Published Practical Guide (Per Copy) — UGX 15,000 ($4)',
        'E-Book Cover + Interior Formatting — UGX 80,000 ($22)',
        'Done-For-You 25-Page E-Book Ghostwriting — UGX 250,000 ($68)',
      ],
      stepByStepDemo: [
        'Pick one clear problem audience members gladly pay to solve.',
        'Co-write actionable chapters + real checklists with ChatGPT (avoiding generic fluff).',
        'Design cover + clean two-column pages in Canva, export interactive PDF, and sell via a short TikTok/WhatsApp funnel.',
      ],
    },
    readyToUsePrompt: {
      label: 'Actionable E-Book Chapter Architect Prompt',
      promptText:
        'Act as a bestselling practical non-fiction editor. Help me outline a concise 6-chapter practical e-book titled "[Your Title]" for everyday readers. Keep every chapter focused on step-by-step action checklists, common mistakes to avoid, and simple examples—no academic jargon.',
    },
    practicalCheckpoint:
      'Write a title, target buyer, and 5-chapter outline for a digital book or printable pack you can create this week.',
  },
  {
    day: 7,
    id: 'day-07',
    title: 'Building Real Web Apps for Free with Gemini in Google AI Studio',
    subtitle:
      'Creating interactive websites, booking portals, business calculators, and shop managers with zero upfront hosting cost.',
    durationLabel: '4.5 Hours · 80% Practical',
    practicalRatio: 'No-Code / AI App Building',
    imageUrl: PROGRAM_IMAGES.trainingHub,
    imageAlt: 'Builder testing live web applications inside Google AI Studio',
    objectives: [
      'Prompt Gemini inside Google AI Studio to generate complete, mobile-friendly React web apps for free.',
      'Build real business tools local owners pay for: digital shop catalogs, appointment schedulers, invoice/receipt makers, school fee calculators, and restaurant QR menus.',
      'Iterate, test on mobile screens, and deploy or share live app links with paying clients.',
    ],
    modules: [
      {
        heading: '7.1 From Plain English Prompt to Working Web App',
        explanation:
          'In Google AI Studio, describing a business problem in clear English generates an entire working web interface. You do not need years of coding—you need clear product thinking: what buttons, inputs, tables, and outputs the client needs.',
        practicalExample:
          'Building a clean mobile Salon & Barber Booking Web App where customers pick a service, see UGX prices, choose a time slot, and send their booking summary straight to the salon’s WhatsApp.',
      },
      {
        heading: '7.2 Top 5 Sellable Web Apps You Can Build Free',
        explanation:
          '(1) Restaurant / Cafe QR Digital Menu with instant WhatsApp order cart, (2) Shop Daily Sales & Profit Tracker, (3) Clinic / Pharmacy Appointment & Patient Queue Board, (4) Real Estate Property Listing Showcase, (5) Event RSVP & Invitation Micro-Site.',
        practicalExample:
          'A neighborhood cafe replaces tattered paper menus with a sleek QR digital menu app built in Google AI Studio for UGX 250,000 setup + UGX 40,000 monthly updates.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Custom Business Web Apps & Micro-Sites',
      targetClients: 'Restaurants, salons, hardware shops, clinics, schools, event hosts, freelancers',
      pricingPackages: [
        'Digital QR Menu / Link-In-Bio Micro-Site — UGX 150,000 ($40)',
        'Custom Booking / Invoice Web App — UGX 350,000 ($95)',
        'Full Business Portal + Monthly Care — UGX 600,000+ ($160+)',
      ],
      stepByStepDemo: [
        'Ask a local business owner what paper headache wastes their time (orders, invoices, bookings).',
        'Describe the exact screens and mobile layout in Google AI Studio using clear plain English.',
        'Test every button on mobile view, customize their brand colors and logo, and demo live on your phone to close the sale.',
      ],
    },
    readyToUsePrompt: {
      label: 'Google AI Studio Client App Prompt',
      promptText:
        'Build a clean, mobile-first React + Tailwind web application for "[Business Name]", a local [Salon / Cafe / Clinic]. Include: (1) A sleek service menu with prices in UGX, (2) An interactive cart or booking slot picker, (3) A summary screen that formats the customer order/appointment into a one-tap WhatsApp message link, and (4) Clear large buttons for mobile shoppers.',
    },
    practicalCheckpoint:
      'Write a detailed Google AI Studio prompt for a real web app that solves one daily problem for a shop, school, or service provider.',
  },
  {
    day: 8,
    id: 'day-08',
    title: 'Google Workspace Automation (Forms, Sheets & Docs Workflows)',
    subtitle:
      'Setting up client intake forms, live expense dashboards, automated attendance sheets, and organized cloud drives.',
    durationLabel: '3.5 Hours · 75% Practical',
    practicalRatio: 'Workspace Systems',
    imageUrl: PROGRAM_IMAGES.digitalFreelance,
    imageAlt: 'Coordinator managing automated spreadsheets and client forms',
    objectives: [
      'Build clean Google Forms for customer orders, event RSVPs, school admissions, and feedback surveys.',
      'Ask ChatGPT to write exact Google Sheets formulas (`SUMIF`, `COUNTIF`, profit trackers, stock alerts) without memorizing syntax.',
      'Connect Google Forms responses straight into live organized Google Sheets for organizations.',
    ],
    modules: [
      {
        heading: '8.1 Google Forms + Sheets for Busy Organizations',
        explanation:
          'Small businesses, churches, and associations constantly lose customer contacts written on scraps of paper. Setting up a branded Google Form linked to a color-coded Google Sheet organizes every registration automatically.',
        practicalExample:
          'Setting up an automated online registration form and fee payment tracker sheet for a local sports tournament or training workshop.',
      },
      {
        heading: '8.2 Let AI Write Your Excel / Sheets Formulas',
        explanation:
          'Whenever you need to calculate monthly profit, highlight low inventory in red, or compute staff commissions, tell ChatGPT your exact column letters (e.g., Column B is Cost, Column C is Sales) and paste the formula straight into Google Sheets.',
        practicalExample:
          'Building a daily retail stock & profit tracker sheet for a supermarket or pharmacy owner in 15 minutes.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Google Workspace Setup & Bookkeeping Systems',
      targetClients: 'Hardware stores, NGOs, event organizers, associations, schools',
      pricingPackages: [
        'Custom Google Form + Linked Sheet — UGX 50,000 ($14)',
        'Automated Sales & Inventory Sheet — UGX 120,000 ($33)',
        'Full Office Cloud Digitization Setup — UGX 250,000 ($68)',
      ],
      stepByStepDemo: [
        'Map out the client’s paper register columns (Date, Customer, Item, Price, Status).',
        'Create the Google Form and ask ChatGPT for summary formulas in the linked Google Sheet.',
        'Hand over the live sheet on the owner’s phone so they monitor daily sales anywhere.',
      ],
    },
    readyToUsePrompt: {
      label: 'Google Sheets Formula Assistant Prompt',
      promptText:
        'In Google Sheets, my columns are: A = Date, B = Service Name, C = Amount Paid (UGX), D = Expense (UGX), E = Status ("Paid" or "Pending"). Give me exact formulas for: (1) Total Paid Revenue, (2) Total Pending Payments, and (3) Net Profit. Keep instructions step-by-step.',
    },
    practicalCheckpoint:
      'Design a 5-column Google Sheet structure for tracking client orders and payments for your digital service business.',
  },
  {
    day: 9,
    id: 'day-09',
    title: 'Viral Social Media Growth (TikTok, IG, Facebook & WhatsApp Funnels)',
    subtitle:
      'Proven short-video hooks, before/after showcases, WhatsApp Status/Channels strategies, and pricing menus that convert viewers into paying buyers.',
    durationLabel: '4 Hours · 80% Practical',
    practicalRatio: 'Growth & Sales',
    imageUrl: PROGRAM_IMAGES.enterprisePitch,
    imageAlt: 'Creators planning viral social campaigns and WhatsApp buyer funnels',
    objectives: [
      'Apply the 3-Second Hook + Before/After Transformation formula on TikTok, Instagram Reels, and Facebook.',
      'Turn WhatsApp Groups, WhatsApp Business Catalogs, Status updates, and WhatsApp Channels into daily zero-ad-spend sales engines.',
      'Package crystal-clear Bronze / Silver / Gold service menus so buyers message you ready to pay.',
    ],
    modules: [
      {
        heading: '9.1 The Viral "Before & After" Content Engine',
        explanation:
          'Nothing sells AI image restoration, passport cleanups, flyer design, or web apps faster than a 15-second screen recording showing the messy "Before" photo or blank screen on the left and the jaw-dropping "After" result on the right. People immediately comment "How much?" and share to friends.',
        practicalExample:
          'Posting a 15-second TikTok & Facebook Reel: "Watch me turn this faded 1995 photo into a crisp full-color portrait in 60 seconds — DM RESTORE for yours!"',
      },
      {
        heading: '9.2 WhatsApp Status, Groups & Channels Mastery',
        explanation:
          'Avoid spamming WhatsApp Groups with long text blocks. Instead, post one sharp sample image with a clear 2-line caption and price, post 3–5 engaging Status slides daily (Proof + Process + Client Testimonial + Call-to-Action), and grow a WhatsApp Channel sharing free AI tips that naturally advertise your services.',
        practicalExample:
          'Sharing a weekly "Free AI Tip" inside a neighborhood business WhatsApp Channel that brings 4–8 direct inbox inquiries every week.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'Social Media Management & Viral Content Retainer',
      targetClients: 'Local shops, salons, fashion boutiques, restaurants, real estate brokers, and your own AI studio',
      pricingPackages: [
        'Launch Starter: 8 Custom Posts + Captions — UGX 120,000 ($33)',
        'Growth Retainer: 16 Posts + 4 Reels/Mo — UGX 280,000/mo ($76)',
        'Full Brand Funnel + WhatsApp Catalog — UGX 450,000/mo ($122)',
      ],
      stepByStepDemo: [
        'Use ChatGPT to write 10 curiosity-driven 3-second video hooks tailored to your niche.',
        'Record short crisp phone videos or screen recordings of real before/after transformations.',
        'Pin your 3-tier price card at the top of WhatsApp Business Catalog and include your direct WhatsApp link in every TikTok/IG/FB bio.',
      ],
    },
    readyToUsePrompt: {
      label: 'Viral TikTok / Reel & WhatsApp Funnel Prompt',
      promptText:
        'Write 5 viral 20-second TikTok/Instagram Reel scripts to sell my [Photo Restoration / Flyer Design / Web App] service. Start each script with an attention-grabbing 3-second hook, show a Before-and-After proof moment, state a clear starter price in UGX, and end with a strong call to message me on WhatsApp.',
    },
    practicalCheckpoint:
      'Write a 3-slide WhatsApp Status sequence (Slide 1: Hook/Problem, Slide 2: Proof/Sample, Slide 3: Price + CTA) for your service.',
  },
  {
    day: 10,
    id: 'day-10',
    title: 'Client Delivery, Pricing Packages & Final Certification Prep',
    subtitle:
      'Closing your first paying customers reliably, collecting deposits cleanly, delivering quality work, and preparing for the final exam.',
    durationLabel: '3 Hours · Final Portfolio & Exam',
    practicalRatio: 'Certification Readiness',
    imageUrl: PROGRAM_IMAGES.enterprisePitch,
    imageAlt: 'Graduates presenting portfolios and launching digital businesses',
    objectives: [
      'Assemble your 3-sample digital portfolio (1 Restored/Edited Photo, 1 Flyer/Card, 1 Document or Web App).',
      'Use polite deposit & balance payment scripts (50% upfront to start, 50% on watermarked preview approval before sending final HD file).',
      'Complete the Final Practical Exam to earn your official A4 Digital PDF Certificate.',
    ],
    modules: [
      {
        heading: '10.1 Protecting Your Work: Watermarked Previews & Deposits',
        explanation:
          'Never get unpaid after doing great work. Always ask for a 50% booking deposit for custom work, send a low-resolution or lightly watermarked preview screenshot in Canva for client approval, and release the crisp unwatermarked HD file or PDF immediately after final balance settlement.',
        practicalExample:
          'Sending a clean watermarked preview of an invitation card on WhatsApp; client pays the balance via Mobile Money, and you immediately deliver the print-ready PDF.',
      },
      {
        heading: '10.2 Ready for the Final Exam & Certificate',
        explanation:
          'You have mastered free modern AI workflows across writing, photo restoration/grooming, graphic design, digital books, Google AI Studio app creation, Workspace automation, and social media viral growth. Switch to the Final Exam tab now to certify your achievement!',
        practicalExample:
          'Completing the final assessment unlocks your instant A4 Digital PDF Certificate bearing your verified uppercase full name.',
      },
    ],
    onlineIncomePlaybook: {
      opportunityTitle: 'First 30-Day Launch Checklist',
      targetClients: 'Your first 5 paying local or online clients',
      pricingPackages: [
        'Quick Wins: Passport / Photo Edits (UGX 10K–45K)',
        'Steady Cashflow: Flyers, Cards, Proposals (UGX 25K–100K)',
        'High Ticket: Web Apps & Retainers (UGX 150K–600K)',
      ],
      stepByStepDemo: [
        'Save your 3 best practice samples into one clean phone folder.',
        'Post your Before/After reel on TikTok, Facebook, Instagram, and WhatsApp Status today.',
        'Complete the Final Exam below and download your official A4 Certificate.',
      ],
    },
    readyToUsePrompt: {
      label: 'Polite Client Pitch & Price Reply Prompt',
      promptText:
        'Write a warm, confident WhatsApp reply to a customer asking how much I charge for [Service]. Present 3 simple packages (Starter, Standard, Pro) in UGX, explain the fast turnaround time, and politely state the 50% booking deposit requirement.',
    },
    practicalCheckpoint:
      'Summarize your signature service package, deposit rule, and marketing plan, then proceed to the Final Exam to generate your A4 PDF Certificate.',
  },
];

export const FINAL_COURSE_EXAM: ExamQuestion[] = [
  {
    id: 'q1',
    question:
      'A client needs a clean formal passport photo with tidy hair and a clean-shaven face, without shaving in real life. What is the most important instruction to include in your ChatGPT image prompt?',
    options: [
      'Ask AI to generate a completely random handsome face in a suit.',
      'Explicitly instruct AI to keep the exact face, proportions, eyes, nose, and identity 100% unchanged while adjusting only hair/beard grooming and white studio background.',
      'Replace their face with a cartoon avatar.',
      'Blur the entire face so the beard is less visible.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q2',
    question:
      'When creating wedding invitation cards, flyers, or roadside banners using ChatGPT and Canva, what is the best professional workflow?',
    options: [
      'Let AI generate tiny unreadable paragraphs directly inside the raw image and never check spelling.',
      'Generate crisp clean background artwork or logo marks in ChatGPT without cluttered small text, then add exact dates, names, and phone numbers in Canva.',
      'Send a rough pencil sketch to the printing shop.',
      'Copy another company’s watermarked image from the internet.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    question:
      'Which free platform covered in this course allows you to build complete interactive web apps (like a salon booking app or QR menu) from plain English prompts?',
    options: [
      'Microsoft Paint',
      'Google AI Studio with Gemini',
      'Notepad only',
      'Calculator App',
    ],
    correctIndex: 1,
  },
  {
    id: 'q4',
    question:
      'What type of short video or post gets the highest organic attention on TikTok, Instagram Reels, Facebook, and WhatsApp Status for digital services?',
    options: [
      'Posting only long text walls with no images or prices.',
      'Posting a fast 15-second Before-and-After transformation proof with a 3-second hook and clear call to message on WhatsApp.',
      'Sending unsolicited 20-page PDF files to random strangers.',
      'Hiding all examples of your work until someone pays.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q5',
    question:
      'When sending a custom flyer, restored portrait, or e-book draft to a new client before final payment, how do professionals protect their work?',
    options: [
      'Always send the final print-ready unwatermarked file for free first and hope they pay later.',
      'Collect a 50% booking deposit, send a lightly watermarked preview screenshot for approval, and deliver the final HD file upon balance payment.',
      'Refuse to show any preview at all.',
      'Delete the project if they ask for one small edit.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q6',
    question:
      'Why do organizations pay well for Google Forms linked to Google Sheets?',
    options: [
      'Because responses automatically organize into a live table where AI-generated formulas calculate totals, pending balances, and reports instantly.',
      'Because Google Forms replaces the internet completely.',
      'Because nobody knows how to type on paper anymore.',
      'Because spreadsheets delete client records every 24 hours.',
    ],
    correctIndex: 0,
  },
  {
    id: 'q7',
    question:
      'Which rule protects privacy when working with AI assistants on client documents?',
    options: [
      'Paste private bank PINs, National IDs, and confidential passwords freely into every chat.',
      'Remove or anonymize private sensitive credentials, bank PINs, and confidential personal IDs before prompting.',
      'Share client private photos publicly without permission.',
      'Save client passwords inside public flyer templates.',
    ],
    correctIndex: 1,
  },
  {
    id: 'q8',
    question:
      'What makes a self-published PDF e-book or printable guide sell consistently on social media and WhatsApp?',
    options: [
      'Filling 200 pages with generic dictionary definitions.',
      'Solving one clear, practical everyday problem with step-by-step checklists, a crisp Canva cover, and an affordable digital price.',
      'Making the text tiny and impossible to read on a mobile phone.',
      'Never telling anyone the topic or price.',
    ],
    correctIndex: 1,
  },
];
