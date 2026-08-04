import { useEffect, useRef, useState } from 'react'
import { ArrowUpLeft, ArrowUpRight, Mail, MessageCircleCheck, Phone, Send } from 'lucide-react'
import './TreatmentPage.css'

/* ── FAQs shared across all four neurotoxins ──────────────── */
const NEURO_FAQS = [
  { q: 'How does it work?', a: 'Neuromodulators temporarily relax targeted facial muscles by blocking the nerve signals that cause them to contract, softening dynamic wrinkles like frown lines, crow\'s feet, and forehead creases.' },
  { q: 'Will it make me look frozen?', a: 'No. At La Belle Vie our approach emphasizes natural expression. The goal is to soften lines while preserving movement—you can still smile, frown, and emote, just with fewer wrinkles.' },
  { q: 'When will I see results, and how long do they last?', a: 'You may notice improvement in as little as 2–3 days, with full results within ~14 days. Most patients enjoy results for 3–4 months; in some cases up to 5–6 months with consistent maintenance.' },
  { q: 'Does it hurt?', a: 'Most people describe slight pinpricks. We can use topical numbing or ice if desired to reduce discomfort.' },
  { q: 'Am I a good candidate?', a: 'Ideal candidates are healthy adults who want to reduce dynamic facial lines. Those who are pregnant, nursing, have neuromuscular disorders, or take certain medications may not be eligible—we\'ll review your history at your consultation.' },
  { q: 'How often should I come back?', a: 'We typically recommend repeat treatments every 3–4 months. With consistent treatments, some patients see longer-lasting responses over time.' },
  { q: 'Can I combine this with other treatments?', a: 'Yes—combining with fillers, microneedling, laser, or a skin-care regimen often provides more comprehensive rejuvenation. We\'ll tailor a plan to your goals.' },
  { q: 'Are there risks?', a: 'Side effects are usually mild and temporary (bruising, swelling, slight asymmetry). Treatment is not recommended during pregnancy or breastfeeding. We review your medications and medical history to ensure safety.' },
]

const makeTreatment = (title, category, description, time, results, downtime, faqs = [], extras = {}) => ({
  title,
  category,
  description,
  details: [
    { heading: 'Treatment Time', text: time },
    { heading: 'Results', text: results },
    { heading: 'Downtime', text: downtime },
  ],
  faqs: faqs.length ? faqs : undefined,
  ...extras,
})

/* ── Shared timeline / candidate extras by category ─────────── */
const NEURO_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'Treatment complete in 15–30 min; leave normally' },
    { step: 'Days 3–7', label: 'Muscles begin to relax, early softening visible' },
    { step: '2 weeks', label: 'Full effect reached — optimal results' },
    { step: '3–4 months', label: 'Schedule maintenance to keep results consistent' },
  ],
  idealFor: ['Dynamic wrinkles: frown lines, crow\'s feet, forehead creases', 'Preventative treatment in your 20s–30s', 'Refreshed, natural-looking results with zero downtime', 'Those already using or curious about neurotoxin injectables'],
  notFor: ['Pregnant or nursing', 'Neuromuscular conditions (e.g. ALS, myasthenia gravis)', 'Certain antibiotics or blood thinners', 'Active infection at the injection site'],
}

const FILLER_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'Immediate volume — results visible right away' },
    { step: 'Days 1–3', label: 'Peak swelling may occur; bruising is possible' },
    { step: '2 weeks', label: 'Swelling resolves — final result visible' },
    { step: '6–18 months', label: 'Results last based on product and area treated' },
  ],
  idealFor: ['Volume loss, hollowness, or deflation', 'Softening deep lines or folds', 'Improving facial symmetry or proportion', 'Natural-looking enhancement without surgery'],
  notFor: ['Active skin infection or cold sore at treatment site', 'Pregnant or nursing', 'Blood-thinning medications (increased bruising risk)', 'History of severe allergic reactions'],
}

const SKIN_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'Treatment complete; skin feels cleansed and refreshed' },
    { step: 'Days 1–7', label: 'Peeling or redness resolves (deeper treatments)' },
    { step: '4 weeks', label: 'Cell turnover complete — tone and texture improve' },
    { step: 'Ongoing', label: 'Best maintained with regular monthly sessions' },
  ],
  idealFor: ['Dullness, congestion, or uneven tone', 'Fine lines, texture concerns, or mild acne', 'Regular skin maintenance', 'Pre-event glow preparation'],
  notFor: ['Active rash, sunburn, or open wounds', 'Recent Accutane use (within 6–12 months)', 'Pregnancy (for certain chemical peels)', 'Active skin infection in treatment area'],
}

const LASER_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'Treatment performed; mild redness is normal' },
    { step: 'Week 1', label: 'Skin heals; spots may darken briefly before fading' },
    { step: '4–8 weeks', label: 'Primary improvement becomes visible' },
    { step: '3–6 months', label: 'Collagen continues to build; full results emerge' },
  ],
  idealFor: ['Sun damage, pigmentation, or age spots', 'Acne scarring or uneven texture', 'Those wanting significant improvement with minimal surgery', 'Lighter to medium skin tones (varies by treatment)'],
  notFor: ['Active tan or very dark skin tones (some devices)', 'Pregnant or nursing', 'Accutane within the past year', 'Active infection in the treatment area'],
}

const BODY_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'Treatment completed; minimal recovery needed' },
    { step: 'Weeks 2–4', label: 'Early changes may begin' },
    { step: '3 months', label: 'Primary results visible as your body responds' },
    { step: '6–18 months', label: 'Results continue; maintenance may be advised' },
  ],
  idealFor: ['Stubborn areas resistant to diet and exercise', 'Mild to moderate contouring concerns', 'Non-surgical body improvement', 'Those near their ideal weight'],
  notFor: ['Pregnant or nursing', 'Active skin condition in the treatment area', 'Certain bleeding disorders or medications', 'Expecting surgical-level results'],
}

const WOMENS_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'Brief in-office procedure; return home same day' },
    { step: 'Weeks 2–4', label: 'Initial changes in sensitivity or comfort begin' },
    { step: '2–3 months', label: 'Full benefit develops as tissue responds' },
    { step: '12–18 months', label: 'Results last; maintenance may be recommended' },
  ],
  idealFor: ['Postpartum or menopausal tissue changes', 'Decreased sensitivity or discomfort', 'Non-surgical intimate wellness', 'Women wanting a private, comfortable solution'],
  notFor: ['Pregnant or breastfeeding', 'Active vaginal or pelvic infection', 'Certain autoimmune or clotting conditions', 'Expecting surgical-level results'],
}

const HORMONE_EXTRAS = {
  timeline: [
    { step: 'Consult', label: 'Labs drawn, history reviewed, plan established' },
    { step: 'Weeks 2–4', label: 'Energy, mood, and sleep may begin to improve' },
    { step: '3 months', label: 'Full hormonal optimization typically reached' },
    { step: 'Ongoing', label: 'Regular monitoring maintains safe, effective levels' },
  ],
  idealFor: ['Fatigue, brain fog, or mood changes', 'Decreased libido or sexual function', 'Weight gain, muscle loss, or poor sleep', 'Those seeking evidence-based hormone optimization'],
  notFor: ['Active hormone-sensitive cancers', 'Uncontrolled cardiovascular conditions', 'Pregnant or breastfeeding', 'Those unwilling to commit to ongoing monitoring'],
}

const MENS_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'In-office procedure; same-day return to activity' },
    { step: 'Weeks 1–4', label: 'Initial functional improvements may begin' },
    { step: '2–3 months', label: 'Full benefit develops' },
    { step: '12+ months', label: 'Results last; a maintenance plan may be advised' },
  ],
  idealFor: ['Erectile dysfunction or decreased performance', 'Non-surgical, drug-free approaches', 'Those who have not found success with medications alone', 'Men interested in optimizing sexual health'],
  notFor: ['Active infection or untreated STI', 'Certain blood-thinning medications', 'Underlying vascular disease requiring separate treatment', 'Those with unrealistic expectations'],
}

const WELLNESS_EXTRAS = {
  timeline: [
    { step: 'Day of', label: 'Administered in office; no downtime required' },
    { step: 'Same day', label: 'Immediate hydration and early benefit possible' },
    { step: 'Days 1–7', label: 'Energy, clarity, or recovery benefits noticed' },
    { step: 'Ongoing', label: 'Best maintained with regular wellness sessions' },
  ],
  idealFor: ['Fatigue, low energy, or dehydration', 'Recovery support after illness or intense exercise', 'Nutritional deficiency or poor absorption', 'Wanting a wellness boost with no downtime'],
  notFor: ['Certain kidney or heart conditions', 'Allergy to specific vitamins or minerals', 'Uncontrolled diabetes (certain infusions)', 'Active infection at IV site'],
}

const WEIGHT_LOSS_EXTRAS = {
  timeline: [
    { step: 'Consult', label: 'Medical history reviewed, labs ordered, plan designed' },
    { step: 'Month 1', label: 'Medication titrated; early weight changes begin' },
    { step: 'Months 3–6', label: 'Most patients see significant progress' },
    { step: '12 months', label: 'Sustainable results with ongoing medical support' },
  ],
  idealFor: ['BMI of 27+ with related health concerns', 'Weight plateau despite diet and exercise', 'Medically supervised, accountable support', 'Interest in GLP-1 medications or supportive injections'],
  notFor: ['Pregnant or nursing', 'Personal or family history of thyroid cancer (GLP-1s)', 'Uncontrolled psychiatric conditions', 'Expecting results without lifestyle changes'],
}

export const TREATMENTS_DATA = {
  /* ── Injectables ──────────────────────────────────────── */
  'botox': {
    title: 'BOTOX®',
    category: 'Injectables',
    description: 'BOTOX® is an FDA-approved neuromodulator that temporarily relaxes the muscles responsible for dynamic wrinkles—frown lines, forehead creases, and crow\'s feet. Our practitioners take a precise, conservative approach so results look refreshed, never frozen. At La Belle Vie, we typically treat glabellar ("11") lines, forehead lines, crow\'s feet, bunny lines, lip lines, downturned mouth, neck bands, gummy smile, and other areas on request.',
    details: [
      { heading: 'Treatment Time', text: '15–30 minutes' },
      { heading: 'Results',        text: 'Visible within 3–7 days, lasting 3–4 months' },
      { heading: 'Downtime',       text: 'None' },
    ],
    faqs: NEURO_FAQS,
  },
  'dysport': {
    title: 'Dysport®',
    category: 'Injectables',
    description: 'Dysport® is a neuromodulator with a slightly smaller molecular size, allowing it to spread more naturally across larger areas like the forehead. Results often appear faster—within 2–3 days—while delivering smooth, long-lasting softening of expression lines including frown lines, forehead creases, and crow\'s feet.',
    details: [
      { heading: 'Treatment Time', text: '15–20 minutes' },
      { heading: 'Results',        text: 'Visible within 2–3 days, lasting 3–4 months' },
      { heading: 'Downtime',       text: 'None' },
    ],
    faqs: NEURO_FAQS,
  },
  'xeomin': {
    title: 'Xeomin®',
    category: 'Injectables',
    description: 'Xeomin® is a "naked" neuromodulator—free of complexing proteins and additives. This purified formula reduces the risk of developing resistance over time, making it an excellent option for patients who have used other neuromodulators long-term. It treats the same areas as other neuromodulators including frown lines, crow\'s feet, and forehead wrinkles.',
    details: [
      { heading: 'Treatment Time', text: '15–30 minutes' },
      { heading: 'Results',        text: 'Visible within 3–7 days, lasting 3–4 months' },
      { heading: 'Downtime',       text: 'None' },
    ],
    faqs: NEURO_FAQS,
  },
  'jeuveau': {
    title: 'Jeuveau® (Newtox)',
    category: 'Injectables',
    description: 'Jeuveau® is the newest FDA-approved neuromodulator, developed exclusively for aesthetic use. It targets the same muscle-relaxing pathways as other neuromodulators while offering a competitive price point and comparable efficacy for treating frown lines, forehead creases, and crow\'s feet.',
    details: [
      { heading: 'Treatment Time', text: '15–20 minutes' },
      { heading: 'Results',        text: 'Visible within 3–5 days, lasting 3–4 months' },
      { heading: 'Downtime',       text: 'None' },
    ],
    faqs: NEURO_FAQS,
  },

  /* ── Fillers & Volume ─────────────────────────────────── */
  'signature-cheeks': {
    title: 'Signature Cheeks',
    category: 'Fillers & Volume',
    description: 'Our Signature Cheeks treatment is a customized dermal filler protocol designed to restore lost midface volume, define the cheekbones, and create a natural-looking lift. We use hyaluronic acid fillers to sculpt balanced, harmonious results tailored to your anatomy. Our philosophy: fillers should help you look like the best version of yourself—refreshed, not overdone.',
    details: [
      { heading: 'Treatment Time', text: '30–45 minutes' },
      { heading: 'Results',        text: 'Immediate, full results at 2 weeks, lasting 12–18 months' },
      { heading: 'Downtime',       text: 'Possible light swelling or bruising 1–3 days' },
    ],
    faqs: [
      { q: 'Is filler reversible?', a: 'Yes—hyaluronic acid fillers can be dissolved with hyaluronidase if you are unhappy with the result, giving you peace of mind.' },
      { q: 'Does it hurt?', a: 'Most patients report mild discomfort. We use topical numbing and filler products that contain lidocaine to maximize comfort throughout the treatment.' },
      { q: 'How do I know how much filler I need?', a: 'Your provider will assess your facial anatomy and discuss your goals during consultation. We take a conservative approach—it\'s always easier to add than to remove.' },
      { q: 'Can I combine cheek filler with other treatments?', a: 'Absolutely. Cheek filler pairs well with BOTOX®, lip filler, and skin treatments for a comprehensive, harmonious result.' },
    ],
    ...FILLER_EXTRAS,
  },
  'signature-lips': {
    title: 'Signature Lips',
    category: 'Fillers & Volume',
    description: 'Our Signature Lips approach focuses on natural enhancement—improving shape, symmetry, and hydration without creating an overdone look. Whether you want subtle definition or noticeable volume, we customize every treatment to complement your features. We start conservatively and build slowly until you achieve your desired result.',
    details: [
      { heading: 'Treatment Time', text: '30 minutes' },
      { heading: 'Results',        text: 'Immediate, full results at 2 weeks, lasting 6–12 months' },
      { heading: 'Downtime',       text: 'Mild swelling for 1–3 days' },
    ],
    faqs: [
      { q: 'How long after treatment will I see the results?', a: 'Filler works relatively quickly—patients begin to see results within 30 minutes. There may be some bruising and swelling, so wait a day or two to see the final results.' },
      { q: 'What if I don\'t like my results or my lips end up too big?', a: 'At La Belle Vie we take a very conservative approach, especially for first-time patients. We start with a minimal amount and add more slowly until you reach the desired result. If needed, we can dissolve the filler and return to your original appearance.' },
      { q: 'Is the procedure painful?', a: 'Most patients report very little pain—similar to a light pinch or bee sting. We use numbing cream to help minimize discomfort.' },
      { q: 'Are there side effects?', a: 'When administered by a properly trained injector, side effects are minimal—possibly some minor swelling and bruising. Properly done lip filler carries very little risk.' },
    ],
    ...FILLER_EXTRAS,
  },
  'under-eye-filler': {
    title: 'Under Eye Filler',
    category: 'Fillers & Volume',
    description: 'Under eye filler targets the tear trough—the hollow between the lower eyelid and cheek—to reduce the appearance of dark circles, hollowness, and under-eye shadowing. Using ultra-soft hyaluronic acid filler, we restore a refreshed, well-rested look that doesn\'t look overdone.',
    details: [
      { heading: 'Treatment Time', text: '30–45 minutes' },
      { heading: 'Results',        text: 'Immediate, lasting 12–18 months' },
      { heading: 'Downtime',       text: 'Possible bruising or swelling 3–5 days' },
    ],
    faqs: [
      { q: 'Is under-eye filler safe?', a: 'Yes, when performed by an experienced injector using the appropriate product. The under-eye area requires advanced technique—we use only safe, proven hyaluronic acid fillers.' },
      { q: 'Will it help with dark circles?', a: 'Under-eye filler is most effective for hollow-type dark circles caused by volume loss. It may reduce the appearance of shadowing, though it does not address pigmentation-based darkness.' },
      { q: 'Can it be reversed?', a: 'Yes—hyaluronic acid filler is fully reversible with hyaluronidase.' },
    ],
    ...FILLER_EXTRAS,
  },
  'hand-rejuvenation': {
    title: 'Hand Rejuvenation',
    category: 'Fillers & Volume',
    description: 'As we age, the backs of our hands lose volume, making tendons and veins more prominent. Dermal filler injected into the hands restores youthful fullness and smoothness with no surgery and minimal downtime. We use Restylane Lyft—an FDA-approved hyaluronic acid filler—for beautiful, long-lasting results.',
    details: [
      { heading: 'Treatment Time', text: '30 minutes' },
      { heading: 'Results',        text: 'Immediate, lasting up to 12 months' },
      { heading: 'Downtime',       text: 'Minimal' },
    ],
    faqs: [
      { q: 'Is hand filler painful?', a: 'Most clients express surprise that hand filler causes little or no pain—generally far less than facial filler injections. We also assess whether numbing cream is needed to keep you comfortable.' },
      { q: 'How long do results last?', a: 'Results from Restylane Lyft injections into the hands can last up to a full year. Individual results vary based on metabolism and lifestyle.' },
      { q: 'Is the filler reversible?', a: 'Yes—hyaluronic acid fillers can be dissolved with hyaluronidase if needed.' },
    ],
    ...FILLER_EXTRAS,
  },
  'renuva': {
    title: 'Renuva®',
    category: 'Fillers & Volume',
    description: 'Renuva® is an injectable adipose matrix that stimulates your body to produce its own natural fat cells in the treated area—making it the first true non-surgical alternative to fat grafting. Ideal for restoring volume lost to aging or previous liposuction, Renuva® delivers long-lasting, natural results without the risks, scars, or recovery of surgery.',
    details: [
      { heading: 'Treatment Time', text: '30–60 minutes' },
      { heading: 'Results',        text: 'Progressive over 3–6 months as new fat cells develop' },
      { heading: 'Downtime',       text: 'Minimal swelling 1–3 days' },
    ],
    faqs: [
      { q: 'How is Renuva® different from fat grafting?', a: 'Fat grafting requires harvesting your own fat through liposuction, which means incisions and a more involved recovery. Renuva® achieves a similar effect—stimulating the growth of your own fat cells—with a simple injection and no surgery.' },
      { q: 'How long do results last?', a: 'Because Renuva® stimulates your own fat cells to grow, the results can be very long-lasting—potentially permanent in the treated area.' },
      { q: 'Is it safe?', a: 'Renuva® is made from processed human adipose tissue and is thoroughly tested for safety. It has been used successfully in thousands of patients.' },
    ],
    ...BODY_EXTRAS,
  },

  /* ── Facials & Skin ───────────────────────────────────── */
  'facials': {
    title: 'Facials',
    category: 'Facials & Skin',
    description: 'Our facials are fully customized to your skin type and current concerns—whether that\'s deep hydration, brightening, calming inflammation, or targeted acne treatment. Using medical-grade products, each session leaves your skin visibly clearer, softer, and more radiant.',
    details: [
      { heading: 'Treatment Time', text: '60–90 minutes' },
      { heading: 'Results',        text: 'Immediate glow; best with regular sessions' },
      { heading: 'Downtime',       text: 'None' },
    ],
    faqs: [
      { q: 'How often should I get a facial?', a: 'For most patients, we recommend once a month. Your skin\'s cell turnover cycle is approximately 28–30 days, making monthly treatments ideal for maintaining healthy, glowing skin.' },
      { q: 'What skin concerns can facials address?', a: 'Facials can help with dryness, dullness, clogged pores, mild acne, uneven tone, and overall radiance. For deeper concerns like scarring or significant aging, we may recommend additional treatments.' },
      { q: 'Should I do anything before my facial?', a: 'Arrive with clean skin if possible. Avoid exfoliating products 2–3 days before, and let us know about any active breakouts or skin sensitivities.' },
    ],
  },
  'chemical-peels': {
    title: 'Chemical Peels',
    category: 'Facials & Skin',
    description: 'Medical-grade chemical peels use carefully selected acids to exfoliate the outermost layers of skin, accelerating cell turnover and revealing fresh, healthy skin underneath. Effective for fine lines, uneven tone, sun damage, acne scarring, and dull texture. We offer light, medium, and deeper peels depending on your goals and tolerance.',
    details: [
      { heading: 'Treatment Time', text: '30–60 minutes' },
      { heading: 'Results',        text: 'Visible improvement after 1–3 sessions' },
      { heading: 'Downtime',       text: '3–7 days of peeling depending on peel depth' },
    ],
    faqs: [
      { q: 'Does a chemical peel hurt?', a: 'You may feel tingling or mild stinging during the peel, which subsides quickly. Topical numbing or fan cooling can help manage discomfort.' },
      { q: 'How do I care for my skin after a peel?', a: 'Moisturize frequently, avoid direct sun exposure, and wear SPF 30+ daily. Do not pick at peeling skin—let it shed naturally to avoid scarring.' },
      { q: 'How many sessions do I need?', a: 'Lighter peels may need 3–6 sessions for significant improvement. Deeper peels can achieve dramatic results in 1–2 sessions. Your provider will recommend the best approach for your goals.' },
    ],
  },
  'microneedling': {
    title: 'Microneedling',
    category: 'Facials & Skin',
    description: 'Microneedling creates thousands of precise micro-channels in the skin using sterile needles, triggering the body\'s natural wound-healing response and stimulating new collagen and elastin. Over a series of treatments, it improves texture, pore size, fine lines, acne scarring, and overall skin quality. A topical anesthetic is applied for comfort.',
    details: [
      { heading: 'Treatment Time', text: '45–60 minutes' },
      { heading: 'Results',        text: 'Progressive improvement; series of 3–6 recommended' },
      { heading: 'Downtime',       text: '1–3 days of redness' },
    ],
    faqs: [
      { q: 'What does microneedling treat?', a: 'Microneedling primarily treats acne scars, wrinkles, and overall skin quality. It can also help with large pores, age spots, uneven skin tone, sagging skin, fine lines, and even stretch marks.' },
      { q: 'How long does the appointment take?', a: 'Your appointment generally takes about one hour from start to finish, including numbing time. The actual procedure lasts no longer than 30 minutes.' },
      { q: 'Is it safe?', a: 'Microneedling is generally safe for healthy individuals. Those who are pregnant or on certain acne medications should not undergo the procedure. Your provider will confirm eligibility at your consultation.' },
      { q: 'How long do results last?', a: 'Results typically last 3–6 months, though this varies by age, skin type, and skin conditions. Maintenance treatments every 6–12 months are recommended for sustained results.' },
    ],
    timeline: [
      { step: 'Day of', label: 'Treatment complete; skin is pink and slightly swollen' },
      { step: 'Days 1–3', label: 'Redness resolves; skin feels smoother' },
      { step: '4–6 weeks', label: 'Collagen builds; texture, tone, and scarring improve' },
      { step: 'Series', label: '3–6 sessions recommended for best results; space 4–6 weeks apart' },
    ],
    idealFor: ['Acne scarring, enlarged pores, or uneven texture', 'Fine lines and early signs of aging', 'Dull or uneven skin tone', 'Those wanting collagen stimulation with minimal downtime'],
    notFor: ['Active acne breakouts across the treatment area', 'Accutane within the past 6–12 months', 'Rosacea prone to flaring (use caution)', 'Pregnant or nursing'],
  },
  'diamond-glow': {
    title: 'Diamond Glow',
    category: 'Facials & Skin',
    description: 'Diamond Glow is a proprietary 3-in-1 skin resurfacing treatment that simultaneously exfoliates the surface, extracts debris from pores, and infuses medical-grade serums deep into the skin. The result is immediately smoother, brighter, and more hydrated skin with zero downtime.',
    details: [
      { heading: 'Treatment Time', text: '30–45 minutes' },
      { heading: 'Results',        text: 'Immediate glow; cumulative with regular treatments' },
      { heading: 'Downtime',       text: 'None' },
    ],
    faqs: [
      { q: 'What makes Diamond Glow different from a regular facial?', a: 'Diamond Glow uses a patented handpiece that exfoliates, suctions, and infuses simultaneously—delivering serum deeper into the skin than topical application alone. The result is more immediate and more consistent than a standard facial.' },
      { q: 'How often should I get Diamond Glow?', a: 'Most patients benefit from a treatment once a month for maintenance, or more frequently as part of a corrective series.' },
      { q: 'Is there any downtime?', a: 'No. You can return to normal activities immediately after treatment. Some patients notice mild redness that resolves within hours.' },
    ],
  },

  /* ── Laser Treatments ─────────────────────────────────── */
  'ipl-photofacial': {
    title: 'IPL Photofacial',
    category: 'Laser Treatments',
    description: 'Intense Pulsed Light (IPL) therapy targets melanin and hemoglobin in the skin to reduce sun spots, pigmentation, redness, broken capillaries, and rosacea. A series of treatments progressively clears and evens skin tone with minimal downtime.',
    details: [
      { heading: 'Treatment Time', text: '30–45 minutes' },
      { heading: 'Results',        text: 'Visible improvement per session; series of 3–5 recommended' },
      { heading: 'Downtime',       text: 'Slight redness for a few hours' },
    ],
    faqs: [
      { q: 'Does IPL hurt?', a: 'Most patients describe a sensation like a light rubber band snap. We can use cooling gel or a cold compress to improve comfort.' },
      { q: 'Who is a good candidate?', a: 'IPL works best on lighter skin tones with specific pigmentation or redness concerns. It is not recommended on very dark skin tones or active tans. We\'ll assess your skin at consultation.' },
      { q: 'How many treatments will I need?', a: 'A series of 3–5 treatments spaced 3–4 weeks apart is typically recommended for best results, followed by annual maintenance.' },
    ],
    ...LASER_EXTRAS,
  },
  'co2-laser': {
    title: 'CO2 Laser',
    category: 'Laser Treatments',
    description: 'Fractional CO2 laser resurfacing is one of the most powerful tools for skin rejuvenation—targeting deep wrinkles, significant sun damage, scars, and skin laxity. It removes damaged skin layers precisely while stimulating robust collagen remodeling for dramatic, long-lasting improvement.',
    details: [
      { heading: 'Treatment Time', text: '60–90 minutes' },
      { heading: 'Results',        text: 'Significant improvement at 4–8 weeks; continues 6 months' },
      { heading: 'Downtime',       text: '7–14 days of healing' },
    ],
    faqs: [
      { q: 'Is CO2 laser painful?', a: 'Topical numbing is applied prior to treatment to minimize discomfort. You may feel warmth and mild stinging during the procedure. Post-treatment, the skin feels similar to a sunburn for a few days.' },
      { q: 'What is recovery like?', a: 'Expect redness, swelling, and peeling for 7–14 days. Full healing takes 2–4 weeks. We will provide a detailed aftercare protocol.' },
      { q: 'How many sessions do I need?', a: 'Many patients achieve their goals in one session. Additional sessions can be done after full healing (3–6 months later) for further improvement.' },
    ],
    timeline: [
      { step: 'Day of', label: 'Treatment complete; mild redness and warmth are normal' },
      { step: 'Days 7–14', label: 'Skin heals; redness and peeling resolve' },
      { step: '4–8 weeks', label: 'Significant smoothing and collagen remodeling visible' },
      { step: '6 months', label: 'Collagen continues to build; full improvement emerges' },
    ],
    idealFor: ['Deep wrinkles, sun damage, or acne scarring', 'Significant laxity or textural concerns', 'Those willing to invest in a recovery period for dramatic results', 'Patients seeking long-lasting improvement in one to two sessions'],
    notFor: ['Active skin infection or cold sore', 'Recent Accutane use (within 12 months)', 'Very dark skin tones (increased pigmentation risk)', 'Pregnant or nursing'],
  },
  'laser-hair-removal': {
    title: 'Laser Hair Removal',
    category: 'Laser Treatments',
    description: 'Laser hair removal uses targeted light energy absorbed by hair follicle melanin to permanently reduce unwanted hair. Safe and effective for most areas and skin types, each session progressively reduces growth until the follicle can no longer produce hair. We offer memberships for ongoing laser hair removal.',
    details: [
      { heading: 'Treatment Time', text: '15–60 minutes depending on area' },
      { heading: 'Results',        text: '20–30% reduction per session; 6–8 sessions for full results' },
      { heading: 'Downtime',       text: 'None' },
    ],
    faqs: [
      { q: 'Does laser hair removal hurt?', a: 'Most patients describe the sensation as a light snap or pinch. Cooling systems built into the device help reduce discomfort significantly.' },
      { q: 'How many sessions do I need?', a: 'Hair grows in cycles, and laser only treats actively growing follicles. Most patients need 6–8 sessions spaced 4–6 weeks apart to achieve significant, long-lasting reduction.' },
      { q: 'Can I shave between sessions?', a: 'Yes—shaving between sessions is fine and recommended. Avoid waxing, plucking, or threading, which remove the hair root that the laser targets.' },
    ],
    timeline: [
      { step: 'Session 1', label: 'First treatment complete; 20–30% reduction begins' },
      { step: '4–6 weeks', label: 'Next session scheduled as new hair enters growth phase' },
      { step: 'Sessions 4–6', label: 'Dramatic, noticeable reduction in growth' },
      { step: 'Sessions 6–8', label: 'Permanent reduction achieved; annual touch-up if needed' },
    ],
    idealFor: ['Unwanted hair on face, underarms, legs, bikini line, or back', 'Those tired of shaving or waxing', 'Suitable for most skin tones with the right device', 'Consistent results without ongoing maintenance cost'],
    notFor: ['Very blonde, red, or white hair (lacks pigment for laser targeting)', 'Active tan or very dark skin tones (some devices)', 'Pregnant or nursing', 'Recent sun exposure or self-tanner at treatment site'],
  },
  'acne-scar-removal': {
    title: 'Acne Scar Removal',
    category: 'Laser Treatments',
    description: 'Laser treatments for acne scars target damaged tissue beneath the skin\'s surface, breaking down old collagen and stimulating the formation of new, healthy collagen. Over a series of sessions, depressed and discolored scars gradually improve in texture and appearance.',
    details: [
      { heading: 'Treatment Time', text: '30–60 minutes' },
      { heading: 'Results',        text: 'Cumulative improvement over 3–6 sessions' },
      { heading: 'Downtime',       text: '1–5 days depending on intensity' },
    ],
    faqs: [
      { q: 'What types of acne scars can be treated?', a: 'Laser is most effective on rolling and boxcar scars. Ice-pick scars are deeper and may require additional approaches like subcision or microneedling in combination with laser.' },
      { q: 'How many treatments will I need?', a: 'Most patients see meaningful improvement after 3–6 sessions. Your provider will develop a personalized plan based on your scar type and severity.' },
    ],
  },
  'age-spot-removal': {
    title: 'Age Spot Removal',
    category: 'Laser Treatments',
    description: 'Targeted laser energy is absorbed by the pigment in age spots and sun spots, breaking them down so the body naturally eliminates them over 1–2 weeks. Results are typically dramatic after just one or two sessions, leaving surrounding skin untouched.',
    details: [
      { heading: 'Treatment Time', text: '15–30 minutes' },
      { heading: 'Results',        text: 'Spots darken, then flake away within 7–14 days' },
      { heading: 'Downtime',       text: 'Minimal — treated spots crust over briefly' },
    ],
    faqs: [
      { q: 'Will the spots come back?', a: 'Treated spots are permanently removed. However, new spots can develop with sun exposure, so consistent SPF use is essential for maintaining results.' },
      { q: 'Is it safe for all skin tones?', a: 'Some laser wavelengths are not suitable for darker skin tones. We\'ll assess your skin type at consultation to ensure we use the safest, most effective approach for you.' },
    ],
    ...LASER_EXTRAS,
  },

  /* ── Body ─────────────────────────────────────────────── */
  'coolsculpting': {
    title: 'CoolSculpting®',
    category: 'Body',
    description: 'CoolSculpting® is the only FDA-cleared fat-reduction treatment that uses controlled cooling (cryolipolysis) to permanently destroy targeted fat cells. Treated fat cells are naturally eliminated over 1–3 months, revealing a slimmer, more contoured appearance—with no needles, no incisions, and minimal downtime. Results are permanent as long as you maintain a stable weight.',
    details: [
      { heading: 'Treatment Time', text: '35–60 minutes per area' },
      { heading: 'Results',        text: 'Visible at 4–12 weeks; up to 20–25% fat reduction per session' },
      { heading: 'Downtime',       text: 'Minimal — possible temporary numbness or tenderness' },
    ],
    faqs: [
      { q: 'Is CoolSculpting® permanent?', a: 'Yes—fat cells destroyed by CoolSculpting® are permanently eliminated. However, remaining fat cells can still enlarge with weight gain, so maintaining a healthy lifestyle preserves your results.' },
      { q: 'Is it painful?', a: 'During treatment you\'ll feel intense cold, pulling, and pressure. This typically subsides as the area becomes numb. Afterward, some patients experience temporary soreness or sensitivity.' },
      { q: 'How many sessions do I need?', a: 'Many patients achieve their goals with one session per area. Some choose additional sessions for more dramatic reduction. Your provider will create a personalized treatment plan.' },
      { q: 'Is CoolSculpting® a weight-loss treatment?', a: 'No—CoolSculpting® is a body-contouring treatment for stubborn fat pockets that don\'t respond to diet and exercise. It is not a substitute for weight loss and works best for those near their ideal weight.' },
    ],
    timeline: [
      { step: 'Day of', label: 'Treatment complete; temporary numbness or tenderness is normal' },
      { step: 'Weeks 4–6', label: 'Early fat reduction begins; some patients notice initial changes' },
      { step: '3 months', label: 'Primary results visible — up to 20–25% fat reduction' },
      { step: 'Permanent', label: 'Destroyed fat cells do not return if weight is maintained' },
    ],
    idealFor: ['Stubborn fat pockets on abdomen, flanks, thighs, or arms', 'Near ideal weight with specific contouring goals', 'Non-surgical, no-downtime fat reduction', 'Long-term permanent results'],
    notFor: ['Pregnant or nursing', 'Cryoglobulinemia, cold agglutinin disease, or paroxysmal cold hemoglobinuria', 'Expecting significant weight-loss-level results', 'Loose or sagging skin over the target area'],
  },
  'sclerotherapy': {
    title: 'Sclerotherapy',
    category: 'Body',
    description: 'Sclerotherapy is the gold-standard treatment for spider veins and small varicose veins. A specialized solution is injected directly into the affected vein using a fine needle, causing it to collapse and gradually fade from view. Compression and massage are applied after injection, and compression stockings are worn post-treatment to support healing.',
    details: [
      { heading: 'Treatment Time', text: '30–45 minutes' },
      { heading: 'Results',        text: 'Veins fade over 3–6 weeks; multiple sessions may be needed' },
      { heading: 'Downtime',       text: 'Minimal — compression stockings for 1–3 weeks' },
    ],
    faqs: [
      { q: 'What should I do before my appointment?', a: 'Do not apply lotion to your legs before your treatment. Wear or bring loose, comfortable clothing. We recommend walking around normally after the procedure to prevent blood clots.' },
      { q: 'What are the common side effects?', a: 'Common side effects include bruising, redness, swelling, and temporary darkened lines or spots at the treatment site. These typically resolve within a few weeks.' },
      { q: 'How many sessions will I need?', a: 'Most patients see significant improvement after 1–3 sessions, depending on the extent and number of veins being treated.' },
    ],
    timeline: [
      { step: 'Day of', label: 'Veins injected; compression applied immediately' },
      { step: 'Weeks 1–3', label: 'Treated veins begin to fade and collapse' },
      { step: 'Weeks 3–6', label: 'Most veins fully resolved; additional sessions scheduled if needed' },
      { step: 'Ongoing', label: 'New veins may develop; annual treatment may be recommended' },
    ],
    idealFor: ['Visible spider veins or small varicose veins', 'Leg vein concerns after pregnancy or long periods of standing', 'Non-surgical vein treatment with minimal downtime', 'Those wanting clearer, more even-looking legs'],
    notFor: ['Pregnant or nursing', 'Blood clot history or certain clotting disorders', 'Allergy to sclerosing solution', 'Very large or tortuous varicose veins (may need surgical referral)'],
  },
  'pdo-threads': {
    title: 'PDO Thread Lifts',
    category: 'Body',
    description: 'PDO (polydioxanone) thread lifts use dissolvable sutures inserted beneath the skin to mechanically lift sagging tissue while simultaneously triggering a collagen-building response. The threads dissolve over 4–6 months, but the collagen they stimulate provides continued lifting and firming well beyond that point.',
    details: [
      { heading: 'Treatment Time', text: '45–90 minutes' },
      { heading: 'Results',        text: 'Immediate lift, improving over 3–6 months; lasting 12–18 months' },
      { heading: 'Downtime',       text: '2–5 days of mild swelling or tenderness' },
    ],
    faqs: [
      { q: 'Is the procedure painful?', a: 'Local anesthesia is applied to the treatment area, so most patients experience minimal discomfort during the procedure. Mild soreness and tenderness for a few days after is common.' },
      { q: 'Are PDO threads safe?', a: 'Yes—PDO sutures have been used in surgery for decades and are biocompatible and fully absorbable. When performed by an experienced provider, the procedure carries very low risk.' },
      { q: 'Who is a good candidate?', a: 'PDO thread lifts are best suited for patients with mild to moderate skin laxity who want lift without surgery. They are not a replacement for a surgical facelift for severe sagging.' },
    ],
    timeline: [
      { step: 'Day of', label: 'Immediate mechanical lift visible after placement' },
      { step: 'Week 1', label: 'Mild swelling and tenderness resolve' },
      { step: '3–6 months', label: 'Threads dissolve; collagen continues to build and firm' },
      { step: '12–18 months', label: 'Full results last; maintenance threads can extend longevity' },
    ],
    idealFor: ['Mild to moderate facial laxity — jawline, neck, brows, cheeks', 'Non-surgical lift without general anesthesia or scalpels', 'Combined with fillers or neurotoxins for a comprehensive result', 'Those not ready for surgical facelift'],
    notFor: ['Severe skin laxity (surgical facelift is more appropriate)', 'Active skin infection or acne in the treatment area', 'Blood-thinning medications or clotting disorders', 'Pregnant or nursing'],
  },

  /* ── Medical ──────────────────────────────────────────── */
  'medical-exam': {
    title: 'Medical Exam',
    category: 'Medical',
    description: 'Our medical evaluations are conducted by Kelly Lance, MSN, APRN, FNP-C—a board-certified family nurse practitioner with over 30 years of experience. Whether you have a specific aesthetic concern, a skin condition, or simply need a thorough health evaluation, Kelly provides thoughtful, personalized care in a warm and welcoming environment.',
    details: [
      { heading: 'Duration',  text: '30–60 minutes' },
      { heading: 'Includes',  text: 'Full health history, physical assessment, personalized plan' },
      { heading: 'Follow-up', text: 'Coordinated referrals and ongoing care available' },
    ],
    faqs: [
      { q: 'What should I bring to my appointment?', a: 'Please bring a list of your current medications and supplements, any relevant medical records, your insurance information if applicable, and a list of your health concerns or questions.' },
      { q: 'Can I get an aesthetic treatment at the same visit?', a: 'In many cases yes, depending on what the exam reveals. Kelly will discuss all options with you during your appointment.' },
    ],
    timeline: [
      { step: 'Appointment', label: 'Full history, assessment, and plan established same day' },
      { step: 'Same day', label: 'Recommendations and referrals provided if needed' },
      { step: 'Follow-up', label: 'Ongoing care coordinated based on your health plan' },
      { step: 'Ongoing', label: 'Continued relationship for comprehensive medical care' },
    ],
    idealFor: ['New patients seeking a thorough evaluation', 'Those with specific skin, health, or aesthetic concerns', 'Patients wanting coordinated aesthetic and medical care', 'Anyone looking for experienced, compassionate primary care'],
    notFor: ['Emergency or urgent care situations (please call 911)', 'Those requiring specialist-only care without primary coordination', 'Patients unwilling to share a complete health history'],
  },
  'medical-dermatology': {
    title: 'Medical Dermatology',
    category: 'Medical',
    description: 'Beyond aesthetics, we diagnose and treat a range of skin conditions including rashes, lesions, dermatitis, and other dermatological concerns. Kelly\'s clinical training allows us to offer medical-grade evaluation and treatment in the same comfortable spa environment you already know.',
    details: [
      { heading: 'Conditions Treated', text: 'Rashes, lesions, eczema, psoriasis, and more' },
      { heading: 'Duration',           text: '30–60 minutes' },
      { heading: 'Referrals',          text: 'Specialist coordination available when needed' },
    ],
    faqs: [
      { q: 'Do I need a referral?', a: 'No referral is needed to see Kelly for a medical dermatology concern. Simply book an appointment and she will evaluate and advise on next steps.' },
      { q: 'Can skin conditions be treated alongside aesthetic services?', a: 'Often yes—many of our aesthetic treatments (like IPL, chemical peels, and facials) have therapeutic benefits for skin conditions as well. Kelly will discuss the most appropriate combination for you.' },
    ],
    timeline: [
      { step: 'Visit', label: 'Skin condition evaluated and diagnosed' },
      { step: 'Same day', label: 'Treatment plan or prescription provided when appropriate' },
      { step: 'Weeks 2–6', label: 'Most skin conditions respond to initial treatment' },
      { step: 'Follow-up', label: 'Progress reviewed; plan adjusted as needed' },
    ],
    idealFor: ['Rashes, eczema, psoriasis, or unexplained skin changes', 'Lesion evaluation or skin cancer screening', 'Those wanting medical and aesthetic care in one place', 'Patients needing expert dermatological guidance without a long specialist wait'],
    notFor: ['Emergency skin reactions requiring ER care', 'Complex surgical dermatology (we coordinate specialist referrals)', 'Those unwilling to participate in follow-up care'],
  },
  'medical-cannabis': {
    title: 'Medical Cannabis',
    category: 'Medical',
    description: 'Kelly Lance provides medical cannabis evaluations and card recommendations for qualifying patients in Utah. Our approach is thoughtful and evidence-informed—we take time to understand your health history, current conditions, and goals before making a recommendation.',
    details: [
      { heading: 'Duration',     text: '30–45 minutes' },
      { heading: 'Requirements', text: 'Utah qualifying condition required; medical history reviewed' },
      { heading: 'Renewal',      text: 'Annual renewal appointments available' },
    ],
    faqs: [
      { q: 'What conditions qualify for medical cannabis in Utah?', a: 'Utah has a list of qualifying conditions that includes chronic pain, PTSD, cancer, epilepsy, and others. Kelly will review your history to determine if you qualify during your appointment.' },
      { q: 'What happens at the evaluation?', a: 'Kelly will review your medical history, discuss your symptoms and current treatments, and determine whether a medical cannabis recommendation is appropriate for your condition.' },
    ],
    timeline: [
      { step: 'Evaluation', label: 'Medical history and qualifying condition reviewed' },
      { step: 'Same day', label: 'Card recommendation provided if you qualify' },
      { step: 'Weeks 1–2', label: 'State card processing; pharmacy access opens' },
      { step: 'Annual', label: 'Renewal appointment required each year' },
    ],
    idealFor: ['Utah residents with a qualifying medical condition', 'Chronic pain, PTSD, cancer, epilepsy, or other eligible conditions', 'Those seeking an alternative or complement to conventional treatment', 'Patients wanting a thoughtful, evidence-informed evaluation'],
    notFor: ['Minors (without guardian and special approval)', 'Non-Utah residents (Utah card is state-specific)', 'Those without a qualifying condition under Utah law', 'Active duty military (federal employment restrictions may apply)'],
  },
  'neurotoxins': {
    title: 'Neurotoxins',
    category: 'Injectables',
    description: 'Neurotoxin injectables—including BOTOX®, Dysport®, Xeomin®, and Jeuveau®—work by temporarily relaxing the muscles responsible for dynamic wrinkles such as frown lines, crow’s feet, and forehead creases. Results appear within 3–7 days and last 3–4 months on average. At La Belle Vie, every injection is placed with precision to smooth lines while preserving a natural, expressive appearance.',
    details: [
      { heading: 'Treatment Time', text: '15–30 minutes' },
      { heading: 'Results',        text: 'Visible in 3–7 days; lasting 3–4 months' },
      { heading: 'Downtime',       text: 'None; normal activity immediately' },
    ],
    faqs: [
      { q: 'What is the difference between BOTOX, Dysport, Xeomin, and Jeuveau?', a: 'All four are FDA-approved botulinum toxin type A products that relax muscles to reduce wrinkles. They have slightly different formulations, onset speeds, and diffusion patterns. Your provider will recommend the best option based on your anatomy and goals.' },
      { q: 'Will it look natural?', a: 'Absolutely. Our injectors are trained in precise placement techniques that soften lines without freezing your expression. Subtle, refreshed results are our standard.' },
      { q: 'How often do I need treatments?', a: 'Most patients return every 3–4 months. Over time, with consistent treatment, many patients find they can extend the interval as muscles gradually weaken.' },
      { q: 'Is there any downtime?', a: 'There is no downtime. You may have minor redness or tiny bumps at injection sites that resolve within an hour. We recommend avoiding strenuous exercise and lying flat for 4 hours post-treatment.' },
    ],
    ...NEURO_EXTRAS,
  },
  'facials-and-peels': {
    title: 'Facials & Chemical Peels',
    category: 'Skin',
    description: 'Our facial and chemical peel menu is designed to address every skin concern—from deep hydration and brightening to acne control and anti-aging resurfacing. Facials combine professional-grade cleansing, exfoliation, extractions, and targeted serums to nourish your skin, while chemical peels use clinically proven acids to accelerate cell turnover, fade pigmentation, and smooth texture. Every service is customized to your skin type by our licensed estheticians.',
    details: [
      { heading: 'Treatment Time', text: '30–90 minutes depending on service' },
      { heading: 'Results',        text: 'Immediate glow; peels improve over 1–2 weeks' },
      { heading: 'Downtime',       text: 'None for facials; 3–7 days peeling for deeper peels' },
    ],
    faqs: [
      { q: 'Which facial is right for me?', a: 'We offer a range of options including our European Facial, Hydrating Facial, LBV Signature Facial, Acne Facial, and Dermaplane Facial. Your esthetician will assess your skin and recommend the best fit during your visit.' },
      { q: 'What peels do you offer?', a: 'We offer the Age-Defying Peel, Clear Enhanced Peel, Vitamin A Peel, Acne Power Treatment, and TCA Peel—ranging from light brightening treatments to deeper resurfacing peels for more significant concerns.' },
      { q: 'How often should I get a facial?', a: 'For maintenance, once a month aligns with your skin’s natural cell turnover cycle. For targeted treatment, your esthetician may recommend a specific series.' },
      { q: 'Are chemical peels safe for sensitive skin?', a: 'Yes—we have gentle peel options appropriate for most skin types, including sensitive skin. We always perform a thorough skin assessment before recommending a peel to ensure it is appropriate for you.' },
    ],
    ...SKIN_EXTRAS,
  },
  'acne-scar-treatment': {
    title: 'Acne Scar Treatment',
    category: 'Laser Treatments',
    description: 'La Belle Vie employs a multi-modality approach to dramatically reduce the appearance of acne scars. Depending on the type and severity of scarring—from minimal surface marks to deep pock-marks—we create a personalized plan that may include chemical peels, laser skin resurfacing (CO2 Laser), microneedling, PDO threads, Profound radiofrequency, and injectable dermal fillers. Together these treatments resurface damaged skin, stimulate collagen, and restore a smooth, even complexion.',
    details: [
      { heading: 'Treatment Time', text: '30–60 minutes per session' },
      { heading: 'Results',        text: 'Progressive improvement over a series of sessions' },
      { heading: 'Downtime',       text: '1–7 days depending on treatment intensity' },
    ],
    faqs: [
      { q: 'Can all types of acne scars be treated?', a: 'Yes. Rolling and boxcar scars respond very well to laser and microneedling. Ice-pick scars require a combination approach including subcision, filler, and deeper treatments like Profound. We tailor the plan to your specific scar profile.' },
      { q: 'How many sessions will I need?', a: 'Most patients see significant improvement over 3–6 sessions. Severe scarring may require a longer series. Your provider will outline a realistic timeline at your consultation.' },
      { q: 'Is there downtime?', a: 'Lighter treatments like peels or superficial microneedling have minimal downtime. Deeper treatments such as CO2 Laser or Profound may involve 3–7 days of redness and peeling.' },
      { q: 'Will results be permanent?', a: 'Structural improvements from collagen remodeling and resurfacing are long-lasting. Maintenance sessions once or twice a year help sustain your results.' },
    ],
    ...LASER_EXTRAS,
  },
  'dermal-filler': makeTreatment(
    'Dermal Filler',
    'Injectables',
    'Our customized dermal filler treatments use products from the Juvéderm®, Restylane®, Radiesse®, and Belotero® families to soften wrinkles, restore volume, and refine facial contours while preserving natural expression.',
    'About 30 minutes',
    'Immediate; typically lasting 6–18 months depending on product and area',
    'Minimal swelling or bruising',
    [
      { q: 'Which filler is right for me?', a: 'Your provider selects the product and placement after assessing your anatomy, skin quality, and goals.' },
      { q: 'Can filler be reversed?', a: 'Most hyaluronic acid fillers can be dissolved with hyaluronidase if needed.' },
    ],
    FILLER_EXTRAS,
  ),
  'prp-therapy': makeTreatment(
    'PRP Hair Restoration',
    'Injectables',
    'PRP therapy concentrates growth factors from your own blood and places them into thinning areas of the scalp to support stronger follicles and natural hair growth without surgery.',
    'About 60 minutes',
    'Progressive improvement over a treatment series; density may increase 30–40%',
    'Little social downtime',
    [
      { q: 'Who is a good candidate?', a: 'PRP works best for recent thinning and androgenetic hair loss rather than areas that have been fully bald for a long time.' },
      { q: 'Is the scalp numbed?', a: 'Yes. A topical scalp block is used to keep the treatment comfortable.' },
    ],
    {
      timeline: [
        { step: 'Day of', label: 'PRP drawn and injected; scalp block used for comfort' },
        { step: 'Month 1', label: 'Follicles begin to strengthen; shedding may temporarily increase' },
        { step: 'Months 3–4', label: 'New growth becomes visible; density improves' },
        { step: 'Months 4–6', label: 'Series of 3–4 sessions recommended; maintenance after that' },
      ],
      idealFor: ['Recent hair thinning or androgenetic alopecia', 'Men and women experiencing early to moderate hair loss', 'Those wanting natural regrowth without surgery or medication', 'Candidates with active follicles in thinning areas'],
      notFor: ['Areas with no follicular activity (completely bald patches)', 'Platelet-related blood disorders or anticoagulant therapy', 'Active scalp infection or inflammatory skin condition', 'Pregnant or nursing'],
    },
  ),
  'sculptra': makeTreatment(
    'Sculptra®',
    'Injectables',
    'Sculptra® is a poly-L-lactic acid collagen stimulator that gradually improves wrinkles, sagging, and volume loss in areas including the face, temples, jowls, hips, and buttocks.',
    'Performed in-office while awake',
    'Develops over 4–6 weeks and may last up to 2 years',
    'Minimal; possible bruising or swelling for several days',
    [
      { q: 'How is Sculptra different from filler?', a: 'Rather than supplying immediate gel volume, Sculptra encourages your body to gradually rebuild its own collagen.' },
      { q: 'How many treatments will I need?', a: 'Many patients benefit from a planned series; your provider will recommend the number based on the area and desired correction.' },
      { q: 'Can it be combined with other treatments?', a: 'Yes. Sculptra can complement fillers, neurotoxins, lasers, and skin treatments.' },
    ],
    {
      timeline: [
        { step: 'Day of', label: 'Injected; swelling creates a temporary filled appearance' },
        { step: 'Days 3–5', label: 'Initial swelling resolves; area looks as before (patience required)' },
        { step: '4–6 weeks', label: 'Collagen begins to build; gradual, natural-looking improvement' },
        { step: 'Up to 2 years', label: 'Full results develop; longer-lasting than traditional filler' },
      ],
      idealFor: ['Significant facial volume loss or hollowing', 'Temple, jawline, and midface deflation', 'Those wanting gradual, subtle, natural-looking rejuvenation', 'Patients open to a series of treatments for long-lasting results'],
      notFor: ['Those seeking immediate visible results', 'Pregnant or nursing', 'Active skin infection at injection sites', 'Immune-compromised patients (discuss with provider)'],
    },
  ),
  'hyper-diluted-radiesse': makeTreatment(
    'Hyper-Diluted Radiesse®',
    'Injectables',
    'Hyper-diluted Radiesse® is used as a biostimulatory treatment for crepey skin and laxity on the neck, décolletage, and hands. The diluted formula focuses on collagen production and skin quality rather than added volume.',
    'Brief in-office treatment',
    'Progressive improvement in elasticity, firmness, and texture',
    'Minimal',
    [],
    {
      timeline: [
        { step: 'Day of', label: 'Injected across the treatment area; minimal visible change initially' },
        { step: 'Weeks 4–6', label: 'Collagen begins to build; skin quality gradually improves' },
        { step: '3 months', label: 'Noticeable firming and reduction in crepiness' },
        { step: '12–18 months', label: 'Results last; a second session can further enhance results' },
      ],
      idealFor: ['Crepey or lax skin on the neck, décolletage, or hands', 'Those who want skin quality improvement rather than added volume', 'Patients seeking a biostimulatory approach to aging skin', 'Adults with early to moderate skin laxity outside the face'],
      notFor: ['Pregnant or nursing', 'Active skin infection or rash in the treatment area', 'Those expecting immediate visible lifting', 'Allergy to Radiesse or calcium hydroxylapatite components'],
    },
  ),
  'b12-shots': makeTreatment(
    'Vitamin B-12 Shots',
    'Wellness & Hydration',
    'Intramuscular vitamin B-12 injections support patients with deficiency, fatigue, low energy, or absorption concerns and may assist normal metabolism and neurological function.',
    'A quick injection',
    'Energy benefits may be noticed quickly; frequency is individualized',
    'None',
    [
      { q: 'Who may benefit from B-12 injections?', a: 'They may help patients with low B-12, fatigue, dietary deficiency, or gastrointestinal absorption problems.' },
      { q: 'Are side effects common?', a: 'Side effects are generally mild and may include temporary redness or swelling at the injection site.' },
    ],
    WELLNESS_EXTRAS,
  ),
  'iv-therapy': makeTreatment(
    'IV Therapy',
    'Wellness & Hydration',
    'Customized IV nutrient and hydration blends deliver fluids, vitamins, minerals, and amino acids directly into the bloodstream. Options include La Belle Vie Energy, Well, Inner Beauty, and Quench.',
    'Varies by selected infusion',
    'Immediate hydration with benefits tailored to the selected blend',
    'None',
    [],
    WELLNESS_EXTRAS,
  ),
  'clitoxin': makeTreatment(
    'Clitoxin®',
    'Women’s Health',
    'Clitoxin® is an off-label neurotoxin treatment designed to support clitoral sensitivity, arousal, and orgasmic function through precise treatment of the surrounding tissue.',
    'Under 1 hour',
    'Some effects may be immediate, with full change developing over several weeks',
    'Minimal',
    [
      { q: 'Who may consider Clitoxin?', a: 'It may be considered by women experiencing decreased sensitivity, arousal changes, or difficulty achieving orgasm.' },
      { q: 'Is the treatment painful?', a: 'Numbing is used to minimize discomfort during the brief procedure.' },
    ],
    WOMENS_EXTRAS,
  ),
  'femilift': makeTreatment(
    'FemiLift',
    'Women’s Health',
    'FemiLift uses fractional CO2 laser energy to support vaginal tissue health and address laxity, dryness, discomfort, recurrent infections, and stress urinary incontinence.',
    '15–30 minutes',
    'Improvement often begins in 3–4 weeks; a series and yearly maintenance may be recommended',
    'Minimal; avoid intercourse for 3–5 days',
    [
      { q: 'How many sessions are recommended?', a: 'A typical plan includes four to five treatments followed by maintenance based on your response.' },
      { q: 'Can FemiLift help after childbirth or menopause?', a: 'Yes. It is commonly considered for tissue changes related to childbirth, aging, or menopause.' },
    ],
    WOMENS_EXTRAS,
  ),
  'o-shot': makeTreatment(
    'O-Shot™',
    'Women’s Health',
    'The O-Shot™ uses platelet-rich plasma injected into targeted intimate areas to support orgasmic function, lubrication, sensitivity, and urinary control.',
    'Under 40 minutes',
    'Early changes may be noticed within a week; benefits can continue developing for months',
    'Minimal',
    [
      { q: 'How long can results last?', a: 'Individual results vary, but benefits may last around 18 months.' },
      { q: 'Is the O-Shot surgical?', a: 'No. It is an office-based injection treatment using PRP prepared from your own blood.' },
    ],
    WOMENS_EXTRAS,
  ),
  'vampire-breast-lift': makeTreatment(
    'Vampire Breast Lift',
    'Women’s Health',
    'The Vampire Breast Lift uses PRP with an appropriate volume-restoring option to improve cleavage, skin quality, and breast shape without traditional lift surgery.',
    'About 45 minutes',
    'Visible change in days with fuller results around 2 months',
    'Virtually none',
    [
      { q: 'Will this increase my cup size?', a: 'The goal is improved shape, cleavage, and skin quality—not a major increase in cup size.' },
      { q: 'How long do results last?', a: 'Results may last a year or longer, depending on the approach selected.' },
    ],
    WOMENS_EXTRAS,
  ),
  'v-plump': makeTreatment(
    'V-Plump',
    'Women’s Health',
    'V-Plump, also called a Vampire Wing Lift, combines PRP with filler to restore volume to the labia majora and support comfort, appearance, and sensitivity.',
    '30–60 minutes',
    'Typically 12–18 months; a short series may be advised',
    'Mild swelling or bruising for a few days',
    [],
    WOMENS_EXTRAS,
  ),
  'womens-hormone-replacement': makeTreatment(
    'Bioidentical Hormone Replacement for Women',
    'Women’s Health',
    'Personalized bioidentical hormone replacement uses EvexiPel pellet therapy and clinical monitoring to address imbalances involving estrogen, progesterone, testosterone, DHEA, and thyroid hormones.',
    'Consultation followed by brief pellet placement',
    'Benefits may begin within several weeks',
    'Minimal',
    [
      { q: 'What symptoms can hormone optimization address?', a: 'Treatment may support mood, sleep, energy, mental clarity, libido, muscle maintenance, and overall well-being.' },
      { q: 'Is treatment personalized?', a: 'Yes. Recommendations are based on symptoms, medical history, examination, and laboratory testing.' },
    ],
    HORMONE_EXTRAS,
  ),
  'p-shot': makeTreatment(
    'P-Shot',
    'Men’s Health',
    'The P-Shot uses platelet-rich plasma to support erectile function, sensitivity, circulation, and sexual performance without surgery.',
    '30–45 minutes',
    'Function may improve early, with additional changes developing over several weeks',
    'Minimal; return to normal activity the same day',
    [
      { q: 'How is discomfort managed?', a: 'Numbing and comfort options are used before the PRP injections.' },
      { q: 'How long may results last?', a: 'Benefits vary and may last a year or longer.' },
    ],
    MENS_EXTRAS,
  ),
  'p-toxin': makeTreatment(
    'P-Toxin™',
    'Men’s Health',
    'P-Toxin™, also called Priapus Toxin™, uses precisely placed neurotoxin to relax smooth muscle and support penile blood flow for men experiencing erectile dysfunction.',
    'Brief in-office treatment',
    'Reported benefits may last 6–8 months',
    'Minimal',
    [],
    MENS_EXTRAS,
  ),
  'ed-trifecta': makeTreatment(
    'The ED Trifecta',
    'Men’s Health',
    'The ED Trifecta combines the P-Shot, Priapus Toxin™, and focused shockwave therapy to address circulation, tissue health, sensitivity, and erectile performance through complementary approaches.',
    'Planned as a customized treatment series',
    'Progressive results based on the combined treatment plan',
    'Minimal',
    [],
    MENS_EXTRAS,
  ),
  'mens-hormone-replacement': makeTreatment(
    'Testosterone Replacement Therapy for Men',
    'Men’s Health',
    'Personalized EvexiPel testosterone pellet therapy is designed to restore healthy hormone levels and support energy, clarity, physical performance, libido, muscle mass, and overall well-being.',
    'Consultation followed by brief pellet placement',
    'Benefits may begin within several weeks',
    'Minimal',
    [
      { q: 'How is the dose selected?', a: 'Treatment is individualized using symptoms, health history, examination, and laboratory results.' },
      { q: 'Will follow-up testing be needed?', a: 'Yes. Ongoing monitoring helps maintain safe, effective hormone levels.' },
    ],
    HORMONE_EXTRAS,
  ),
  'shockwave-therapy': makeTreatment(
    'Shockwave Therapy',
    'Men’s Health',
    'Focused shockwave therapy uses non-invasive acoustic energy to improve circulation and tissue health associated with erectile dysfunction. It differs from lower-energy radial wave treatment.',
    '15–30 minutes per session',
    'Usually delivered as a series of 6–12 sessions',
    'None',
    [
      { q: 'Is shockwave therapy painful?', a: 'Treatment is non-invasive and generally described as quick and comfortable.' },
      { q: 'Can it be combined with the P-Shot?', a: 'Yes. Combination plans may be recommended for more comprehensive support.' },
    ],
    MENS_EXTRAS,
  ),
  'medical-weight-loss': makeTreatment(
    'Medical Weight Loss',
    'Weight Loss',
    'Our medically supervised weight-loss program combines a comprehensive evaluation with an individualized plan that may include semaglutide or tirzepatide, B-12 or MIC injections, IV support, and hormone evaluation.',
    'Initial exam with monthly follow-ups',
    'Customized 3–12 month plan',
    'Varies by medication',
    [
      { q: 'Who may qualify?', a: 'Eligibility is determined medically and may include patients with a BMI of 27 or higher and related health concerns.' },
      { q: 'How is progress monitored?', a: 'Regular follow-ups are used to review response, adjust treatment, and support sustainable habits.' },
    ],
    WEIGHT_LOSS_EXTRAS,
  ),
  'vampire-facial': makeTreatment(
    'Vampire Facial',
    'Aesthetics',
    'The Vampire Facial combines microneedling with topical platelet-rich plasma to support collagen renewal and improve texture, acne scarring, fine lines, and overall skin quality.',
    'About 1 hour',
    'Renewal develops after the initial 5–7 day healing period',
    'Redness, puffiness, or irritation for several days',
    [
      { q: 'How is it different from a Vampire Facelift?', a: 'The facial applies PRP through microneedling, while the facelift injects PRP and may include filler for deeper volume support.' },
      { q: 'Can it be combined with other treatments?', a: 'Your provider may coordinate it with neurotoxins, peels, or other skin treatments when appropriate.' },
    ],
    SKIN_EXTRAS,
  ),
  'vampire-facelift': makeTreatment(
    'Vampire Facelift',
    'Aesthetics',
    'The Vampire Facelift combines injected PRP with hyaluronic acid filler to restore facial shape, stimulate tissue renewal, and improve skin quality without surgery.',
    'About 1 hour',
    'Progressive improvement that may last a year or longer',
    'Mild swelling or bruising for several days',
  ),
  'co2-lite': makeTreatment(
    'CO2 Lite',
    'Laser Treatments',
    'CO2 Lite is a lighter fractional resurfacing option that creates controlled microchannels to improve fine lines, acne scars, sun spots, texture, and firmness with less recovery than full CO2 resurfacing.',
    'Varies by treatment area',
    'Progressive smoothing and collagen renewal',
    'Less downtime than full CO2 resurfacing',
  ),
  'profound-acne-scars': makeTreatment(
    'Profound for Acne Scars',
    'Laser Treatments',
    'Profound combines radiofrequency energy with microneedling to stimulate collagen, elastin, and hyaluronic acid for moderate-to-severe acne scars and skin laxity.',
    'Varies by treatment area',
    'Progressive remodeling over the weeks and months following treatment',
    'Approximately 3–5 days',
  ),
  'pap-smear': makeTreatment(
    'Pap Smear',
    'Medical',
    'Routine Pap smear screening collects cervical cells to check for changes that can indicate precancerous conditions or cervical cancer, helping support timely prevention and treatment.',
    'Brief office visit',
    'Laboratory results reviewed with you after processing',
    'None',
    [
      { q: 'How often should I have a Pap smear?', a: 'Screening frequency depends on your age, health history, and previous results. Your provider will recommend the appropriate schedule.' },
    ],
  ),
  'lip-plump': makeTreatment(
    'Lip Plump',
    'Fillers & Volume',
    'Lip Plump uses carefully selected hyaluronic acid filler to add natural-looking volume, improve symmetry, and refine the shape of the lips with a conservative, controlled approach.',
    'About 15 minutes',
    'Immediate; typically lasting 6–12 months',
    'Temporary swelling or bruising',
  ),
  'lip-pop': makeTreatment(
    'Lip Pop',
    'Fillers & Volume',
    'Lip Pop uses precisely placed neurotoxin around the lip border to subtly roll the upper lip outward, refine its shape, and help soften a gummy smile without adding filler volume.',
    'About 15 minutes',
    'Develops over several days and typically lasts 3–4 months',
    'None',
  ),
  'european-facial': makeTreatment('LBV European Facial', 'Facials & Skin', 'A classic customized facial with cleansing, exfoliation, extractions as appropriate, treatment products, and hydration for refreshed, balanced skin.', '50 minutes', 'Immediate refreshed glow', 'None'),
  'hydrating-facial': makeTreatment('Hydrating Facial', 'Facials & Skin', 'A moisture-focused facial designed to replenish dry or dehydrated skin and restore a softer, smoother, more comfortable complexion.', '50 minutes', 'Immediate hydration and glow', 'None'),
  'signature-facial': makeTreatment('LBV Signature Facial', 'Facials & Skin', 'Our extended signature facial combines customized professional skincare steps for deeper relaxation and comprehensive treatment of your current skin needs.', '80 minutes', 'Immediate radiance with cumulative skincare benefits', 'None'),
  'express-facial': makeTreatment('Express Facial', 'Facials & Skin', 'A streamlined professional facial for patients who want cleansing, targeted treatment, and hydration in a shorter appointment.', '25 minutes', 'Immediate refreshed appearance', 'None'),
  'acne-facial': makeTreatment('Acne Facial', 'Facials & Skin', 'A customized facial for congested or acne-prone skin using professional cleansing, exfoliation, extractions when appropriate, and calming treatment products.', '50 minutes', 'Cleaner pores and calmer-looking skin; best as part of a series', 'Minimal temporary redness'),
  'dermaplane-facial': makeTreatment('LBV Dermaplane Facial', 'Facials & Skin', 'This facial combines professional dermaplaning with customized skincare to remove surface buildup and peach fuzz while leaving skin smooth and luminous.', '50 minutes', 'Immediate smoothness and glow', 'None'),
  'dermaplaning': makeTreatment('Dermaplaning', 'Facials & Skin', 'Dermaplaning uses a sterile blade to gently remove dead surface cells and fine vellus hair, improving smoothness and helping skincare and makeup apply more evenly.', 'Brief in-office treatment', 'Immediate', 'None'),
  'age-defying-peel': makeTreatment('Age-Defying Peel', 'Facials & Skin', 'A professional peel selected to soften the appearance of fine lines, uneven texture, and sun-related changes while encouraging fresh surface renewal.', 'Varies by peel plan', 'Progressive improvement after healing', 'Mild peeling may occur'),
  'clear-enhanced-peel': makeTreatment('Clear Enhanced Peel', 'Facials & Skin', 'A corrective peel designed for congestion, blemishes, and uneven tone, helping clear surface buildup and support a smoother complexion.', 'Varies by peel plan', 'Progressive clarity and smoother texture', 'Mild peeling may occur'),
  'vitamin-a-peel': makeTreatment('Vitamin A Peel', 'Facials & Skin', 'A retinoid-based professional peel that accelerates surface renewal to improve texture, tone, acne concerns, and visible signs of aging.', 'Varies by peel plan', 'Develops as the skin renews over the following days', 'Several days of peeling may occur'),
  'acne-power-treatment': makeTreatment('Acne Power Treatment', 'Facials & Skin', 'An intensive professional acne treatment combining corrective products and exfoliation to address active breakouts, congestion, and post-acne texture.', 'Varies by treatment plan', 'Best results develop through a recommended series', 'Temporary redness or peeling'),
  'tca-peel': makeTreatment('TCA Peel', 'Facials & Skin', 'A medium-depth trichloroacetic acid peel offered in customized strengths to address sun damage, uneven tone, fine lines, and more established texture concerns.', 'Varies by peel strength', 'Noticeable renewal after the peeling period', 'Several days of visible peeling'),
  'iv-energy': makeTreatment('La Belle Vie Energy IV', 'Wellness & Hydration', 'A customized IV blend of B vitamins and amino acids designed to support focus, immunity, and energy.', 'Varies by infusion', 'Hydration and energy support may be noticed quickly', 'None'),
  'iv-well': makeTreatment('La Belle Vie Well IV', 'Wellness & Hydration', 'A wellness-focused IV blend featuring vitamin C, B vitamins, and zinc to support the body during periods of active illness or recovery.', 'Varies by infusion', 'Immediate hydration with supportive nutrients', 'None'),
  'iv-inner-beauty': makeTreatment('La Belle Vie Inner Beauty IV', 'Wellness & Hydration', 'A beauty-focused IV blend with vitamin C, B vitamins, and biotin to support healthy hair, skin, and nails from within.', 'Varies by infusion', 'Immediate hydration with cumulative wellness benefits', 'None'),
  'iv-quench': makeTreatment('La Belle Vie Quench IV', 'Wellness & Hydration', 'A mineral-rich hydration blend created for Utah’s dry climate, travel, jet lag, exercise, and general dehydration.', 'Varies by infusion', 'Immediate hydration', 'None'),
  'mic-injections': makeTreatment('MIC Injections', 'Weight Loss', 'Weekly MIC injections provide methionine, inositol, and choline as a supportive addition to a medically supervised weight-management plan.', 'A quick weekly injection', 'Supportive benefits develop alongside the broader program', 'None'),
  'hydro-jelly-addon': makeTreatment('Hydro-Jelly Add-On', 'Facials & Skin', 'A cooling hydro-jelly mask can be added to a facial to deliver targeted hydration, calm the skin, and leave the complexion refreshed.', 'Added to a facial appointment', 'Immediate hydration and soothing', 'None'),
  'led-addon': makeTreatment('LED Add-On', 'Facials & Skin', 'LED light therapy can be added to a facial to support calming, acne care, or rejuvenation depending on the wavelength selected for your skin.', 'Added to a facial appointment', 'Cumulative benefits with repeated use', 'None'),
  'jelly-mask-addon': makeTreatment('Jelly Mask Add-On', 'Facials & Skin', 'A customized jelly mask add-on seals in hydration and treatment ingredients while cooling and comforting the skin.', 'Added to a facial appointment', 'Immediate hydration and glow', 'None'),
  'dermaplaning-addon': makeTreatment('Dermaplaning Add-On', 'Facials & Skin', 'Add dermaplaning to a facial to remove dead surface cells and fine vellus hair before the remaining treatment steps.', 'Added to a facial appointment', 'Immediate smoothness', 'None'),
  'acne-jelly-mask': makeTreatment('Acne Jelly Mask', 'Facials & Skin', 'The Acne Jelly Mask is selected for blemish-prone or congested skin to provide a cooling, calming finish to a customized facial.', 'Added to a facial appointment', 'Calmer, refreshed-looking skin', 'None'),
  'gogi-antioxidant-mask': makeTreatment('Gogi Antioxidant Mask', 'Facials & Skin', 'The Gogi Antioxidant Mask provides antioxidant-rich hydration to help revive dull or environmentally stressed skin.', 'Added to a facial appointment', 'Immediate hydration and radiance', 'None'),
  'brightening-jelly-mask': makeTreatment('Brightening Jelly Mask', 'Facials & Skin', 'The Brightening Jelly Mask is designed to hydrate while supporting a more luminous, even-looking complexion.', 'Added to a facial appointment', 'Immediate glow', 'None'),
}

function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="tx-faqs">
      <h3 className="tx-faqs__heading">Frequently Asked Questions</h3>
      {faqs.map((faq, i) => (
        <FaqItem
          key={faq.q}
          q={faq.q}
          a={faq.a}
          open={openIndex === i}
          onToggle={() => setOpenIndex(current => current === i ? null : i)}
        />
      ))}
    </div>
  )
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className={`tx-faq-item${open ? ' tx-faq-item--open' : ''}`}>
      <button className="tx-faq-item__q" onClick={onToggle} aria-expanded={open}>
        <span>{q}</span>
        <span className="tx-faq-item__icon">{open ? '−' : '+'}</span>
      </button>
      <div className="tx-faq-item__answer">
        <div>
          <p className="tx-faq-item__a">{a}</p>
        </div>
      </div>
    </div>
  )
}

const TREATMENT_IMAGES = {
  // Neurotoxins & Fillers
  neurotoxins: '/fillers.webp',
  botox: '/fillers.webp',
  dysport: '/fillers.webp',
  xeomin: '/fillers.webp',
  jeuveau: '/fillers.webp',
  'dermal-filler': '/fillers.webp',
  sculptra: '/fillers.webp',
  'hyper-diluted-radiesse': '/fillers.webp',
  'prp-therapy': '/fillers.webp',
  'signature-cheeks': '/fillers.webp',
  'signature-lips': '/fillers.webp',
  'under-eye-filler': '/fillers.webp',
  'hand-rejuvenation': '/fillers.webp',
  renuva: '/fillers.webp',
  'lip-plump': '/fillers.webp',
  'lip-pop': '/fillers.webp',
  // Skin & Body
  'facials-and-peels': '/bodyskin.webp',
  facials: '/bodyskin.webp',
  'chemical-peels': '/bodyskin.webp',
  microneedling: '/bodyskin.webp',
  'pdo-threads': '/bodyskin.webp',
  coolsculpting: '/bodyskin.webp',
  sclerotherapy: '/bodyskin.webp',
  'diamond-glow': '/bodyskin.webp',
  'european-facial': '/bodyskin.webp',
  'hydrating-facial': '/bodyskin.webp',
  'signature-facial': '/bodyskin.webp',
  'express-facial': '/bodyskin.webp',
  'acne-facial': '/bodyskin.webp',
  'dermaplane-facial': '/bodyskin.webp',
  dermaplaning: '/bodyskin.webp',
  'age-defying-peel': '/bodyskin.webp',
  'clear-enhanced-peel': '/bodyskin.webp',
  'vitamin-a-peel': '/bodyskin.webp',
  'acne-power-treatment': '/bodyskin.webp',
  'tca-peel': '/bodyskin.webp',
  'hydro-jelly-addon': '/bodyskin.webp',
  'led-addon': '/bodyskin.webp',
  'jelly-mask-addon': '/bodyskin.webp',
  'dermaplaning-addon': '/bodyskin.webp',
  'acne-jelly-mask': '/bodyskin.webp',
  'gogi-antioxidant-mask': '/bodyskin.webp',
  'brightening-jelly-mask': '/bodyskin.webp',
  // Laser & Aesthetics
  'ipl-photofacial': '/laser.webp',
  'co2-laser': '/laser.webp',
  'laser-hair-removal': '/laser.webp',
  'acne-scar-treatment': '/laser.webp',
  'acne-scar-removal': '/laser.webp',
  'age-spot-removal': '/laser.webp',
  'vampire-facial': '/laser.webp',
  'vampire-facelift': '/laser.webp',
  'co2-lite': '/laser.webp',
  'profound-acne-scars': '/laser.webp',
  // Women's Health
  clitoxin: '/womenhealth.webp',
  femilift: '/womenhealth.webp',
  'o-shot': '/womenhealth.webp',
  'v-plump': '/womenhealth.webp',
  'vampire-breast-lift': '/womenhealth.webp',
  'womens-hormone-replacement': '/womenhealth.webp',
  'pap-smear': '/womenhealth.webp',
  // Men's Health
  'p-shot': '/menhealth.webp',
  'p-toxin': '/menhealth.webp',
  'ed-trifecta': '/menhealth.webp',
  'shockwave-therapy': '/menhealth.webp',
  'mens-hormone-replacement': '/menhealth.webp',
  // Wellness & Medical
  'b12-shots': '/medical.webp',
  'iv-therapy': '/medical.webp',
  'medical-weight-loss': '/medical.webp',
  'medical-exam': '/medical.webp',
  'medical-dermatology': '/medical.webp',
  'medical-cannabis': '/medical.webp',
  'iv-energy': '/medical.webp',
  'iv-well': '/medical.webp',
  'iv-inner-beauty': '/medical.webp',
  'iv-quench': '/medical.webp',
  'mic-injections': '/medical.webp',
}

const CATEGORY_OVERVIEWS = {
  Injectables: ['Precision in every detail.', 'Expression remains yours.'],
  'Fillers & Volume': ['Restore what time has softened.', 'Refine what is already yours.'],
  'Facials & Skin': ['Healthy skin, thoughtfully renewed.', 'Radiance without excess.'],
  Skin: ['Support the skin you are in.', 'Reveal its natural clarity.'],
  Aesthetics: ['Advanced artistry.', 'Results that still feel like you.'],
  'Laser Treatments': ['Focused technology.', 'Clearer, smoother skin.'],
  Body: ['Shape with intention.', 'Feel at home in your body.'],
  Medical: ['Clinical expertise.', 'Care centered entirely on you.'],
  'Wellness & Hydration': ['Restore from within.', 'Feel renewed throughout.'],
  'Women’s Health': ['Private, personalized care.', 'Confidence at every stage.'],
  'Men’s Health': ['Modern solutions.', 'Strength, function, confidence.'],
  'Weight Loss': ['Medical guidance.', 'Sustainable progress.'],
}

export default function TreatmentPage({ treatmentKey, onBook, onBrowse }) {
  const data = TREATMENTS_DATA[treatmentKey]
  const bgImage = TREATMENT_IMAGES[treatmentKey] ?? null
  const bgRef = useRef(null)

  useEffect(() => {
    const el = bgRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const maxShift = Math.max(0, el.offsetHeight - window.innerHeight)
        const shift = Math.min(window.scrollY * 0.12, maxShift)
        el.style.transform = `translate3d(0, ${-shift}px, 0)`
        frame = 0
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [bgImage])

  if (!data) {
    return (
      <main className="tx-page" data-menu-theme="dark">
        <div className="tx-not-found">
          <p>Treatment not found.</p>
        </div>
      </main>
    )
  }

  const overview = CATEGORY_OVERVIEWS[data.category] ?? ['Thoughtfully selected.', 'Personally delivered.']

  return (
    <main className="tx-page" data-menu-theme="dark">
      {/* Parallax background + dim overlay */}
      {bgImage && (
        <>
          <div
            ref={bgRef}
            className="tx-bg-img"
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden="true"
          />
          <div className="tx-bg-overlay" aria-hidden="true" />
        </>
      )}

      <div className="tx-browse-row">
        <button className="tx-hdr-btn tx-browse-btn" type="button" onClick={onBrowse}>
          <span className="tx-hdr-btn__icon" aria-hidden="true"><ArrowUpLeft /></span>
          <span className="tx-hdr-btn__label">Browse Treatments</span>
        </button>
      </div>

      <div className="tx-hero">
        <div className="tx-hero__copy">
          <span className="tx-hero__category">{data.category}</span>
          <h1 className="tx-hero__title">{data.title}</h1>
        </div>
        <div className="tx-hero__marker" aria-hidden="true">
          <span>Discover</span>
          <i />
        </div>
      </div>

      <div className="tx-cards">
        <section className="tx-overview" aria-labelledby="tx-overview-heading">
          <p className="tx-kicker">The treatment</p>
          <div>
            <h2 className="tx-overview__heading" id="tx-overview-heading">
              {overview[0]}<br /><em>{overview[1]}</em>
            </h2>
            <p className="tx-desc">{data.description}</p>
          </div>
        </section>
        {data.details && (
          <section className="tx-details" aria-label="Treatment details">
            {data.details.map(d => (
              <div key={d.heading} className="tx-detail">
                <span className="tx-detail__heading">{d.heading}</span>
                <span className="tx-detail__text">{d.text}</span>
              </div>
            ))}
          </section>
        )}
        {data.idealFor && (
          <CandidateGuide idealFor={data.idealFor} />
        )}
        {data.faqs && <FaqAccordion faqs={data.faqs} />}
        {data.timeline && <TreatmentTimeline steps={data.timeline} />}

        <div className="tx-book-group" data-menu-theme="light">
          <p className="tx-kicker">Begin your consultation</p>
          <div className="tx-git-wrap">
            <button className="tx-hdr-btn tx-book-btn" type="button" onClick={onBook}>
              <span className="tx-hdr-btn__label">Get In Touch</span>
              <span className="tx-hdr-btn__icon" aria-hidden="true"><ArrowUpRight /></span>
            </button>
            <div className="tx-git-icons" aria-hidden="true">
              <Mail className="tx-git-icon tx-git-icon--1" />
              <Phone className="tx-git-icon tx-git-icon--2" />
              <MessageCircleCheck className="tx-git-icon tx-git-icon--3" />
              <Send className="tx-git-icon tx-git-icon--4" />
            </div>
          </div>
          <p className="tx-book-tagline">
            Schedule your free consultation or connect with our specialists for any questions or concerns.
          </p>
        </div>
      </div>

    </main>
  )
}


function TreatmentTimeline({ steps }) {
  return (
    <div className="tx-timeline">
      <h3 className="tx-section-heading">Results Timeline</h3>
      <div className="tx-timeline__steps">
        {steps.map((s, i) => (
          <div key={i} className="tx-timeline__step">
            <div className="tx-timeline__step-dot" />
            <span className="tx-timeline__step-time">{s.step}</span>
            <span className="tx-timeline__step-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CandidateGuide({ idealFor }) {
  return (
    <section className="tx-candidate" aria-labelledby="tx-candidate-heading">
      <div className="tx-candidate__intro">
        <p className="tx-kicker">Personalized care</p>
        <h3 className="tx-section-heading" id="tx-candidate-heading">Is this treatment right for you?</h3>
      </div>
      {idealFor && (
        <div className="tx-candidate__list">
          <h4>Ideal for</h4>
          <ul>
            {idealFor.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}
    </section>
  )
}

