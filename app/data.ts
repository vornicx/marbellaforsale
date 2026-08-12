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

const feedGallery = (contact: string, propertyId: string, version: string) =>
  [1, 2, 3, 4].map((photo) => `https://cdn.resales-online.com/public/${contact}/properties/${propertyId}/w1200/${photo}-7980e48d732b6fc85c14b43b94d2aa54.jpg?v=${version}`);

const madronalGallery = feedGallery("vj79r8sgv9", "2faf40ed202f11f0ad0102e0405b089b", "1746711196");
const nuevaGallery = feedGallery("c6rxxw1glq", "29c552056c6511f182490652962539d5", "1781938917");
const clubHillsGallery = feedGallery("ff7xgv5e2d47ogea", "3be0c0c315f411f08cfb02e0405b089b", "1780999580");
const goldenMileGallery = feedGallery("4u8i2in212", "973467647e9211eca97d0217bc231ef4", "1781800541");
const benahavisGallery = feedGallery("uqa4n98gm2", "ea5851fb94a911f182490652962539d5", "1786366517");
const banusPenthouseGallery = feedGallery("ppg8p6eobndgyqok", "3cf021cd5a9111f182490652962539d5", "1779981486");
const banusVillaGallery = feedGallery("xg4f70q0gc", "3c8c1cad5a6f11f182490652962539d5", "1779964123");

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
  { slug: "r5019220-el-madronal-villa", title: "Contemporary Villa in El Madroñal", location: "El Madroñal, Benahavís", area: "Benahavis", type: "Villa", price: 10800000, priceLabel: "€10,800,000", beds: 8, baths: 8, built: 1445, image: madronalGallery[0], gallery: madronalGallery, badge: "Featured", ref: "R5019220", description: "An exceptional contemporary villa in the gated community of El Madroñal, with panoramic Mediterranean and mountain views, generous en-suite accommodation and an infinity saltwater pool.", features: ["Panoramic sea views", "Heated saltwater pool", "Private cinema", "Turkish bath and sauna", "Climate-controlled wine cellar", "Gated community"] },
  { slug: "r5421445-nueva-andalucia-villa", title: "Villa in Parcelas del Golf", location: "Nueva Andalucía, Marbella", area: "Nueva Andalucia", type: "Villa", price: 4195000, priceLabel: "€4,195,000", beds: 6, baths: 4, built: 324, plot: 686, image: nuevaGallery[0], gallery: nuevaGallery, badge: "New listing", ref: "R5421445", description: "A six-bedroom villa in the secure Parcelas del Golf community, moments from Puerto Banús, with private gardens, pool and dedicated wellness spaces.", features: ["Private swimming pool", "Sauna and ice bath", "Home gym", "Gated 24-hour security", "Landscaped garden", "Nueva Andalucía address"] },
  { slug: "r5011201-marbella-club-hills-penthouse", title: "Marbella Club Hills Penthouse", location: "Benahavís, Marbella", area: "Benahavis", type: "Penthouse", price: 1275000, priceLabel: "€1,275,000", beds: 4, baths: 4, built: 220, terrace: 95, image: clubHillsGallery[0], gallery: clubHillsGallery, badge: "Panoramic views", ref: "R5011201", description: "A four-bedroom penthouse in Marbella Club Hills with floor-to-ceiling glazing, a large panoramic terrace and views across the Mediterranean, mountains and golf valleys.", features: ["Panoramic terrace", "Four en-suite bedrooms", "24-hour security", "Community pool and gym", "Sea and mountain views", "Underground parking"] },
  { slug: "mfsv1633-golden-mile-villa", title: "Villa Project on the Golden Mile", location: "The Golden Mile, Marbella", area: "Golden Mile", type: "Villa", price: 7300000, priceLabel: "€7,300,000", beds: 7, baths: 8, built: 720, terrace: 187, image: goldenMileGallery[0], gallery: goldenMileGallery, badge: "Golden Mile", ref: "MFSV1633", description: "A seven-bedroom luxury villa project on a private plot in Altos de Puente Romano, only minutes from Puerto Banús and the Golden Mile coastline.", features: ["Altos de Puente Romano", "Seven bedrooms", "Private terraces", "Contemporary architecture", "Close to Puerto Banús", "Prime Golden Mile setting"] },
  { slug: "r5457370-benahavis-villa", title: "Villa in Benahavís", location: "Benahavís, Marbella", area: "Benahavis", type: "Villa", price: 3875000, priceLabel: "€3,875,000", beds: 5, baths: 6, built: 568, terrace: 183, image: benahavisGallery[0], gallery: benahavisGallery, ref: "R5457370", description: "A substantial five-bedroom villa in Benahavís with generous terraces, six bathrooms and 568 square metres of built space.", features: ["Five bedrooms", "Six bathrooms", "183 m² of terraces", "Private outdoor spaces", "Benahavís location", "Contemporary living"] },
  { slug: "r5395939-puerto-banus-penthouse", title: "Puerto Banús Duplex Penthouse", location: "Puerto Banús, Marbella", area: "Puerto Banus", type: "Penthouse", price: 1050000, priceLabel: "€1,050,000", beds: 4, baths: 4, built: 200, terrace: 95, image: banusPenthouseGallery[0], gallery: banusPenthouseGallery, badge: "Duplex", ref: "R5395939", description: "A four-bedroom duplex penthouse in Puerto Banús offering 200 square metres of interiors and a 95-square-metre terrace.", features: ["Duplex layout", "Four bedrooms", "Four bathrooms", "Large private terrace", "Puerto Banús location", "200 m² built"] },
  { slug: "r5395735-puerto-banus-villa", title: "Beachside Villa in Puerto Banús", location: "Puerto Banús, Marbella", area: "Puerto Banus", type: "Villa", price: 2395000, priceLabel: "€2,395,000", beds: 7, baths: 3.5, built: 401, plot: 600, image: banusVillaGallery[0], gallery: banusVillaGallery, badge: "Beachside", ref: "R5395735", description: "A refurbished seven-bedroom semi-detached villa just 50 metres from the beach, with a heated pool, landscaped gardens, outdoor gym and home cinema.", features: ["50 metres from the beach", "Heated private pool", "Landscaped garden", "Outdoor gym", "Home cinema", "Walk to Puerto Banús"] },
];

export const areas = [
  { slug: "golden-mile", name: "The Golden Mile", tagline: "Iconic beachfront living", image: imageSet.coast, copy: "Marbella’s most storied address, linking the centre with Puerto Banús through a landscape of landmark resorts, discreet estates and privileged beachfront homes." },
  { slug: "nueva-andalucia", name: "Nueva Andalucía", tagline: "Golf valley and modern villas", image: imageSet.villa, copy: "A green residential valley behind Puerto Banús, renowned for championship golf, contemporary villas and an international year-round community." },
  { slug: "benahavis", name: "Benahavís", tagline: "Privacy above the coast", image: imageSet.benahavis, copy: "Private gated estates, expansive plots and some of the Costa del Sol’s most dramatic views define this elevated enclave." },
  { slug: "puerto-banus", name: "Puerto Banús", tagline: "Marina life at its finest", image: imageSet.marina, copy: "A world-famous marina where waterfront apartments, designer boutiques and effortless Mediterranean living meet." },
  { slug: "sierra-blanca", name: "Sierra Blanca", tagline: "Marbella’s established address", image: imageSet.night, copy: "Security, serenity and remarkable sea views just minutes above Marbella — one of the city’s most enduringly prestigious neighbourhoods." },
];
