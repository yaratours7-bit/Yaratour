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
      "/assets/img/tour/tour-1_1.jpg",
      "/assets/img/tour/tour-1_2.jpg",
      "/assets/img/tour/tour-1_3.jpg",
      "/assets/img/tour/tour-1_4.jpg",
      "/assets/img/tour/tour-1_5.jpg"
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
      "/assets/img/tour/tour-1_2.jpg",
      "/assets/img/tour/tour-1_3.jpg",
      "/assets/img/tour/tour-1_4.jpg",
      "/assets/img/tour/tour-1_5.jpg",
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
      "/assets/img/tour/tour-1_3.jpg",
      "/assets/img/tour/tour-1_4.jpg",
      "/assets/img/tour/tour-1_5.jpg",
      "/assets/img/tour/tour-1_1.jpg",
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
      "/assets/img/tour/tour-1_4.jpg",
      "/assets/img/tour/tour-1_5.jpg",
      "/assets/img/tour/tour-1_1.jpg",
      "/assets/img/tour/tour-1_2.jpg",
      "/assets/img/tour/tour-1_3.jpg",
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
      "/assets/img/tour/tour-1_5.jpg",
      "/assets/img/tour/tour-1_1.jpg",
      "/assets/img/tour/tour-1_2.jpg",
      "/assets/img/tour/tour-1_3.jpg",
      "/assets/img/tour/tour-1_4.jpg",
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
      "/assets/img/tour/tour-1_1.jpg",
      "/assets/img/tour/tour-1_2.jpg",
      "/assets/img/tour/tour-1_3.jpg",
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
      "/assets/img/tour/tour-1_2.jpg",
      "/assets/img/tour/tour-1_3.jpg",
      "/assets/img/tour/tour-1_4.jpg",
      "/assets/img/tour/tour-1_5.jpg",
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
      "/assets/img/tour/tour-1_3.jpg",
      "/assets/img/tour/tour-1_4.jpg",
      "/assets/img/tour/tour-1_5.jpg",
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
      "/assets/img/tour/giraffe-wine-estates-villa.jpg",
      "/assets/img/tour/tour-1_5.jpg",
      "/assets/img/tour/tour-1_1.jpg",
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
      "/assets/img/tour/interactive-safari-elephants.jpg",
      "/assets/img/tour/tour-1_1.jpg",
      "/assets/img/tour/tour-1_2.jpg",
      "/assets/img/tour/tour-1_3.jpg",
      "/assets/img/tour/tour-1_4.jpg",
    ],
    location: "Stellenbosch",
    language: "Portuguese",
  }
];
