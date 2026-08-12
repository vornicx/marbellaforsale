export type Property = {
  slug: string;
  title: string;
  location: string;
  area: string;
  type: "Villa" | "Penthouse" | "Apartment" | "Townhouse";
  price: number;
  priceLabel: string;
  beds: number;
  baths: number;
  built: number;
  plot?: number;
  terrace?: number;
  image: string;
  gallery: string[];
  badge?: string;
  ref: string;
  description: string;
  features: string[];
};

export const imageSet = {
  dusk: "https://media.inmobalia.com/imgV1/B98Le8~d7M9k3DegpEFZhS0lI_F8U4XZVz~HWxt~mGgYekxX9nCAxh0ZjtE2u9zqepXEUrVLqfm8KeIGW6Gtyd4X9WnLVEutqvhaTbOS8g_lI~ejCtsvpBcN5kiTFO6sOzl27jxNwMwDDWCj7p_YIKcsfLkp~KA~Rg--.jpg",
  villa: "https://storage.googleapis.com/ic-property-thumb/BCEABP471_16601_1024_V0_E803.jpg",
  benahavis: "https://img.jamesedition.com/listing_images/2025/04/08/11/10/49/af2edf59-a264-4683-9a1f-30668170e29d/je/1040x620xc.jpg",
  terrace: "https://www.marbellalvs.com/storage/posts/oasis_de_banus_apartment_for_sale.jpg",
  penthouse: "https://img.jamesedition.com/listing_images/2025/03/07/12/58/24/635bebaf-3fd6-46c9-85a1-073a691d7e2b/je/1040x620xc.jpg",
  interior: "https://media.inmobalia.com/imgV1/B98Le8~d7M9k3DegpEFZhS0lI_F8U4XZVz~HWxt~mGgYekxX9nCAxh0ZjtE2u9zqepXEUrVLqfm8KeIGW6Gtyd4X99qTNdlwFBSq76xumwdNZ1SinZBjj1x0ANV_tH8oNf4v7l28K5OqqH1UDs~e5nN4CPY4BeEp2YhluezFtiBh1XVUBps7ZAZHSW_BQoefAQksXQx7chnyYj4Be~P462id1AKHxQQTc4_QbnFGuBl~WHHsxaY1Zm6nErRTNYK8Ni5wF0oMR_c8Wxp1IkCNJNvIbiQnbuCtyS239YkWmdkTRMBs3VJb5U1AypuPDrSLI2ltFFQtGW7m1DyZ6ldHUATcF6wPm8yexJFG_SXiIF1NQi_kKrQ_LAdgPpUv_hDWHBI-.jpg",
  night: "https://cdn.resales-online.com/public/skq84opbpt/properties/08a37b4abbcd11f09ebd02a3ded47a2d/w1200/1-7980e48d732b6fc85c14b43b94d2aa54.jpg?v=1762518800",
  madronal: "https://media.inmobalia.com/imgV1/B98Le8~d7M9k3DegigWijpPHfi0CkGBxNjyvwawYZRIdGTzjY7k~ALQHErgxHjWAopt0Z6wY1OyGrzaef145ue5lKB1zo4IEEzP9AO4iiOnECwJBc8qxzkNphOQ337TgbChOKnUTaIGdFYkdQlpwfkwwmBOhEJe6k3WrkQ--.jpg",
  coast: "https://media.inmobalia.com/imgV1/B98Le8~d7M9trJHjZWxGCkmkWXPL1IjJUKPFGpGwEir4rQxHm6Tx3Tq67BqlZj5HAmywMC97vLJ65ca_NU4n78ZLzq~KmAy2dlJ_ZclBuV5m0nHeUlzn03WZ0hSF6GkiyzG2QwoblnySvDmDoy2d2YGoMFAmKUHYzjGpefsQz_hbrcIoXrvWZgrZUjh6IXQC_cbktr~Pp4ZeGR93Oo~jwlVWpiMrqiS71yeBHIrrfp4DoZWC1KQDQqjd6TIvch873reRF4VJZ_ESmqe2ST4aRyQFF_JBdIgK5pSv6dviKmKxQy94DJFKHFVim8rFW6U9mnJLzakQ.jpg",
  marina: "https://heliairmarbella.com/wp-content/uploads/2024/04/heliair-Puerto-Banus-harbour-1.webp",
};

export const properties: Property[] = [
  { slug: "villa-celestia-la-quinta", title: "Villa Celestia", location: "La Quinta, Benahavís", area: "Benahavis", type: "Villa", price: 10800000, priceLabel: "€10,800,000", beds: 8, baths: 8, built: 1440, plot: 5100, image: imageSet.benahavis, gallery: [imageSet.benahavis, imageSet.interior, imageSet.dusk, imageSet.madronal], badge: "Exclusive", ref: "MFSV 2198", description: "A striking contemporary estate where architecture, landscape and extraordinary views come together. Designed for effortless indoor-outdoor living, Villa Celestia brings complete privacy to one of Benahavís’ most coveted gated enclaves.", features: ["Panoramic sea views", "Heated infinity pool", "Private cinema", "Hammam and sauna", "Climate-controlled wine room", "Gated community"] },
  { slug: "villa-azure-nueva-andalucia", title: "Villa Azure", location: "Nueva Andalucía, Marbella", area: "Nueva Andalucia", type: "Villa", price: 6495000, priceLabel: "€6,495,000", beds: 6, baths: 7, built: 645, plot: 1157, image: imageSet.villa, gallery: [imageSet.villa, imageSet.interior, imageSet.terrace, imageSet.night], badge: "New to market", ref: "MFSV 2214", description: "A refined contemporary villa moments from the fairways of the Golf Valley. Warm natural materials, precise architecture and generous entertaining spaces create an exceptional year-round home.", features: ["Saltwater pool", "Rooftop solarium", "Gym and cinema", "Private lift", "Underfloor heating", "Golf valley setting"] },
  { slug: "penthouse-oasis-golden-mile", title: "Oasis Penthouse", location: "The Golden Mile, Marbella", area: "Golden Mile", type: "Penthouse", price: 4950000, priceLabel: "€4,950,000", beds: 4, baths: 4, built: 397, terrace: 186, image: imageSet.terrace, gallery: [imageSet.terrace, imageSet.penthouse, imageSet.interior, imageSet.coast], badge: "Beachside", ref: "MFSA 2182", description: "A rare duplex penthouse with an immense private terrace and uninterrupted Mediterranean views, set within a secure beachfront community between Marbella and Puerto Banús.", features: ["Private plunge pool", "Sea-facing terrace", "Three parking spaces", "24-hour security", "Communal gym", "Beach access"] },
  { slug: "villa-nova-sierra-blanca", title: "Villa Nova", location: "Sierra Blanca, Marbella", area: "Sierra Blanca", type: "Villa", price: 8950000, priceLabel: "€8,950,000", beds: 7, baths: 6, built: 1200, plot: 2200, image: imageSet.night, gallery: [imageSet.night, imageSet.dusk, imageSet.interior, imageSet.villa], ref: "MFSV 2167", description: "An architectural residence in Marbella’s most established gated hillside address, balancing generous proportions with a distinctly serene character.", features: ["Mediterranean views", "Infinity pool", "Roof terrace", "Home automation", "Landscaped gardens", "Secure gated address"] },
  { slug: "residence-palm-puerto-banus", title: "Residence Palm", location: "Puerto Banús, Marbella", area: "Puerto Banus", type: "Apartment", price: 2350000, priceLabel: "€2,350,000", beds: 3, baths: 3, built: 220, terrace: 72, image: imageSet.interior, gallery: [imageSet.interior, imageSet.terrace, imageSet.penthouse, imageSet.coast], badge: "Key ready", ref: "MFSA 2231", description: "Turn-key sophistication in the heart of Puerto Banús, with expansive interiors, marina proximity and a quiet, private outlook.", features: ["Designer renovation", "Open-plan living", "Marina proximity", "Private terrace", "Concierge", "Underground parking"] },
  { slug: "villa-alma-el-madronal", title: "Villa Alma", location: "El Madroñal, Benahavís", area: "Benahavis", type: "Villa", price: 7350000, priceLabel: "€7,350,000", beds: 7, baths: 7, built: 975, plot: 3200, image: imageSet.madronal, gallery: [imageSet.madronal, imageSet.benahavis, imageSet.interior, imageSet.dusk], badge: "Off-market", ref: "MFSV 2207", description: "A highly private hillside home designed around light, nature and layered views across the coast.", features: ["South-west orientation", "Heated pool", "Spa suite", "Cinema room", "Staff accommodation", "24-hour gated security"] },
  { slug: "marina-sky-penthouse", title: "Marina Sky", location: "Puerto Banús, Marbella", area: "Puerto Banus", type: "Penthouse", price: 3200000, priceLabel: "€3,200,000", beds: 3, baths: 3, built: 260, terrace: 145, image: imageSet.penthouse, gallery: [imageSet.penthouse, imageSet.terrace, imageSet.interior, imageSet.coast], ref: "MFSP 2210", description: "A contemporary penthouse made for open-air living, with a wraparound terrace and a front-row position close to the marina.", features: ["Wraparound terrace", "Sea views", "Private pool", "Outdoor kitchen", "Lift access", "Two parking spaces"] },
  { slug: "casa-lina-golden-mile", title: "Casa Lina", location: "The Golden Mile, Marbella", area: "Golden Mile", type: "Townhouse", price: 1850000, priceLabel: "€1,850,000", beds: 4, baths: 4, built: 285, terrace: 90, image: imageSet.coast, gallery: [imageSet.coast, imageSet.interior, imageSet.terrace, imageSet.villa], ref: "MFST 2190", description: "A beautifully composed beachside home with calm interiors and access to one of the Golden Mile’s most sought-after coastal communities.", features: ["Beachside location", "Private garden", "Renovated interiors", "Community pool", "Gated community", "Walk to amenities"] },
];

export const areas = [
  { slug: "golden-mile", name: "The Golden Mile", tagline: "Iconic beachfront living", image: imageSet.coast, copy: "Marbella’s most storied address, linking the centre with Puerto Banús through a landscape of landmark resorts, discreet estates and privileged beachfront homes." },
  { slug: "nueva-andalucia", name: "Nueva Andalucía", tagline: "Golf valley and modern villas", image: imageSet.villa, copy: "A green residential valley behind Puerto Banús, renowned for championship golf, contemporary villas and an international year-round community." },
  { slug: "benahavis", name: "Benahavís", tagline: "Privacy above the coast", image: imageSet.benahavis, copy: "Private gated estates, expansive plots and some of the Costa del Sol’s most dramatic views define this elevated enclave." },
  { slug: "puerto-banus", name: "Puerto Banús", tagline: "Marina life at its finest", image: imageSet.marina, copy: "A world-famous marina where waterfront apartments, designer boutiques and effortless Mediterranean living meet." },
  { slug: "sierra-blanca", name: "Sierra Blanca", tagline: "Marbella’s established address", image: imageSet.night, copy: "Security, serenity and remarkable sea views just minutes above Marbella — one of the city’s most enduringly prestigious neighbourhoods." },
];
