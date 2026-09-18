import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Check,
  Phone,
  FileText,
  Calculator,
  Flame,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { STORE_ASSETS } from '../../assets/images';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Modal } from '../ui/Modal';

export interface PopularProduct {
  id: string;
  code: string;
  title: string;
  category: string;
  image: string;
  tag: string;
  inquiryOnly: boolean;
  specs?: string;
}

export const POPULAR_PRODUCTS: PopularProduct[] = [
  {
    id: 'prod-1',
    code: 'NSK-UCP-205',
    title: 'یاتاقان NSK',
    category: 'بلبرینگ و یاتاقان صنعتی',
    image: STORE_ASSETS.products.bearingNsk,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'شفت ۲۵ میلی‌متر - چدن نشکن دور بالا',
  },
  {
    id: 'prod-2',
    code: 'MOT-3PH-75',
    title: 'الکتروموتور صنعتی',
    category: 'الکتروموتور و گیربکس',
    image: STORE_ASSETS.products.motor,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'سه فاز ۷.۵ کیلووات - پوسته چدنی IP55',
  },
  {
    id: 'prod-3',
    code: 'PMP-CR-15',
    title: 'پمپ طبقاتی',
    category: 'پمپ و اتصالات صنعتی',
    image: STORE_ASSETS.products.pump,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'فشار قوی طبقاتی تمام استیل بوستر خط تولید',
  },
  {
    id: 'prod-4',
    code: 'VLV-BALL-F2',
    title: 'شیر توپی فولادی',
    category: 'شیرآلات و پایپینگ',
    image: STORE_ASSETS.products.valve,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'کلاس ۱۵۰ فلنج‌دار با بال استنلس استیل ۳۱۶',
  },
  {
    id: 'prod-5',
    code: 'PIP-MAN-SCH40',
    title: 'لوله مانیسمان',
    category: 'لوله و اتصالات مانیسمان',
    image: STORE_ASSETS.products.pipes,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'بدون درز کربن استیل رده ۴۰ مطابق ASTM A106',
  },
  {
    id: 'prod-6',
    code: 'FLG-WNR-PN16',
    title: 'فلنج فولادی',
    category: 'فلنج و اتصالات جوشی',
    image: STORE_ASSETS.products.flange,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'گلودار جوشی کربن استیل A105 فشار کاری PN16',
  },
  {
    id: 'prod-7',
    code: 'ALU-200',
    title: 'پولی آلومینیومی',
    category: 'پولی و هرزگرد',
    image: STORE_ASSETS.products.aluPulley,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'قطر ۲۰۰ میلیمتر دوشیار بالانس دقیق دینامیکی',
  },
  {
    id: 'prod-8',
    code: 'TCN-500',
    title: 'تسمه نقاله PVC',
    category: 'تسمه نقاله خطوط',
    image: STORE_ASSETS.products.pvcBelt,
    tag: 'پرفروش',
    inquiryOnly: true,
    specs: 'ضخامت ۵ میلیمتر با لایه‌های ضدسایش و تقویت‌شده',
  },
];

export const PopularProductsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Quick Inquiry Modal State
  const [selectedProduct, setSelectedProduct] = useState<PopularProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerPhone, setCustomerPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  // Carousel scroll tracking matching coveredIndustries pattern
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrolled = Math.abs(el.scrollLeft) > 10;
    setCanScrollRight(scrolled);
  };

  const handleScrollLeft = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollBy({ left: -320, behavior: 'smooth' });
      setCanScrollRight(true);
    }
  };

  const handleScrollRight = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollBy({ left: 320, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) return;

    // Simulate inquiry submission
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setSelectedProduct(null);
      setCustomerPhone('');
      setQuantity(1);
    }, 2500);
  };

  const handleQuickInquiry = (product: PopularProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to cart as inquiry item
    addToCart({
      code: product.code,
      name: product.title,
      brand: 'هایپر صنعت اطلس',
      categorySlug: 'popular-parts',
      categoryName: product.category,
      subcategory: product.category,
      technicalSpecs: [],
      prices: { base: 0, retail: 0, wholesale: 0, dealer: 0 },
      stock: 100,
      inquiryOnly: true,
      images: [product.image],
      tags: [product.tag],
      unit: 'عدد',
    });

    setQuickAddedId(product.id);
    setTimeout(() => setQuickAddedId(null), 2000);
  };

  return (
    <section className="space-y-5" dir="rtl">
      {/* Section Header matching user screenshot */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5">
        {/* Right Title: محصولات پربازدید */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#0A172F] tracking-tight">
            محصولات پربازدید
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
            <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
            <span>استعلام آنلاین خطوط تولید</span>
          </span>
        </div>

        {/* Left Link: مشاهده همه محصولات (بدون لوگوی span طبق درخواست کاربر) */}
        <Link
          to="/category/industrial-belts"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#EA580C] transition-colors group"
        >
          <span>مشاهده همه محصولات</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Carousel Container with Left/Right Navigation Arrows */}
      <div className="relative group/carousel">
        {/* Navigation Arrow: Right (اسکرول به راست - بعد از اسکرول/کلیک به چپ ظاهر می‌شود) */}
        <button
          type="button"
          onClick={handleScrollRight}
          className={`absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-lg text-[#0A172F] hover:text-white hover:bg-[#F97316] hover:border-[#F97316] flex items-center justify-center transition-all duration-300 cursor-pointer group active:scale-95 ${
            canScrollRight ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
          }`}
          aria-label="محصولات قبلی"
        >
          <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Navigation Arrow: Left (اسکرول به چپ - برای حرکت به جلو در چیدمان راست‌چین) */}
        <button
          type="button"
          onClick={handleScrollLeft}
          className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-lg text-[#0A172F] hover:text-white hover:bg-[#F97316] hover:border-[#F97316] flex items-center justify-center transition-all duration-300 cursor-pointer group active:scale-95"
          aria-label="محصولات بعدی"
        >
          <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* Scrollable Products Row */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {POPULAR_PRODUCTS.map((product) => {
            const isFav = isInWishlist(product.code);
            const isJustAdded = quickAddedId === product.id;

            return (
              <div
                key={product.id}
                className="w-40 sm:w-56 shrink-0 bg-white rounded-2xl border border-slate-200/85 p-3 sm:p-4 shadow-2xs hover:shadow-lg hover:border-orange-300 transition-all duration-300 relative flex flex-col justify-between group snap-start"
              >
                {/* Top Badge: پرفروش (دقیقاً مانند تصویر ارسالی کاربر) */}
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="px-2 py-0.5 bg-[#F97316] text-white text-[10px] font-bold rounded-md shadow-2xs">
                    {product.tag}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {product.code}
                  </span>
                </div>

                {/* Product Image on Clean White Canvas */}
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="w-full aspect-square rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 mb-2 cursor-pointer group-hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Title */}
                <div className="text-center space-y-1 my-1">
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-xs sm:text-sm text-[#0A172F] hover:text-[#F97316] transition-colors cursor-pointer line-clamp-1"
                    title={product.title}
                  >
                    {product.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {product.category}
                  </p>
                </div>

                {/* Pricing / Inquiry Display (باید استعلام باشد برای محصولات) */}
                <div className="pt-2 pb-2 text-center border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-orange-50 hover:bg-orange-100/90 text-[#F97316] hover:text-[#EA580C] text-xs font-black rounded-lg border border-orange-200/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>استعلام قیمت</span>
                    <Calculator className="w-3.5 h-3.5 text-[#F97316]" />
                  </button>
                </div>

                {/* Bottom Action Icons (Heart on right, Cart/Inquiry on left matching image) */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-400">
                  {/* Heart / Wishlist Icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.code);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="افزودن به علاقه‌مندی‌ها"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'hover:scale-110 transition-transform'}`}
                    />
                  </button>

                  {/* Cart / Inquiry Quick Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickInquiry(product, e)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isJustAdded
                        ? 'bg-emerald-500 text-white'
                        : 'hover:bg-orange-50 hover:text-[#F97316] text-slate-500'
                    }`}
                    title="افزودن به لیست استعلام"
                  >
                    {isJustAdded ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 hover:scale-110 transition-transform" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Price Inquiry Modal */}
      {selectedProduct && (
        <Modal
          isOpen={Boolean(selectedProduct)}
          onClose={() => {
            setSelectedProduct(null);
            setInquirySubmitted(false);
          }}
          title={`استعلام قیمت: ${selectedProduct.title}`}
        >
          <div className="space-y-4 text-right p-1" dir="rtl">
            {inquirySubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  درخواست استعلام با موفقیت ثبت شد
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  کارشناسان فنی هایپر صنعت به زودی جهت ارائه قیمت روز و مشخصات فنی با شماره تماس شما تماس خواهند گرفت.
                </p>
              </div>
            ) : (
              <>
                {/* Product Summary */}
                <div className="flex items-center gap-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-16 h-16 object-contain bg-white rounded-lg p-1 border border-slate-200"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#0A172F]">
                      {selectedProduct.title}
                    </h4>
                    <p className="text-xs text-slate-500">{selectedProduct.category}</p>
                    <span className="inline-block text-[10px] font-mono text-orange-600 font-bold">
                      کد: {selectedProduct.code}
                    </span>
                  </div>
                </div>

                {/* Specs if available */}
                {selectedProduct.specs && (
                  <div className="text-xs text-slate-600 bg-orange-50/70 p-2.5 rounded-lg border border-orange-200/60">
                    <span className="font-bold text-orange-800">مشخصات فنی: </span>
                    <span>{selectedProduct.specs}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleInquirySubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      تعداد یا متراژ مورد نیاز:
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      شماره تماس همراه (جهت ارسال پیش‌فاکتور و قیمت):
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full h-10 px-3 pl-10 bg-white border border-slate-300 rounded-xl text-sm focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] outline-none text-left font-mono"
                        dir="ltr"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 h-11 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>ثبت فوری استعلام قیمت</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
};
