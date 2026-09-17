import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByCode, getSimilarProducts } from '../data/mockGenerator';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toPersianDigits, getStockStatus } from '../utils/formatters';
import {
  ChevronLeft,
  ShieldCheck,
  PhoneCall,
  ShoppingCart,
  Check,
  Truck,
  FileSpreadsheet,
  AlertCircle,
  Heart,
  Share2,
  Copy,
  Info,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { ProductCard } from '../components/product/ProductCard';
import { pricingCreditService } from '../services/pricingCreditService';

export const ProductDetailPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { currentUser, openAuthModal } = useAuth();
  const { addToCart, submitInquiry } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = code ? getProductByCode(decodeURIComponent(code)) : undefined;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isInquiring, setIsInquiring] = useState(false);

  const [inquiryData, setInquiryData] = useState<{
    price: number;
    gradeName: string;
    priceListName: string;
    discountPercent: number;
  } | null>(() => {
    if (!product || !currentUser) return null;
    const approval = pricingCreditService.getCustomerByPhone(currentUser.phone);
    const gradeId = approval?.assignedGradeId || 'grade-4';
    const priceListId = approval?.assignedPriceListId || 'pl-standard-d';
    const calc = pricingCreditService.calculateInquiryPrice(product, priceListId, gradeId);
    if (calc) {
      return {
        price: calc.calculatedPrice,
        gradeName: calc.gradeName,
        priceListName: calc.priceListName,
        discountPercent: calc.discountPercent,
      };
    }
    return null;
  });

  if (!product) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-[#0A172F]">کالای مورد نظر یافت نشد</h2>
        <p className="text-xs text-[#64748B]">کد کالای وارد شده در کاتالوگ ثبت نشده است.</p>
        <Link
          to="/"
          className="inline-flex px-5 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-xl"
        >
          بازگشت به کاتالوگ محصولات
        </Link>
      </div>
    );
  }

  const stockInfo = getStockStatus(product.stock);
  const isFavorited = isInWishlist(product.code);
  const similarProducts = getSimilarProducts(product, 4);
  const imageLabels = ['نمای اصلی قطعه', 'مقطع و نقشه فنی DIN', 'تأییدیه و بسته‌بندی'];

  const handleInquirePriceClick = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }

    setIsInquiring(true);
    setTimeout(() => {
      let approval = pricingCreditService.getCustomerByPhone(currentUser.phone);
      if (!approval) {
        approval = pricingCreditService.registerCustomer({
          fullName: currentUser.fullName,
          companyName: currentUser.companyName || '',
          phone: currentUser.phone,
          province: currentUser.province || 'یزد',
          city: currentUser.city || 'یزد',
          activityField: 'صنعتی',
          monthlyPurchaseEstimate: 'متوسط',
        });
      }

      const gradeId = approval.assignedGradeId || 'grade-4';
      const priceListId = approval.assignedPriceListId || 'pl-standard-d';
      const calc = pricingCreditService.calculateInquiryPrice(product, priceListId, gradeId);

      if (calc) {
        setInquiryData({
          price: calc.calculatedPrice,
          gradeName: calc.gradeName,
          priceListName: calc.priceListName,
          discountPercent: calc.discountPercent,
        });
      }
      setIsInquiring(false);
    }, 400);
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }

    if (product.inquiryOnly || !inquiryData) {
      setIsInquiryModalOpen(true);
      return;
    }

    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry(product, quantity, inquiryNotes);
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setIsInquiryModalOpen(false);
    }, 1400);
  };

  const copyProductCode = () => {
    navigator.clipboard.writeText(product.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 pb-10 text-right">
      {/* 1. BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-[#64748B]">
        <Link to="/" className="hover:text-[#F97316]">
          صفحه اصلی
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/category/${product.categorySlug}`} className="hover:text-[#F97316]">
          {product.categoryName}
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0A172F] font-bold font-mono">{product.code}</span>
      </nav>

      {/* 2. MAIN PRODUCT DETAIL CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full pt-[80%] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner group">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} - ${imageLabels[activeImageIndex]}`}
                className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full font-medium">
                {imageLabels[activeImageIndex]} ({toPersianDigits(activeImageIndex + 1)} از ۳)
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative pt-[75%] rounded-xl border overflow-hidden transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#F97316] ring-2 ring-orange-200 shadow-sm'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain p-1.5 bg-slate-50"
                  />
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-2 text-xs text-[#64748B]">
              <button
                onClick={() => toggleWishlist(product.code)}
                className="flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-400'
                  }`}
                />
                <span>{isFavorited ? 'نشان‌شده در حساب شما' : 'نشان کردن کالا'}</span>
              </button>

              <button
                onClick={copyProductCode}
                className="flex items-center gap-1.5 hover:text-[#0A172F] transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-400" />
                <span>{copiedCode ? 'کد کپی شد' : 'کپی کد فنی کالا'}</span>
              </button>
            </div>
          </div>

          {/* Right: Technical Specs & Price Inquiry */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-[#0A172F] border border-slate-200">
                    کد کالا: {product.code}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-[#EA580C] text-xs font-bold border border-orange-200">
                    {product.brand}
                  </span>
                  {product.forzaCode && (
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200" dir="ltr">
                      {product.forzaCode}
                    </span>
                  )}
                  {product.cataloguePage && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                      کاتالوگ رسمی: صفحه {toPersianDigits(product.cataloguePage)}
                    </span>
                  )}
                </div>
                <Badge variant="success" size="sm">
                  موجود در انبار یزد
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#0A172F] leading-snug">
                {product.name}
              </h1>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stockInfo.badgeBg }}
                />
                <span className="text-[#0A172F] font-bold">{stockInfo.text}</span>
              </div>

              {/* Short Technical Description */}
              <p className="text-xs text-[#64748B] leading-relaxed">
                {product.description}
              </p>

              {/* Dynamic Price Inquiry Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-xs font-bold text-[#0A172F] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    استعلام قیمت رسمی و رتبه اعتباری مشتریان
                  </span>
                  {currentUser && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      مشتری عزیز گرامی
                    </span>
                  )}
                </div>

                {!currentUser ? (
                  /* Guest: completely hidden prices */
                  <div className="py-4 text-center space-y-3">
                    <div className="inline-flex p-3 rounded-full bg-amber-100/70 text-amber-800">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#0A172F]">
                        مشاهده نرخ رسمی منوط به ورود مشتری عزیز می‌باشد
                      </h4>
                      <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
                        با توجه به ضوابط بازرگانی اطلس، قیمت‌ها بر مبنای فهرست قیمت‌های تخصیص‌یافته و رتبه اعتباری مشتریان محاسبه می‌گردد. لطفاً جهت استعلام لحظه‌ای وارد شوید.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuthModal()}
                      className="px-6 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>ورود و استعلام قیمت کالا</span>
                    </button>
                  </div>
                ) : inquiryData ? (
                  /* Logged In with Inquired Price */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">سطح و رتبه اعتباری:</span>
                        <span className="text-xs font-bold text-emerald-700 mt-1 block">
                          {inquiryData.gradeName}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">فهرست قیمت فعال:</span>
                        <span className="text-xs font-bold text-[#0A172F] mt-1 block">
                          {inquiryData.priceListName}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">
                        نرخ محاسبه‌شده استعلامی:
                      </span>
                      <div className="text-left">
                        <span className="text-xl font-black text-emerald-900">
                          {toPersianDigits(new Intl.NumberFormat('fa-IR').format(inquiryData.price))}
                        </span>
                        <span className="text-xs text-emerald-700 mr-1.5">تومان</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Logged In but not inquired yet */
                  <div className="py-3 text-center space-y-2">
                    <p className="text-xs text-slate-600">
                      جهت استخراج قیمت این قطعه طبق فهرست قیمت و رتبه اعتباری شما، کلیک کنید:
                    </p>
                    <button
                      type="button"
                      onClick={handleInquirePriceClick}
                      disabled={isInquiring}
                      className="px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isInquiring ? 'در حال محاسبه نرخ...' : 'استعلام آنی قیمت شما'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Total calculation & Add to cart / quote */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#64748B]">مبلغ کل:</span>
                  <div className="text-2xl font-black text-[#0A172F]">
                    {!currentUser ? (
                      <span className="text-base text-slate-400">نیازمند استعلام</span>
                    ) : inquiryData ? (
                      <>
                        {toPersianDigits(
                          new Intl.NumberFormat('fa-IR').format(inquiryData.price * quantity)
                        )}
                        <span className="text-xs font-normal text-[#64748B] mr-1.5">تومان</span>
                      </>
                    ) : (
                      <span className="text-base text-amber-700">آماده استعلام</span>
                    )}
                  </div>
                </div>

                {/* Quantity input */}
                {currentUser && inquiryData && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#64748B]">تعداد ({product.unit}):</span>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold font-mono text-sm">
                        {toPersianDigits(quantity)}
                      </span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {!currentUser ? (
                  <button
                    onClick={() => openAuthModal()}
                    className="h-12 col-span-2 rounded-xl bg-[#0A172F] hover:bg-[#1B293E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#F97316]" />
                    <span>ورود و استعلام قیمت رسمی</span>
                  </button>
                ) : inquiryData ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className={`h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                        product.stock <= 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : added
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#F97316] hover:bg-[#EA580C] text-white'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>به پیش‌فاکتور افزوده شد</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>افزودن به سبد و پیش‌فاکتور رسمی</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsInquiryModalOpen(true)}
                      className="h-12 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-[#0A172F] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-[#F97316]" />
                      <span>درخواست هماهنگی تحویل انبار یزد</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleInquirePriceClick}
                    disabled={isInquiring}
                    className="h-12 col-span-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isInquiring ? 'در حال استعلام نرخ...' : 'استعلام آنی قیمت کالا'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 TECHNICAL SPECIFICATIONS & CATALOGUE DATA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0A172F]">مشخصات فنی و تطبیق با کاتالوگ رسمی</h2>
              <p className="text-xs text-[#64748B]">استخراج‌شده مستقیماً از مستندات مهندسی و کاتالوگ کارخانه</p>
            </div>
          </div>
          {product.cataloguePage && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
              صفحه {toPersianDigits(product.cataloguePage)} کاتالوگ جامع ۱۴۰۴
            </span>
          )}
        </div>

        {/* Catalogue Reference Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] mb-1">کد رسمی کاتالوگ:</span>
            <span className="font-mono font-bold text-[#0A172F]">{product.forzaCode || product.code}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-1">صفحه مستندات فنی:</span>
            <span className="font-bold text-[#0A172F]">{product.cataloguePage ? `صفحه ${toPersianDigits(product.cataloguePage)}` : 'آرشیو مرکزی'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-1">برند / تأمین‌کننده:</span>
            <span className="font-bold text-orange-600">{product.brand}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] mb-1">واحد سنجش انبار:</span>
            <span className="font-bold text-[#0A172F]">{product.unit}</span>
          </div>
        </div>

        {/* Specs Table */}
        {product.technicalSpecs && product.technicalSpecs.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                  <th className="py-3 px-4 font-bold w-1/3">شاخص فنی و مهندسی</th>
                  <th className="py-3 px-4 font-bold">مقدار اسمی طبق استاندارد کاتالوگ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {product.technicalSpecs.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-3 px-4 font-semibold text-slate-600 border-l border-slate-100">{spec.key}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0A172F]">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs text-slate-400">برچسب‌های کاربردی:</span>
            {product.tags.map((tag, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#0A172F]">محصولات مشابه</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map(p => (
              <ProductCard key={p.code} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <Modal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title={`استعلام قیمت و تحویل کالا: ${product.code}`}
        size="md"
      >
        <form onSubmit={handleInquirySubmit} className="space-y-4 text-right">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-semibold text-sm text-[#0A172F]">{product.name}</p>
            <p className="text-xs text-[#64748B] mt-1">
              برند: {product.brand} | دسته‌بندی: {product.categoryName}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A172F] mb-1">
              تعداد مورد نیاز ({product.unit}):
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0A172F] mb-1">
              توضیحات و ملزومات فنی:
            </label>
            <textarea
              rows={3}
              value={inquiryNotes}
              onChange={e => setInquiryNotes(e.target.value)}
              placeholder="نکات مربوط به زمان تحویل یا نوع بسته‌بندی..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {inquirySubmitted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
              درخواست استعلام با موفقیت ثبت شد. واحد فروش به زودی پاسخ خواهد داد.
            </div>
          ) : (
            <button
              type="submit"
              className="w-full h-11 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              ارسال استعلام رسمی
            </button>
          )}
        </form>
      </Modal>
    </div>
  );
};
