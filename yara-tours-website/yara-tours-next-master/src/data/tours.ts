export interface Tour {
  id: string;
  title: string;
  price: string;
  rating: number;
  duration: string;
  description: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  images: string[];
  location: string;
  language?: string;
}

export const tours: Tour[] = [
  {
    id: "whale-watching-hermanus",
    title: "Whale Watching Tour in Hermanus",
    price: "R3500",
    rating: 5.0,
    duration: "Full Day",
    description: "Departure at 6:30 AM with pickup from your address. 2-hour drive to Hermanus. Arrival at the location: light coffee included for everyone. Brief explanation about whales and their habitat. Boarding for the whale-watching tour (2 hours). After the tour, lunch at one of the local restaurants (at the client's expense). Return to Cape Town in the late afternoon.",
    highlights: [],
    included: [
      "Whale-watching tour tickets",
      "Air-conditioned vehicle transportation",
      "Portuguese-speaking tour guide",
      "Round-trip transfer",
    ],
    notIncluded: ["Lunch"],
    images: [
      "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/whale-watching-hermanus/whale_1.webp",
      "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/whale-watching-hermanus/20250621_091317.jpg",
      "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/whale-watching-hermanus/20250621_091457.jpg",
      "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/whale-watching-hermanus/20250621_114645.jpg",
      "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/whale-watching-hermanus/Hermanus-whale-cruises_01.png"
    ],
    location: "Hermanus",
    language: "Portuguese",
  },
  {
    id: "cape-town-city-tour",
    title: "Cape Town City Tour",
    price: "R1900",
    rating: 5.0,
    duration: "Full Day",
    description: "A comprehensive tour of the Mother City's most iconic landmarks.",
    highlights: [
      "Table Mountain (Aerial Cableway ticket included, weather permitting)",
      "Signal Hill (panoramic city & ocean views)",
      "Scenic coastal drive through Clifton, Camps Bay, Sea Point & Green Point",
      "Visit the V&A Waterfront (shopping & leisure time)",
      "Explore the colorful Bo-Kaap neighborhood (historic Malay Quarter)",
      "See Cape Town City Hall & Castle of Good Hope (oldest colonial building in South Africa)",
    ],
    included: [
      "Transport with guide/driver",
      "Bottled water",
      "Table Mountain cableway ticket",
    ],
    notIncluded: ["Lunch (guests can choose from various restaurants at the Waterfront or Camps Bay)"],
    images: [
      "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-town-city-tour/478d95a20c8f9414d8005b1e506930a2ea5010153bb68d7857507eaac50550e6.avif",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website//city-tour.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-town-city-tour/20250710_131845.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-town-city-tour/20250710_141528.jpg",
      ],
    location: "Cape Town",
    language: "Portuguese",
  },
  {
    id: "wine-tasting-constantia",
    title: "Wine Tasting in Constantia",
    price: "R1900",
    rating: 5.0,
    duration: "Full Day",
    description: "A full day of wine tasting in the beautiful Constantia region.",
    highlights: [
        "10:00 AM – Start at Klein Constantia",
        "11:30 AM – Steenberg Vineyards",
        "1:30 PM – Groot Constantia",
        "3:30 PM – Optional Extra (if time allows)"
    ],
    included: [
        "Wine Tasting (Classic or Premium tasting options)",
        "Wine & Chocolate Pairing OR cellar tour"
    ],
    notIncluded: ["Lunch"],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/wine-tasting-constantia/20250521_111518.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/wine-tasting-constantia/20250625_103715.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/wine-tasting-constantia/20250625_104044.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/wine-tasting-constantia/20250625_131445.jpg"
      ],
    location: "Constantia",
    language: "Portuguese",
  },
  {
    id: "garden-route-adventure",
    title: "1-Day Garden Route Adventure",
    price: "R3800",
    rating: 5.0,
    duration: "Full Day",
    description: "Embark on an unforgettable journey through one of South Africa’s most scenic routes.",
    highlights: [
        "Botlierskop Day Safari: Explore breathtaking landscapes and encounter incredible wildlife in this private game reserve.",
        "Buffelsdrift Elephant Experience: Get up close with majestic elephants in a once-in-a-lifetime interaction.",
        "Delicious Lunch: Enjoy a meal surrounded by nature before heading back."
    ],
    included: [],
    notIncluded: [],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250624_132819.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250624_132646.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250626_091052.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250626_141140.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250711_132302.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250711_133017(0).jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250624_132212.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250624_132106(0).jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250624_132246.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250624_133050.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250624_134927.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/garden-route-adventure/20250711_132832.jpg"
      ],
    location: "Garden Route",
    language: "Portuguese",
  },
  {
    id: "cape-peninsula-tour",
    title: "Cape Peninsula Tour",
    price: "R1900",
    rating: 5.0,
    duration: "Full Day",
    description: "The tour begins in Hout Bay, where we will see the seals. There will be photo stops at Chapmans Peak and Noordhoek, then we will head to Cape Point to see the spot where the Portuguese discovered the route to the Indies. From there, we’ll descend toward the Cape of Good Hope. Next, we’ll visit the cutest part of the tour: meeting the penguins at the public reserve, and we’ll end our day at the delightful Muizenberg Beach.",
    highlights: [
        "Hout Bay",
        "Chapmans Peak",
        "Noordhoek",
        "Cape Point",
        "Cape of Good Hope",
        "See Penguins at Boulders Beach (public reserve)",
        "Colorful Houses in Muizenberg"
    ],
    included: [],
    notIncluded: [
        "We take you to the public penguin reserve, but if you wish to visit the private reserve, the fee is R215.00.",
        "Funicular ride optional at extra cost."
    ],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/Cape-Peninsula.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_173434.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_173128.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_172909.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_172726.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_120622.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_120212.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250712_120137.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250702_175101.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250702_175017.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-peninsula-tour/20250702_162100.jpg"
      ],
    location: "Cape Peninsula",
    language: "Portuguese",
  },
  {
    id: "stellenbosch-winelands",
    title: "Stellenbosch Winelands",
    price: "R1900",
    rating: 5.0,
    duration: "Full Day",
    description: "Spier, Tokara, and Delaire Graff wineries, departing from Cape Town.",
    highlights: [],
    included: [],
    notIncluded: [],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website//What-is-a-Stellenbosch-Private-Wine-Shuttle-and-How-Does-It-Work-1024x576.jpg",
        "/assets/img/tour/tour_inner_2.jpg",
        "/assets/img/tour/tour_inner_3.jpg",
      ],
    location: "Stellenbosch",
    language: "Portuguese",
  },
  {
    id: "cape-agulhas-adventure",
    title: "Ultimate Cape Agulhas Adventure",
    price: "R2500",
    rating: 5.0,
    duration: "Full Day",
    description: "Experience the thrill of ziplining, witness the meeting of two oceans, and explore stunning beaches on this unforgettable full-day tour!",
    highlights: [
        "Ziplining at Caledon K3",
        "Cape Agulhas (Southernmost Tip of Africa)",
        "Ocean Views",
        "Beach Exploration"
    ],
    included: [],
    notIncluded: [],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-agulhas-adventure/agulhasnationalparklighthouse.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-agulhas-adventure/africa--south-africa--western-cape--cape-agulhas--shipwreck-919444002-1bd63eb1c4194e83afa6d17bdf1f614d.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-agulhas-adventure/cape-agulhas-3.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Gallery/cape-agulhas-adventure/cape-agulhas.jpg"
      ],
    location: "Cape Agulhas",
    language: "Portuguese",
  },
  {
    id: "garden-route-3-days",
    title: "Garden Route 3 Days",
    price: "R5800",
    rating: 5.0,
    duration: "3 Days",
    description: "A 3-day adventure exploring the stunning Garden Route.",
    highlights: [],
    included: [],
    notIncluded: [],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website//garden-route-3days.jpg",
        "/assets/img/tour/tour_inner_2.jpg",
        "/assets/img/tour/tour_inner_3.jpg",
      ],
    location: "Garden Route",
    language: "Portuguese",
  },
  {
    id: "giraffe-wine-estates",
    title: "Giraffe + Wine Estates",
    price: "R2300",
    rating: 5.0,
    duration: "Full Day",
    description: "Enjoy a day full of fun and relaxation with the Giraffe + Wine Estates Tour. Start with an unforgettable giraffe interaction, then explore the Spier and Tokara wine estates, savoring wine paired with chocolate. A perfect experience that combines the beauty of nature with incredible flavors, from 8:40 AM to 5:00 PM.",
    highlights: [],
    included: [
        "Giraffe Interaction: An unforgettable experience with these magnificent animals!",
        "Visit to Spier Wine Estate: Wine tasting paired with delicious chocolates.",
        "Tokara Tasting: Premium wines in a breathtaking setting.",
        "A unique experience blending nature and iconic South African flavors!"
    ],
    notIncluded: [],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website//giraffe-house-cape-town-01-1.jpg",
        "/assets/img/tour/tour_inner_2.jpg",
        "/assets/img/tour/tour_inner_3.jpg",
      ],
    location: "Stellenbosch",
    language: "Portuguese",
  },
  {
    id: "interactive-safari",
    title: "Interactive Safari",
    price: "R2300",
    rating: 5.0,
    duration: "6 Hours",
    description: "How would you like to play with a cheetah or feed ostriches? If you prefer, you can also observe meerkats, hyenas, peacocks, and more! All of this is possible at Corneliskop—a sanctuary dedicated to giving animals a second chance at life.",
    highlights: [],
    included: [
        "Round-trip transportation",
        "Entrance ticket",
        "Ostrich feeding",
        "Cheetah interaction",
        "Viewing of lions, Cape foxes, meerkats, hyenas, peacocks, and more!"
    ],
    notIncluded: [],
    images: [
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Safari/20250522_144316.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Safari/20250522_144826.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Safari/20250522_144716.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Safari/20250522_150036.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Safari/20250522_150157.jpg",
        "https://rigiltfebwoidcahgjqd.supabase.co/storage/v1/object/public/website/Safari/20250522_151944.jpg"
      ],
    location: "Stellenbosch",
    language: "Portuguese",
  }
];
