import { Product, TechnicalSpec } from '../types';
import { CATEGORIES } from './categories';
import { BRANDS } from './brands';
import { generateProductSvg } from '../utils/formatters';
import { getOfficialCatalogueProducts } from './catalogueProducts';

// Deterministic seedable random helper for fast generation
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const BELT_PROFILES = ['SPZ', 'SPA', 'SPB', 'SPC', 'A', 'B', 'C', 'D', '3V', '5V', '8V', 'HTD-5M', 'HTD-8M', 'HTD-14M', 'T5', 'T10', 'AT10'];
const LENGTHS = [630, 710, 800, 900, 1000, 1120, 1250, 1400, 1600, 1800, 2000, 2240, 2500, 2800, 3150, 3550, 4000, 4500, 5000];
const UNITS = ['عدد', 'حلقه', 'متر', 'ست (جفت)', 'شاخه'];

const SPECIAL_PREFIXES = ['AT-', 'SWR-', 'FORZA-', 'CERAM-', 'TXT-', 'PWR-'];

let cachedProducts: Product[] | null = null;
let cachedMap: Map<string, Product> | null = null;

export function generateMockProducts(): Product[] {
  if (cachedProducts) return cachedProducts;

  const products: Product[] = [];
  const TOTAL_COUNT = 5200; // Over 5,000 items as specified in contract

  // Specific curated realistic hero products from the contract
  const curatedRealProducts: Partial<Product>[] = [
    {
      code: 'AT-751',
      name: 'غلتک سرامیکی نسوز کوره مدل AT-751 اطلس یزد',
      nameEn: 'Atlas High-Alumina Ceramic Kiln Roller AT-751',
      brand: 'اطلس پاور (Atlas Power)',
      categorySlug: 'ceramic-tiles',
      categoryName: 'قطعات کاشی و سرامیک',
      subcategory: 'غلتک‌های سرامیکی و فلزی کوره',
      prices: { base: 2400000, retail: 3450000, wholesale: 2850000, dealer: 2600000 },
      stock: 45,
      inquiryOnly: false,
      tags: ['ویژه کوره کاشی', 'تحمل ۱۲۵۰ درجه', 'تضمین اطلس'],
      unit: 'شاخه',
      featured: true,
      technicalSpecs: [
        { key: 'قطر خارجی', value: '۴۵ میلی‌متر' },
        { key: 'طول کل', value: '۳۲۰۰ میلی‌متر' },
        { key: 'درصد آلومینا (Al2O3)', value: '۷۸٪ نسوز سوپر' },
        { key: 'حداکثر دمای کارکرد', value: '۱۲۸۰ درجه سانتی‌گراد' },
        { key: 'کاربرد', value: 'کوره رولری پخت سوم و پرسلان کاشی یزد' },
      ],
    },
    {
      code: 'SWR-230',
      name: 'تسمه تایمینگ دنده‌ای تقویت‌شده SWR آلمان مدل HTD-8M-1760',
      nameEn: 'SWR Germany Heavy-Duty Timing Belt 1760-8M-50',
      brand: 'اس دبلیو آر (SWR)',
      categorySlug: 'swr-forza-exclusive',
      categoryName: 'برندهای ویژه SWR و FORZA',
      subcategory: 'تسمه‌های هایپاور SWR آلمان',
      prices: { base: 1100000, retail: 1650000, wholesale: 1350000, dealer: 1220000 },
      stock: 120,
      inquiryOnly: false,
      tags: ['نمایندگی انحصاری', 'مقاوم به روغن', 'تاییدیه DIN'],
      unit: 'حلقه',
      featured: true,
      technicalSpecs: [
        { key: 'گام دندانه (Pitch)', value: '۸ میلی‌متر (HTD Round)' },
        { key: 'طول گسترده (Length)', value: '۱۷۶۰ میلی‌متر' },
        { key: 'عرض تسمه (Width)', value: '۵۰ میلی‌متر' },
        { key: 'کورد کششی', value: 'سیم فولادی گالوانیزه High-Tensile' },
        { key: 'روکش دندانه', value: 'پارچه پلی‌آمید ضدسایش سبز NFT' },
      ],
    },
    {
      code: 'FORZA-A45',
      name: 'تسمه V-Belt هایپاور ضد الکتریسیته FORZA مدل A-45',
      nameEn: 'FORZA Antistatic High-Power Classical V-Belt A-45',
      brand: 'فورزا (FORZA)',
      categorySlug: 'swr-forza-exclusive',
      categoryName: 'برندهای ویژه SWR و FORZA',
      subcategory: 'تسمه‌های استاتیک FORZA ایتالیا',
      prices: { base: 280000, retail: 420000, wholesale: 340000, dealer: 305000 },
      stock: 350,
      inquiryOnly: false,
      tags: ['نمایندگی انحصاری', 'آنتی‌استاتیک', 'صنایع نساجی'],
      unit: 'حلقه',
      featured: true,
      technicalSpecs: [
        { key: 'پروفیل', value: 'A (عرض ۱۳ میلی‌متر، ارتفاع ۸ میلی‌متر)' },
        { key: 'طول اسمی Li', value: '۴۵ اینچ (۱۱۴۳ میلی‌متر)' },
        { key: 'مقاومت حرارتی', value: '-۴۰ تا +۱۰۰ درجه سانتی‌گراد' },
        { key: 'خواص الکتریکی', value: 'آنتی‌استاتیک طبق ISO 1813' },
      ],
    },
    {
      code: 'AT-TXT-COMB-90',
      name: 'شانه فولادی بافندگی ضدسایش سوئیسی طرح سولزر',
      nameEn: 'Atlas High-Precision Textile Loom Reed 90-Dents',
      brand: 'اطلس پاور (Atlas Power)',
      categorySlug: 'textile-machinery',
      categoryName: 'قطعات صنعت نساجی',
      subcategory: 'شانه‌های بافندگی فولادی',
      prices: { base: 4500000, retail: 6200000, wholesale: 5300000, dealer: 4800000 },
      stock: 18,
      inquiryOnly: true, // استعلامی
      tags: ['سفارشی ساز', 'صنعت بافندگی', 'فولاد ضدزنگ'],
      unit: 'عدد',
      featured: true,
      technicalSpecs: [
        { key: 'جنس تیغه‌ها', value: 'فولاد سخت‌کاری‌شده سوئدی AISI 420' },
        { key: 'تراکم شانه', value: '۹۰ دندانه در ۱۰ سانتی‌متر' },
        { key: 'عرض کاری دستگاه', value: '۳۶۰ سانتی‌متر' },
        { key: 'سازگاری ماشین‌آلات', value: 'ماشین‌های بافندگی راپیر و جت هوا' },
      ],
    },
    {
      code: 'SWR-SPB-2240',
      name: 'تسمه انتقال قدرت اسپشیال SWR مدل SPB-2240 روکشدار سنگین',
      nameEn: 'SWR Heavy Wedge Wrapped Belt SPB-2240 LW',
      brand: 'اس دبلیو آر (SWR)',
      categorySlug: 'power-transmission',
      categoryName: 'تسمه‌های انتقال قدرت',
      subcategory: 'تسمه‌های SPZ, SPA, SPB, SPC',
      prices: { base: 850000, retail: 1290000, wholesale: 1020000, dealer: 910000 },
      stock: 80,
      inquiryOnly: false,
      tags: ['تسمه سنگین', 'مخصوص فولی SPB', 'آلمان'],
      unit: 'حلقه',
      featured: true,
      technicalSpecs: [
        { key: 'عرض رویه', value: '۱۶.۳ میلی‌متر' },
        { key: 'ارتفاع', value: '۱۳ میلی‌متر' },
        { key: 'طول مرجع (Lw)', value: '۲۲۴۰ میلی‌متر' },
        { key: 'قدرت انتقال توان', value: 'تا ۴۵ کیلووات در دور بالا' },
      ],
    },
    {
      code: 'FORZA-HTD-14M',
      name: 'تسمه سنکرون فوق سنگین FORZA گام ۱۴ میلی‌متر عرض ۱۱۵',
      nameEn: 'FORZA Heavy Synchronous Belt 14M-2100-115',
      brand: 'فورزا (FORZA)',
      categorySlug: 'industrial-belts',
      categoryName: 'تسمه‌های صنعتی',
      subcategory: 'تسمه تایمینگ صنعتی',
      prices: { base: 6800000, retail: 9500000, wholesale: 8100000, dealer: 7300000 },
      stock: 12,
      inquiryOnly: true, // اقلام با ارزش بالا معمولاً استعلامی
      tags: ['استعلامی', 'فوق سنگین', 'صنایع سنگین و فولاد'],
      unit: 'حلقه',
      featured: true,
      technicalSpecs: [
        { key: 'گام دنده', value: '۱۴ میلی‌متر' },
        { key: 'طول گام', value: '۲۱۰۰ میلی‌متر' },
        { key: 'عرض', value: '۱۱۵ میلی‌متر' },
        { key: 'توان باربری', value: 'انتقال گشتاور بدون لغزش تا ۹۰ کیلووات' },
      ],
    },
  ];

  // 1. Insert official printed catalogue products first
  const officialCatalogue = getOfficialCatalogueProducts();
  products.push(...officialCatalogue);

  // 2. Insert curated products
  for (const item of curatedRealProducts) {
    const code = item.code!;
    if (products.some(p => p.code === code)) continue;
    products.push({
      code,
      name: item.name!,
      nameEn: item.nameEn,
      brand: item.brand!,
      categorySlug: item.categorySlug!,
      categoryName: item.categoryName!,
      subcategory: item.subcategory!,
      prices: item.prices!,
      stock: item.stock!,
      inquiryOnly: item.inquiryOnly || false,
      discountPercent: item.discountPercent || 0,
      images: [
        generateProductSvg(code, item.subcategory!, item.brand!, 'main'),
        generateProductSvg(code, item.subcategory!, item.brand!, 'spec'),
        generateProductSvg(code, item.subcategory!, item.brand!, 'cert'),
      ],
      tags: item.tags || [],
      minOrderQty: 1,
      unit: item.unit || 'حلقه',
      featured: item.featured || false,
      technicalSpecs: item.technicalSpecs || [],
      description: `قطعه و تجهیز صنعتی با استاندارد بین‌المللی تأمین‌شده توسط بازرگانی تسمه اطلس یزد. تولیدشده با متریال ضدسایش و بهینه‌شده برای شرایط سخت کارخانجات، خطوط تولید مداوم و محیط‌های با گردوغبار صنعتی. این محصول دارای ضمانت اصالت فیزیکی و فاکتور رسمی معتبر است.`,
      clubPointsReward: Math.max(15, Math.round((item.prices!.retail || 500000) / 75000)),
    });
  }

  // Generate the rest procedurally to exceed 5,000 items
  const brandsList = BRANDS.map(b => b.name);

  for (let i = products.length; i < TOTAL_COUNT; i++) {
    const seed = i * 17 + 3;
    const catIdx = i % CATEGORIES.length;
    const cat = CATEGORIES[catIdx];
    const subIdx = Math.floor(pseudoRandom(seed) * cat.subcategories.length);
    const subcat = cat.subcategories[subIdx];

    // Select brand with bias towards SWR and FORZA
    let brand = brandsList[0];
    const rBrand = pseudoRandom(seed + 1);
    if (cat.slug === 'swr-forza-exclusive') {
      brand = rBrand > 0.5 ? 'اس دبلیو آر (SWR)' : 'فورزا (FORZA)';
    } else {
      brand = brandsList[Math.floor(rBrand * brandsList.length)];
    }

    // Realistic part numbering
    const profile = BELT_PROFILES[i % BELT_PROFILES.length];
    const length = LENGTHS[Math.floor(pseudoRandom(seed + 2) * LENGTHS.length)];
    const width = [10, 13, 17, 22, 25, 30, 32, 50, 75, 100][Math.floor(pseudoRandom(seed + 3) * 10)];
    
    let code = '';
    if (brand.includes('SWR')) {
      code = `SWR-${profile}-${length}`;
    } else if (brand.includes('FORZA')) {
      code = `FORZA-${profile}-${length}`;
    } else if (cat.slug === 'ceramic-tiles') {
      code = `AT-CERAM-${700 + (i % 600)}`;
    } else if (cat.slug === 'textile-machinery') {
      code = `TXT-${profile}-${300 + (i % 500)}`;
    } else {
      code = `AT-${profile}-${length}`;
    }

    // Make code unique if collides
    if (products.some(p => p.code === code)) {
      code = `${code}-V${(i % 9) + 1}`;
    }

    // Realistic Persian Name
    let name = '';
    let nameEn = '';
    if (cat.slug === 'industrial-belts' || cat.slug === 'power-transmission' || cat.slug === 'swr-forza-exclusive') {
      name = `تسمه صنعتی ${brand.split(' ')[0]} پروفیل ${profile} طول ${length}mm`;
      nameEn = `${brand.split(' ')[0]} Industrial Belt ${profile}-${length}`;
    } else if (cat.slug === 'ceramic-tiles') {
      name = `${subcat} خط تولید کاشی یزد کد ${code}`;
      nameEn = `Tile & Ceramic Machinery Part ${code}`;
    } else if (cat.slug === 'textile-machinery') {
      name = `${subcat} بافندگی و ریسندگی مدل ${code}`;
      nameEn = `Textile Spinning & Weaving Component ${code}`;
    } else {
      name = `${subcat} استاندارد صنعتی بازرگانی اطلس کد ${code}`;
      nameEn = `Atlas Industrial Consumable Part ${code}`;
    }

    // 4 Price Tiers logic
    // base price varies realistically from 150,000 to 8,000,000 Tomans
    const baseMultiplier = 150000 + Math.floor(pseudoRandom(seed + 4) * 45) * 80000;
    const basePrice = Math.round(baseMultiplier / 10000) * 10000;
    // retail: +35% to +45% (public retail)
    const retailPrice = Math.round((basePrice * 1.40) / 10000) * 10000;
    // wholesale: +15% to +20% (distributors)
    const wholesalePrice = Math.round((basePrice * 1.18) / 10000) * 10000;
    // dealer: +7% to +10% (authorized exclusive agency)
    const dealerPrice = Math.round((basePrice * 1.08) / 10000) * 10000;

    // Inquiry items: ~10% of items are inquiry only
    const isInquiry = pseudoRandom(seed + 5) < 0.11;
    const stockQty = isInquiry ? 0 : Math.floor(pseudoRandom(seed + 6) * 120);
    const hasDiscount = !isInquiry && pseudoRandom(seed + 7) < 0.25;
    const discountPercent = hasDiscount ? [5, 8, 10, 12, 15, 20][Math.floor(pseudoRandom(seed + 8) * 6)] : 0;

    const technicalSpecs: TechnicalSpec[] = [
      { key: 'پروفیل یا سایز', value: `${profile}` },
      { key: 'طول کاری / گام', value: `${length} میلی‌متر` },
      { key: 'عرض استاندارد', value: `${width} میلی‌متر` },
      { key: 'دمای کارکرد استاندارد', value: '-۲۵ تا +۹۰ درجه سانتی‌گراد' },
      { key: 'اصالت و گارانتی', value: 'تضمین بازرگانی تسمه اطلس یزد (۱۳۶۶)' },
    ];

    const tags: string[] = [];
    if (i % 23 === 0) tags.push('پیشنهاد ویژه');
    if (brand.includes('SWR') || brand.includes('FORZA')) tags.push('نمایندگی انحصاری');
    if (cat.slug === 'ceramic-tiles') tags.push('ویژه کاشی');
    if (cat.slug === 'textile-machinery') tags.push('نساجی');
    if (isInquiry) tags.push('استعلام قیمت');

    products.push({
      code,
      name,
      nameEn,
      brand,
      categorySlug: cat.slug,
      categoryName: cat.name,
      subcategory: subcat,
      prices: {
        base: basePrice,
        retail: retailPrice,
        wholesale: wholesalePrice,
        dealer: dealerPrice,
      },
      stock: stockQty,
      inquiryOnly: isInquiry,
      discountPercent,
      images: [
        generateProductSvg(code, subcat, brand, 'main'),
        generateProductSvg(code, subcat, brand, 'spec'),
        generateProductSvg(code, subcat, brand, 'cert'),
      ],
      tags,
      minOrderQty: 1,
      unit: UNITS[i % UNITS.length],
      featured: i < 30 || i % 150 === 0,
      technicalSpecs,
      description: `تجهیز و قطعه صنعتی ${subcat} با استانداردهای DIN و ISO توسط بازرگانی تسمه اطلس یزد تأمین شده است. مناسب برای کاربری‌های سنگین، خطوط مداوم و ماشین‌آلات صنعتی با بازدهی بالا و مقاومت سایشی فوق‌العاده.`,
      clubPointsReward: Math.max(10, Math.round(retailPrice / 85000)),
    });
  }

  cachedProducts = products;
  cachedMap = new Map(products.map(p => [p.code, p]));
  return products;
}

export function getProductByCode(code: string): Product | undefined {
  if (!cachedMap) {
    generateMockProducts();
  }
  return cachedMap?.get(code) || cachedProducts?.find(p => p.code.toLowerCase() === code.toLowerCase());
}

export function getFeaturedProducts(limit: number = 10): Product[] {
  const all = generateMockProducts();
  return all.filter(p => p.featured).slice(0, limit);
}

export function getBestSellingBelts(limit: number = 8): Product[] {
  const all = generateMockProducts();
  return all
    .filter(p => (p.categorySlug === 'industrial-belts' || p.categorySlug === 'swr-forza-exclusive') && p.stock > 0)
    .slice(0, limit);
}

export function getDemandedCeramicParts(limit: number = 8): Product[] {
  const all = generateMockProducts();
  return all.filter(p => p.categorySlug === 'ceramic-tiles').slice(0, limit);
}

export function getLatestProducts(limit: number = 8): Product[] {
  const all = generateMockProducts();
  return all.slice(4, 4 + limit);
}

export function getSimilarProducts(product: Product, limit: number = 6): Product[] {
  const all = generateMockProducts();
  return all
    .filter(p => p.code !== product.code && (p.subcategory === product.subcategory || p.categorySlug === product.categorySlug))
    .slice(0, limit);
}

export function getProductsByCategory(categorySlug: string, limit: number = 24, offset: number = 0): { products: Product[]; total: number } {
  const all = generateMockProducts();
  const filtered = all.filter(p => p.categorySlug === categorySlug);
  return {
    products: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

export function searchProducts(query: string, limit: number = 24): Product[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const all = generateMockProducts();
  return all.filter(p => 
    p.code.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.categoryName.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function getInstantSearchResults(query: string) {
  if (!query || query.trim().length < 2) {
    return { products: [], categories: [], brands: [] };
  }
  const q = query.trim().toLowerCase();
  const allProducts = generateMockProducts();
  
  const products = allProducts
    .filter(p =>
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
    )
    .slice(0, 5);

  const matchedCategories = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.subcategories.some(s => s.toLowerCase().includes(q))
  ).slice(0, 4);

  const matchedBrands = BRANDS.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.nameEn.toLowerCase().includes(q)
  ).slice(0, 3);

  return {
    products,
    categories: matchedCategories,
    brands: matchedBrands,
  };
}
