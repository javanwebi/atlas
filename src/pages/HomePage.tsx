import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Camera,
  Sparkles,
  Headphones,
  Shield,
  ShieldCheck,
  Building,
  Truck,
  Award,
  Share2,
  FileText,
  Calculator,
  Flame,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { STORE_ASSETS } from '../assets/images';
import { AiVisualPartSearchModal } from '../components/search/AiVisualPartSearchModal';
import { AiConsultModal } from '../components/search/AiConsultModal';
import { OurClientsSection } from '../components/home/OurClientsSection';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Modals state
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);

  // Hero Slider
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = 3;

  // 7 Categories matching production line parts
  const categories = [
    {
      id: 1,
      title: 'تسمه‌های خط تولید و کانوایر',
      image: STORE_ASSETS.categories.belts,
      link: '/category/industrial-belts',
    },
    {
      id: 2,
      title: 'پولی، فلکه و بوش قفل‌کننده',
      image: STORE_ASSETS.categories.pulleys,
      link: '/category/pulleys-idlers',
    },
    {
      id: 3,
      title: 'بلبرینگ، رولبرینگ و یاتاقان',
      image: STORE_ASSETS.categories.bearings,
      link: '/category/bearings-bushings',
    },
    {
      id: 4,
      title: 'زنجیر و چرخ زنجیر خطوط انتقال',
      image: STORE_ASSETS.categories.chains,
      link: '/category/chains-sprockets',
    },
    {
      id: 5,
      title: 'قطعات و سیستم‌های انتقال قدرت',
      image: STORE_ASSETS.categories.transmission,
      link: '/category/power-transmission',
    },
    {
      id: 6,
      title: 'قطعات نسوز و سرامیکی خط تولید',
      image: STORE_ASSETS.products.ceramicParts,
      link: '/category/industrial-parts',
    },
    {
      id: 7,
      title: 'تجهیزات تخصصی خطوط تولید و مونتاژ',
      image: STORE_ASSETS.categories.conveyor,
      link: '/category/specialized-parts',
    },
  ];

  // 5 Covered Industries
  const coveredIndustries = [
    {
      id: 1,
      title: 'خطوط کاشی و سرامیک',
      image: STORE_ASSETS.industries.ceramic,
      link: '/category/ceramic-tiles',
    },
    {
      id: 2,
      title: 'ماشین‌آلات نساجی و ریسندگی',
      image: STORE_ASSETS.industries.textile,
      link: '/category/textile-machinery',
    },
    {
      id: 3,
      title: 'خطوط معادن و صنایع فولاد',
      image: STORE_ASSETS.industries.manufacturing,
      link: '/category/mining-steel',
    },
    {
      id: 4,
      title: 'خطوط صنایع غذایی و بسته‌بندی',
      image: STORE_ASSETS.categories.conveyor,
      link: '/category/food-industry',
    },
    {
      id: 5,
      title: 'خطوط تولید سیمان و گچ',
      image: STORE_ASSETS.industries.cement,
      link: '/category/cement-industry',
    },
  ];

  // 6 Reasons Why Atlas (منطبق با تصویر ارسالی کاربر و راست‌چین)
  const whyAtlasItems = [
    {
      id: 1,
      title: 'قیمت رقابتی',
      subtitle: 'بهترین قیمت بازار',
      icon: Shield,
    },
    {
      id: 2,
      title: 'ضمانت اصالت کالا',
      subtitle: 'همراه با گارانتی معتبر',
      icon: ShieldCheck,
    },
    {
      id: 3,
      title: 'مشاوره تخصصی',
      subtitle: 'پشتیبانی فنی و مهندسی',
      icon: Headphones,
    },
    {
      id: 4,
      title: 'تأمین سریع',
      subtitle: 'ارسال در کوتاه‌ترین زمان',
      icon: Truck,
    },
    {
      id: 5,
      title: 'تجربه و اعتبار',
      subtitle: 'همکاری با صنایع بزرگ',
      icon: Building,
    },
    {
      id: 6,
      title: 'خدمات پس از فروش',
      subtitle: 'تأییدیه فنی و تضمین تعویض',
      icon: Award,
    },
  ];

  return (
    <div className="w-full text-right font-sans overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION - 100% FULL WIDTH (تمام صفحه و لبه‌به‌لبه عین تصویر)           */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-[#070D18] text-white border-b border-slate-800/80">
        {/* Background Image: Industrial conveyor line with drive rollers & belts */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-[1.01]"
          style={{
            backgroundImage: `url(${STORE_ASSETS.heroPulley})`,
          }}
        />

        {/* Cinematic Vignette Overlay: Deep contrast on right for text, warm amber glow on left */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#070D18]/95 via-[#070D18]/80 to-[#070D18]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/95 via-transparent to-black/30" />

        {/* Hero Content Container - Aligned within max-w-7xl */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 min-h-[420px] sm:min-h-[460px] flex flex-col justify-between">
          <div className="max-w-xl lg:max-w-2xl space-y-5">
            {/* Eyebrow badge with warm flame icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs font-bold text-[#F97316]">
              <Flame className="w-3.5 h-3.5 fill-[#F97316]" />
              <span>هایپر صنعت؛ بازار تخصصی قطعات خطوط تولید | با پشتوانه کارخانجات اطلس</span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black leading-tight sm:leading-snug tracking-tight">
              <span className="block text-white">هایپر صنعت</span>
              <span className="block text-[#F97316] mt-1.5">تأمین قطعات خطوط تولید کشور</span>
            </h1>

            {/* Description Subtitle */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg font-normal">
              هایپر صنعت بستر تخصصی تأمین قطعات خطوط تولید است که توسط مجموعه کارخانجات و بازرگانی اطلس پشتیبانی می‌شود. ما انواع قطعات مصرفی و یدکی خطوط تولید شامل تسمه، پولی، بلبرینگ و زنجیر را بدون واسطه و با تضمین اصالت به کارخانجات سراسر کشور عرضه می‌کنیم.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Primary Orange Button */}
              <Link
                to="/category/industrial-belts"
                className="h-12 px-7 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>مشاهده و خرید قطعات خط تولید</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              {/* Secondary Dark Translucent Outline Button */}
              <button
                type="button"
                onClick={() => setIsConsultOpen(true)}
                className="h-12 px-6 bg-black/40 hover:bg-black/60 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-slate-300" />
                <span>مشاوره فنی و استعلام خط تولید</span>
                <span className="text-slate-400 mr-1">+</span>
              </button>
            </div>
          </div>

          {/* Bottom Brand Badges on Hero */}
          <div className="pt-8 flex flex-wrap items-center justify-between sm:justify-end gap-8 border-t border-white/10 mt-6">
            {/* SWR logo mark */}
            <div className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
              <div className="text-right">
                <div className="font-black tracking-widest text-lg sm:text-xl text-white">
                  SWR
                </div>
                <div className="text-[9px] text-slate-400 font-mono tracking-wider">
                  Industrial Belts & Components
                </div>
              </div>
            </div>

            {/* FORZA logo mark */}
            <div className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
              <div className="text-right">
                <div className="font-black tracking-widest text-lg sm:text-xl text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#F97316] rotate-45 inline-block" />
                  <span>FORZA</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono tracking-wider">
                  Power Transmission Solutions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Far Left Vertical Slider Controls (Up, 01/03, Down, Share) */}
        <div className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2.5 bg-black/45 backdrop-blur-md p-2 rounded-full border border-white/10 text-white text-xs shadow-xl">
          <button
            type="button"
            onClick={() => setActiveSlide(prev => (prev > 1 ? prev - 1 : totalSlides))}
            className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="اسلاید قبلی"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-mono font-bold text-slate-300 py-0.5">
            0{activeSlide} / 0{totalSlides}
          </span>

          <button
            type="button"
            onClick={() => setActiveSlide(prev => (prev < totalSlides ? prev + 1 : 1))}
            className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="اسلاید بعدی"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="w-4 h-[1px] bg-white/20 my-0.5" />

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'هایپر صنعت | فروشگاه قطعات خطوط تولید', url: window.location.href });
              }
            }}
            className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-slate-400 hover:text-white"
            aria-label="اشتراک‌گذاری"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2 & 3 CONTAINER - INSIDE MAX-W-7XL                                */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 my-8 sm:my-10">
        {/* ========================================================================= */}
        {/* 2. DUAL AI FEATURE BANNER (مشاوره هوشمند قطعات & پیدا کردن قطعه با AI)       */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-[#090F1D] text-white border border-slate-800 shadow-xl p-6 sm:p-8">
          {/* Ambient Subtle Gradients */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#F97316]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-800">
            {/* Card A (Right in RTL): مشاوره با هوش مصنوعی */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 lg:pb-0 lg:pl-6">
              {/* Visual: Glowing AI Cybernetic Face */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-orange-500/30 shadow-lg bg-black group">
                <img
                  src={STORE_ASSETS.aiConsultRobot}
                  alt="مشاوره هوشمند قطعات خط تولید"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-1.5 inset-x-1.5 bg-black/80 backdrop-blur-xs text-[10px] text-center font-bold text-orange-400 py-0.5 rounded border border-orange-500/20">
                  هوشمند خط تولید
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-2.5 text-right">
                <h3 className="text-lg sm:text-xl font-black text-white">مشاوره هوشمند قطعات خط تولید</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  مشخصات یا ایراد خط تولید کارخانه خود را اعلام کنید تا سامانه هوشمند هایپر صنعت بهترین قطعات جایگزین را به شما پیشنهاد دهد.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsConsultOpen(true)}
                    className="h-10 px-5 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-[#F97316] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
                  >
                    <span>شروع مشاوره آنلاین قطعه</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#F97316]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card B (Left in RTL): پیدا کردن محصول با AI */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 lg:pt-0 lg:pr-6">
              {/* Details */}
              <div className="flex-1 space-y-2.5 text-right order-2 sm:order-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white">شناسایی تصویری قطعه با هوش مصنوعی</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  از قطعه مستهلک، پولی، تسمه یا پلاک ماشین‌آلات خط تولید عکس بگیرید تا قطعه فابریک استاندارد در انبار هایپر صنعت فوراً شناسایی شود.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsVisualSearchOpen(true)}
                    className="h-10 px-5 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-[#F97316] text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
                  >
                    <Camera className="w-4 h-4 text-[#F97316]" />
                    <span>ارسال تصویر قطعه خط تولید</span>
                  </button>
                </div>
              </div>

              {/* Visual: Smartphone HUD Part Scanner */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-blue-500/30 shadow-lg bg-black order-1 sm:order-2 group">
                <img
                  src={STORE_ASSETS.aiSearchMobile}
                  alt="شناسایی هوشمند قطعه"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PRODUCT CATEGORIES (7 items matching screenshot)                       */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A172F]">دسته‌بندی قطعات خطوط تولید</h2>
              <p className="text-xs sm:text-sm text-slate-500">تأمین کلیه قطعات مصرفی و یدکی انواع خطوط تولید و کارخانجات</p>
            </div>

            <Link
              to="/category/industrial-belts"
              className="text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors"
            >
              <span>مشاهده همه قطعات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* 7 Clean Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between hover:border-[#F97316]/50 hover:shadow-lg transition-all duration-300 text-right"
              >
                {/* Product Image Box */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:bg-orange-50/30 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Title & Orange Arrow Circle Button */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <div className="w-7 h-7 rounded-full bg-[#F97316] group-hover:bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-xs transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  <h3 className="font-bold text-xs text-[#0A172F] group-hover:text-[#F97316] transition-colors line-clamp-1">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 4. COVERED INDUSTRIES - 100% FULL WIDTH (صنایع تحت پوشش تمام صفحه عین عکس) */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-gradient-to-l from-[#C2410C] via-[#7C2D12] to-[#0A101D] text-white py-10 sm:py-14 my-6 sm:my-8 shadow-2xl border-y border-orange-900/30">
        {/* Subtle Industrial Background Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Header Column (Right in RTL) */}
          <div className="max-w-xs space-y-3.5 text-right shrink-0">
            <span className="text-xs font-bold text-orange-200 tracking-wide block">
              تضمین استمرار خطوط تولید صنعتی
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              قطعات خطوط صنایع مختلف
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              از خطوط کاشی و سرامیک، نساجی و فولاد تا صنایع غذایی؛ هایپر صنعت قطعات ضدسایش و پردوام را برای صفر کردن توقف خطوط تولید کارخانجات تأمین می‌کند.
            </p>
            <div className="pt-2">
              <Link
                to="/category/industrial-belts"
                className="inline-flex items-center gap-2 h-10 px-5 bg-black/40 hover:bg-black/60 text-white text-xs font-bold rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-xs transition-all"
              >
                <span>مشاهده قطعات خطوط</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 5 Industry Cards (Left in RTL) */}
          <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {coveredIndustries.map(ind => (
              <Link
                key={ind.id}
                to={ind.link}
                className="group relative aspect-4/5 rounded-2xl overflow-hidden border border-white/20 shadow-md flex flex-col justify-end p-3 hover:border-white/60 transition-all"
              >
                {/* Background Image */}
                <img
                  src={ind.image}
                  alt={ind.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Bottom Overlay Label */}
                <div className="relative z-10 flex items-center justify-between gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-white/15">
                  <div className="w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center shrink-0">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  <span className="text-[11px] font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                    {ind.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Slider Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-6 sm:pt-8">
          <span className="w-6 h-1.5 rounded-full bg-[#F97316]" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5, 6, 7 CONTAINER - INSIDE MAX-W-7XL                              */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 my-8 sm:my-10">
        {/* ========================================================================= */}
        {/* 5. TRUSTED BRANDS (FORZA & SWR LUXURY CARDS)                              */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-slate-200/80 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A172F]">برندهای اصلی قطعات خطوط تولید</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                عرضه مستقیم در هایپر صنعت با ضمانت اصالت و پشتیبانی کارخانجات و بازرگانی اطلس
              </p>
            </div>

            <Link
              to="/category/swr-forza-exclusive"
              className="text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors"
            >
              <span>مشاهده همه برندها</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Twin Brand Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Brand 1: FORZA */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070D18] to-[#131F33] text-white border border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group">
              {/* Ambient Red/Orange glow */}
              <div className="absolute right-0 top-0 w-48 h-48 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Left Info */}
              <div className="relative z-10 space-y-3 text-right max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-[#F97316] rotate-45 inline-block" />
                  <h3 className="text-2xl sm:text-3xl font-black tracking-wider text-white">FORZA</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  پولی، فلکه و سیستم‌های مهار و انتقال قدرت خطوط صنعتی
                </p>
                <div className="pt-2">
                  <Link
                    to="/category/swr-forza-exclusive"
                    className="h-10 px-5 bg-black/60 hover:bg-black/90 text-white border border-orange-500/50 hover:border-orange-500 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm group-hover:border-[#F97316]"
                  >
                    <span>مشاهده قطعات FORZA</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-[#F97316]" />
                  </Link>
                </div>
              </div>

              {/* Right Visual: 3D FORZA Belt */}
              <div className="relative z-10 w-48 h-32 sm:w-56 sm:h-36 rounded-2xl overflow-hidden border border-slate-700/60 bg-black shadow-inner shrink-0">
                <img
                  src={STORE_ASSETS.banners.forza}
                  alt="قطعات خط تولید FORZA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                  FORZA ITALY
                </span>
              </div>
            </div>

            {/* Brand 2: SWR */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#070D18] to-[#131F33] text-white border border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group">
              {/* Ambient Blue/Cyan glow */}
              <div className="absolute right-0 top-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Left Info */}
              <div className="relative z-10 space-y-3 text-right max-w-xs">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-wider text-white">SWR</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium">تسمه‌های انتقال قدرت و کانوایر صنعتی با استاندارد DIN آلمان</p>
                <div className="pt-2">
                  <Link
                    to="/category/swr-forza-exclusive"
                    className="h-10 px-5 bg-black/60 hover:bg-black/90 text-white border border-orange-500/50 hover:border-orange-500 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm group-hover:border-[#F97316]"
                  >
                    <span>مشاهده محصولات SWR</span>
                    <ArrowLeft className="w-3.5 h-3.5 text-[#F97316]" />
                  </Link>
                </div>
              </div>

              {/* Right Visual: 3D SWR Belt */}
              <div className="relative z-10 w-48 h-32 sm:w-56 sm:h-36 rounded-2xl overflow-hidden border border-slate-700/60 bg-black shadow-inner shrink-0">
                <img
                  src={STORE_ASSETS.banners.swr}
                  alt="تسمه صنعتی SWR"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                  SWR GERMANY
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5.5 OUR CLIENTS (مشتریان ما - اسلایدر لوگو متحرک به چپ هر ۳ ثانیه)        */}
        {/* ========================================================================= */}
        <OurClientsSection />

        {/* ========================================================================= */}
        {/* 6. WHY ATLAS SECTION (چرا اطلس؟ - راست‌چین و منطبق کامل با تصویر)         */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden" dir="rtl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* 1. RIGHT SIDE: Dark "چرا اطلس؟" Card (سمت راست - کاملاً راست‌چین با زاویه اسلنت و دکمه نارنجی) */}
            <div className="lg:col-span-4 xl:col-span-4 relative bg-[#091222] text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden lg:[clip-path:polygon(32px_0,100%_0,100%_100%,0_100%)] z-10">
              {/* Industrial background image texture & ambient glow */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
                style={{ backgroundImage: `url(${STORE_ASSETS.heroPulley})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-[#091222]/85 via-[#091222]/95 to-[#050A14] pointer-events-none" />

              {/* Diagonal Orange Accent Stripe at bottom-right corner (عین خط مورب نارنجی تصویر) */}
              <div className="absolute -bottom-8 -right-8 w-28 h-7 bg-[#F97316] -rotate-45 shadow-lg pointer-events-none z-20" />

              {/* Text Content */}
              <div className="relative z-10 space-y-2.5 text-right">
                <span className="inline-block text-[#F97316] font-bold text-sm sm:text-base tracking-wide">
                  چرا اطلس؟
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  تجربه، کیفیت، تعهد
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed pt-1 max-w-sm">
                  ما با بیش از یک دهه تجربه در تأمین تجهیزات صنعتی و قطعات خطوط تولید، همواره در کنار شما هستیم تا بهترین محصولات، مشاوره تخصصی و پشتیبانی کامل را ارائه دهیم.
                </p>
              </div>

              {/* Orange Action Button */}
              <div className="relative z-10 pt-6 mt-auto">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-orange-500/25 transition-all cursor-pointer group"
                >
                  <span>بیشتر بدانید</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* 2. CENTER: The 6 Feature Cards (وسط - ۶ ویژگی در ۲ ستون ۳ ردیفه) */}
            <div className="lg:col-span-5 xl:col-span-5 p-4 sm:p-6 lg:p-7 flex items-center">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {whyAtlasItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 sm:p-3.5 bg-white rounded-2xl border border-slate-100/90 shadow-2xs hover:border-orange-200 hover:shadow-xs transition-all group"
                    >
                      <div className="text-right">
                        <h4 className="font-bold text-xs sm:text-[13px] text-[#0A172F] group-hover:text-[#F97316] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 border border-orange-100/80 flex items-center justify-center text-[#F97316] shrink-0 group-hover:bg-[#F97316] group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. LEFT: Industrial Plant Photo with Engineer (سمت چپ - عکس مهندس با زاویه اسلنت موازی) */}
            <div className="lg:col-span-3 xl:col-span-3 relative min-h-[260px] lg:min-h-[320px] overflow-hidden lg:[clip-path:polygon(0_0,100%_0,calc(100%-32px)_100%,0_100%)]">
              <img
                src={STORE_ASSETS.engineerWhyAtlas}
                alt="مهندس ناظر خطوط تولید کارخانجات اطلس"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 right-4 left-4 text-white text-right">
                <div className="text-xs font-bold text-orange-400">کارخانجات و بازرگانی اطلس</div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  پشتیبانی فنی و مهندسی خطوط تولید
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 7. CTA CONSULTATION & INQUIRY BANNER (مشاوره تخصصی و استعلام قیمت)        */}
      {/* ========================================================================= */}
      <section
        className="relative overflow-hidden w-full bg-gradient-to-l from-[#C2410C] via-[#EA580C] to-[#F97316] text-white border-t border-orange-400/40"
        dir="rtl"
      >
        {/* Subtle Ambient Industrial Waves / Geometric Glow */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" viewBox="0 0 1200 240" preserveAspectRatio="none" fill="none">
            <path d="M0,80 C300,10 600,160 900,70 C1050,30 1150,110 1200,80 L1200,240 L0,240 Z" fill="white" opacity="0.4" />
            <path d="M0,120 C250,50 500,190 800,110 C1000,60 1100,170 1200,130 L1200,240 L0,240 Z" fill="white" opacity="0.25" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* RIGHT: Text and Action Buttons (کاملاً راست‌چین طبق تصویر) */}
            <div className="lg:col-span-7 xl:col-span-7 py-8 sm:py-10 lg:py-12 lg:pl-10 space-y-4 text-right">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  مشاوره تخصصی و استعلام قیمت
                </h3>
                <p className="text-xs sm:text-sm text-orange-50/90 font-medium leading-relaxed max-w-xl">
                  تیم کارشناسان ما، آماده پاسخگویی به سوالات شما و ارائه بهترین راهکارهاست
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Dark Navy Button: درخواست مشاوره */}
                <button
                  type="button"
                  onClick={() => setIsConsultOpen(true)}
                  className="h-11 px-6 bg-[#18253A] hover:bg-[#0F172A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-black/30 transition-all flex items-center gap-2 cursor-pointer group shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span>درخواست مشاوره</span>
                </button>

                {/* Orange Phone Call Button */}
                <a
                  href="tel:02142772340"
                  className="h-11 px-5 bg-orange-700/60 hover:bg-orange-700 border border-white/40 hover:border-white text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2.5 backdrop-blur-xs cursor-pointer shrink-0"
                  dir="ltr"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono tracking-wider font-extrabold text-white text-sm sm:text-base">
                    ۰۲۱-۴۲۷۷۲۳۴۰
                  </span>
                </a>
              </div>
            </div>

            {/* LEFT: Industrial Table with Yellow Hard Hat & Machinery (فید نرم به پس‌زمینه نارنجی) */}
            <div className="lg:col-span-5 xl:col-span-5 relative h-52 sm:h-60 lg:h-72 w-full overflow-hidden">
              <img
                src={STORE_ASSETS.ctaConsultBanner}
                alt="مشاوره تخصصی و استعلام قیمت قطعات خط تولید"
                className="w-full h-full object-cover object-center"
              />
              {/* Gradient masks blending smoothly from image to orange banner */}
              <div className="absolute inset-0 bg-gradient-to-l from-[#EA580C] via-[#EA580C]/40 to-transparent hidden lg:block pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#EA580C] via-[#EA580C]/30 to-transparent lg:hidden pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* Global Modals for interactive AI features */}
      <AiVisualPartSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />

      <AiConsultModal isOpen={isConsultOpen} onClose={() => setIsConsultOpen(false)} />
    </div>
  );
};
