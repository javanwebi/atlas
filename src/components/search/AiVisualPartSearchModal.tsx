import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  UploadCloud,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Ruler,
  Sliders,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  Zap,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import {
  aiVisualSearchService,
  AiPartAnalysisResult,
  INDUSTRIAL_PRESET_SAMPLES,
  IndustrialPresetSample,
} from '../../services/aiVisualSearchService';
import { toPersianDigits, formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { pricingCreditService } from '../../services/pricingCreditService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 1 | 2 | 3 | 'analyzing' | 'results';

export const AiVisualPartSearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { currentUser } = useAuth();

  // Wizard state: 1: Image, 2: Dimensions, 3: Application & Features, 'analyzing', 'results'
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Form states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [pitch, setPitch] = useState<string>('');
  const [application, setApplication] = useState<string>('');
  const [features, setFeatures] = useState<string>('');

  // Camera stream state
  const [isUsingCamera, setIsUsingCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis result & error
  const [analysisResult, setAnalysisResult] = useState<AiPartAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Quick preset chips for applications and features
  const APPLICATION_SUGGESTIONS = [
    'کوره رولری پخت کاشی و سرامیک',
    'خط لعاب‌کاری و چاپ دیجیتال',
    'فن‌های مکنده و کمپرسور باد',
    'ماشین‌آلات بسته‌بندی پرسرعت',
    'پرس هیدرولیک و اکسترودر',
    'نوار نقاله و خطوط انتقال مواد',
  ];

  const FEATURE_SUGGESTIONS = [
    'مقاوم به حرارت بالا (تا ۱۲۰۰ درجه)',
    'ضدروغن، اسید و گریس صنعتی',
    'روکش پارچه‌ای ضدسایش (بی‌صدا)',
    'کورد استیل ضدزنگ و تقویت‌شده',
    'بدون لغزش دندانه و انعطاف بالا',
  ];

  // Handle file drop / select
  const handleFile = async (file: File) => {
    try {
      setErrorMessage('');
      const converted = await aiVisualSearchService.fileToBase64(file);
      setSelectedImage(converted.base64);
      setMimeType(converted.mimeType);
      if (isUsingCamera) stopCamera();
    } catch {
      setErrorMessage('خطا در خواندن فایل تصویر. لطفاً تصویر دیگری انتخاب نمایید.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Preset sample loader
  const loadPreset = (preset: IndustrialPresetSample) => {
    setSelectedImage(preset.imageUrl);
    setMimeType('image/jpeg');
    setLength(preset.length.toString());
    setWidth(preset.width.toString());
    if (preset.pitch) setPitch(preset.pitch.toString());
    else setPitch('');
    setApplication(preset.application);
    setFeatures(preset.features);
    setErrorMessage('');
    if (isUsingCamera) stopCamera();
    // Move to step 2 directly with preset data for quick flow
    setCurrentStep(2);
  };

  // Camera start / stop / capture
  const startCamera = async () => {
    try {
      setIsUsingCamera(true);
      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setIsUsingCamera(false);
      setErrorMessage('دسترسی به دوربین برقرار نشد. لطفاً از آپلود فایل یا تصاویر نمونه استفاده کنید.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsUsingCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(dataUrl);
        setMimeType('image/jpeg');
        stopCamera();
      }
    }
  };

  // Reset all
  const resetForm = () => {
    stopCamera();
    setSelectedImage(null);
    setLength('');
    setWidth('');
    setPitch('');
    setApplication('');
    setFeatures('');
    setAnalysisResult(null);
    setErrorMessage('');
    setCurrentStep(1);
  };

  // Navigation handlers
  const goToStep2 = () => {
    setErrorMessage('');
    setCurrentStep(2);
  };

  const goToStep3 = () => {
    if (!length && !width && !selectedImage) {
      setErrorMessage('لطفاً طول و عرض تقریبی را وارد نمایید یا در مرحله قبل تصویر بارگذاری کنید.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(3);
  };

  // Submit to AI
  const handleAnalyze = async () => {
    if (!selectedImage && !length && !width) {
      setErrorMessage('لطفاً حداقل تصویر قطعه یا ابعاد (طول و عرض) را مشخص فرمایید.');
      return;
    }

    setErrorMessage('');
    setCurrentStep('analyzing');

    try {
      const result = await aiVisualSearchService.analyzePartWithAi({
        imageBase64: selectedImage || undefined,
        mimeType: mimeType,
        length: length ? parseFloat(length) : undefined,
        width: width ? parseFloat(width) : undefined,
        pitch: pitch ? parseFloat(pitch) : undefined,
        application: application.trim() || undefined,
        features: features.trim() || undefined,
      });

      setAnalysisResult(result);
      setCurrentStep('results');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'خطا در ارتباط با سامانه تحلیل هوش مصنوعی.');
      setCurrentStep(3);
    }
  };

  // Calculate inquiry price for user
  const getItemPrice = (catalogItem?: any) => {
    if (!catalogItem) return null;
    const inquiry = pricingCreditService.calculateInquiryPrice(
      catalogItem,
      currentUser?.assignedPriceListId,
      currentUser?.assignedGradeId
    );
    return inquiry;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        stopCamera();
        onClose();
      }}
      title="شناسایی هوشمند قطعه و تسمه با هوش مصنوعی"
      maxWidth="lg"
    >
      <div className="text-right space-y-5">
        {/* TOP STEPPER (Only visible during steps 1, 2, 3) */}
        {typeof currentStep === 'number' && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              {/* Stepper connecting line */}
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
              <div
                className="absolute top-1/2 right-6 -translate-y-1/2 h-0.5 bg-[#F97316] transition-all duration-300 z-0"
                style={{
                  width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                }}
              />

              {/* Step 1 Item */}
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group transition-all`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 1
                      ? 'bg-[#F97316] text-white ring-4 ring-orange-100 shadow-sm'
                      : currentStep > 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4" /> : '۱'}
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    currentStep === 1 ? 'text-[#F97316]' : 'text-slate-600'
                  }`}
                >
                  تصویر قطعه
                </span>
              </button>

              {/* Step 2 Item */}
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group transition-all`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 2
                      ? 'bg-[#F97316] text-white ring-4 ring-orange-100 shadow-sm'
                      : currentStep > 2
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4" /> : '۲'}
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    currentStep === 2 ? 'text-[#F97316]' : 'text-slate-600'
                  }`}
                >
                  طول و عرض
                </span>
              </button>

              {/* Step 3 Item */}
              <button
                type="button"
                onClick={() => {
                  if (selectedImage || length || width) {
                    setCurrentStep(3);
                  }
                }}
                className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group transition-all`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === 3
                      ? 'bg-[#F97316] text-white ring-4 ring-orange-100 shadow-sm'
                      : 'bg-white text-slate-400 border border-slate-300'
                  }`}
                >
                  ۳
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    currentStep === 3 ? 'text-[#F97316]' : 'text-slate-600'
                  }`}
                >
                  کاربرد و ویژگی‌ها
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* MAIN STEP CONTENT AREA WITH MOTION ANIMATION */}
        <AnimatePresence mode="wait">
          {/* ============================================================ */}
          {/* STEP 1: IMAGE CAPTURE & UPLOAD                               */}
          {/* ============================================================ */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h4 className="text-base font-black text-[#0A172F] flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5 text-[#F97316]" />
                  <span>مرحله اول: بارگذاری تصویر تسمه یا قطعه</span>
                </h4>
                <p className="text-xs text-slate-500">
                  یک عکس واضح از مقطع یا دندانه‌های قطعه بارگذاری کنید یا با دوربین عکس بگیرید.
                </p>
              </div>

              {/* Upload Dropzone / Camera View / Selected Image */}
              {!selectedImage && !isUsingCamera ? (
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragOver
                      ? 'border-[#F97316] bg-orange-50/60 scale-[1.01]'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-[#F97316] mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-sm text-[#0A172F]">
                    عکس قطعه را اینجا بکشید یا برای انتخاب کلیک کنید
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    پشتیبانی از انواع فرمت‌های JPG، PNG و WEBP
                  </span>

                  <div className="mt-5 pt-4 border-t border-slate-200 w-full max-w-xs flex justify-center">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="h-10 px-5 bg-white hover:bg-orange-50 border border-slate-300 hover:border-[#F97316] text-[#0A172F] rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <Camera className="w-4 h-4 text-[#F97316]" />
                      <span>عکس‌برداری با دوربین گوشی یا لپ‌تاپ</span>
                    </button>
                  </div>
                </div>
              ) : isUsingCamera ? (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-md">
                  <div className="aspect-video max-h-72 w-full flex items-center justify-center bg-black">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 px-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="h-10 px-5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>ثبت عکس قطعه</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="h-10 px-4 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                /* Selected Image Preview */
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative shrink-0">
                    <img
                      src={selectedImage}
                      alt="قطعه انتخابی"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>عکس بارگذاری شد</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-right">
                    <span className="text-xs font-bold text-[#0A172F] block">
                      تصویر آماده پردازش هوش مصنوعی است
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      هوش مصنوعی در مرحله بعدی دندانه‌ها و نوع مقطع این تصویر را با ابعاد هندسی تطبیق خواهد داد.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-slate-700 hover:text-[#F97316] bg-white border border-slate-200 hover:border-orange-300 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        تغییر تصویر
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          stopCamera();
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        حذف تصویر
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sample Presets for Quick Testing */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 block">
                  یا جهت تست سریع، یکی از نمونه‌های آماده صنعتی را انتخاب نمایید:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INDUSTRIAL_PRESET_SAMPLES.map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => loadPreset(sample)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-orange-50/70 hover:border-[#F97316] text-right transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="font-bold text-[11px] text-[#0A172F] group-hover:text-[#F97316] line-clamp-1">
                          {sample.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {sample.length}×{sample.width}mm
                        </div>
                      </div>
                      <span className="text-[10px] text-[#F97316] font-bold mt-2 inline-flex items-center gap-0.5">
                        <span>انتخاب سریع</span>
                        <ChevronLeft className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                >
                  پاک کردن فرم
                </button>

                <button
                  type="button"
                  onClick={goToStep2}
                  className="h-11 px-6 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>مرحله بعد: ابعاد محصول (طول و عرض)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: DIMENSIONS (LENGTH & WIDTH)                          */}
          {/* ============================================================ */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h4 className="text-base font-black text-[#0A172F] flex items-center justify-center gap-2">
                  <Ruler className="w-5 h-5 text-[#F97316]" />
                  <span>مرحله دوم: مشخص کردن طول و عرض محصول</span>
                </h4>
                <p className="text-xs text-slate-500">
                  ابعاد فیزیکی قطعه را برحسب میلی‌متر وارد نمایید تا انطباق دقیق در کاتالوگ انجام گیرد.
                </p>
              </div>

              {/* Context bar showing if image was selected */}
              {selectedImage && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedImage}
                      alt="قطعه"
                      className="w-10 h-10 object-cover rounded-lg border border-emerald-200 bg-black"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        تصویر قطعه دریافت شد
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        اکنون ابعاد قطعه را وارد نمایید
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    تغییر عکس
                  </button>
                </div>
              )}

              {/* Dimensions Input Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Length Input */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-[#0A172F]">
                    طول قطعه یا تسمه (میلی‌متر) <span className="text-[#F97316]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      dir="ltr"
                      value={length}
                      onChange={e => setLength(e.target.value)}
                      placeholder="مثلاً 1760"
                      className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm font-mono text-left focus:border-[#F97316] focus:bg-white focus:outline-none bg-white shadow-2xs"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono pointer-events-none">
                      mm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    محیط دور بیرونی، طول گام دندانه یا طول کلی رولیک/نوار
                  </p>
                </div>

                {/* Width Input */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-[#0A172F]">
                    عرض مقطع (میلی‌متر) <span className="text-[#F97316]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      dir="ltr"
                      value={width}
                      onChange={e => setWidth(e.target.value)}
                      placeholder="مثلاً 50 یا 13"
                      className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm font-mono text-left focus:border-[#F97316] focus:bg-white focus:outline-none bg-white shadow-2xs"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono pointer-events-none">
                      mm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    پهنای پشت تسمه، قطر لوله رولیک یا ضخامت نوار
                  </p>
                </div>
              </div>

              {/* Optional Pitch / Tooth Profile */}
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0A172F]">
                    فاصله گام دندانه‌ها یا ضخامت (اختیاری)
                  </label>
                  <span className="text-[10px] text-slate-400">اختیاری</span>
                </div>
                <div className="relative max-w-sm">
                  <input
                    type="number"
                    dir="ltr"
                    value={pitch}
                    onChange={e => setPitch(e.target.value)}
                    placeholder="مثلاً 8 برای گام 8M یا 10 برای T10"
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl text-xs font-mono text-left focus:border-[#F97316] focus:bg-white focus:outline-none bg-white shadow-2xs"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono pointer-events-none">
                    mm
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  فاصله نوک یک دندانه تا نوک دندانه بعدی بر حسب میلی‌متر (در صورت نامشخص بودن خالی بگذارید).
                </p>
              </div>

              {/* Step 2 Actions (Back & Next) */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت به مرحله تصویر</span>
                </button>

                <button
                  type="button"
                  onClick={goToStep3}
                  className="h-11 px-6 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>مرحله بعد: کاربرد و ویژگی‌ها</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: APPLICATION & FEATURES (FINAL STEP BEFORE AI)        */}
          {/* ============================================================ */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h4 className="text-base font-black text-[#0A172F] flex items-center justify-center gap-2">
                  <Sliders className="w-5 h-5 text-[#F97316]" />
                  <span>مرحله سوم: برای چه کاری می‌خواهید؟ و ویژگی‌های محصول</span>
                </h4>
                <p className="text-xs text-slate-500">
                  نوع دستگاه و شرایط کاری را مشخص فرمایید تا بهترین قطعه سازگار انتخاب شود.
                </p>
              </div>

              {/* Compact Review of Steps 1 & 2 */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="قطعه"
                      className="w-9 h-9 object-cover rounded-lg border border-slate-300 bg-black"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-[#0A172F] block">
                      {selectedImage ? 'تصویر دارد' : 'بدون تصویر'}
                    </span>
                    <span className="text-slate-500 text-[11px] font-mono">
                      طول: {length ? `${length}mm` : 'نامشخص'} | عرض: {width ? `${width}mm` : 'نامشخص'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#F97316] font-bold hover:underline cursor-pointer"
                >
                  ویرایش ابعاد
                </button>
              </div>

              {/* 1. Application / Purpose */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0A172F] flex items-center justify-between">
                  <span>برای چه کاری می‌خواهید؟ (دستگاه یا صنعت مورد نظر)</span>
                  <span className="text-[11px] text-slate-400 font-normal">توصیه شده</span>
                </label>
                <textarea
                  rows={2}
                  value={application}
                  onChange={e => setApplication(e.target.value)}
                  placeholder="مثال: برای کوره رولری پخت سوم کاشی، فن مکنده صنعتی، خط انتقال بسته‌بندی، نساجی، سنگبری..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:border-[#F97316] focus:bg-white focus:outline-none bg-slate-50/50 resize-none transition-colors"
                />

                {/* Quick Application Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold ml-1">پیشنهاد سریع:</span>
                  {APPLICATION_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setApplication(item)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        application === item
                          ? 'bg-orange-50 border-[#F97316] text-[#F97316] font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Features / Environmental requirements */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#0A172F] flex items-center justify-between">
                  <span>ویژگی خاص یا الزامات فنی قطعه</span>
                  <span className="text-[11px] text-slate-400 font-normal">اختیاری</span>
                </label>
                <input
                  type="text"
                  value={features}
                  onChange={e => setFeatures(e.target.value)}
                  placeholder="مثال: مقاومت به حرارت ۱۲۰۰ درجه، ضدروغن و گریس، روکش ضدسایش دندانه، کورد استیل..."
                  className="w-full h-10 px-3 border border-slate-300 rounded-xl text-xs focus:border-[#F97316] focus:bg-white focus:outline-none bg-slate-50/50 transition-colors"
                />

                {/* Quick Feature Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold ml-1">ویژگی‌های پرکاربرد:</span>
                  {FEATURE_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (features.includes(item)) return;
                        setFeatures(features ? `${features}، ${item}` : item);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-[#F97316] hover:text-[#F97316] transition-all cursor-pointer"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 Actions: Back to Step 2 & Trigger AI Analysis */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت به مرحله ابعاد</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="h-11 px-7 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تحلیل هوش مصنوعی و یافتن کالا</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP: ANALYZING STATE                                        */}
          {/* ============================================================ */}
          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-14 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-[#F97316] animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="absolute -inset-1 border-2 border-[#F97316] border-t-transparent rounded-2xl animate-spin" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-base font-black text-[#0A172F]">
                  در حال تحلیل هوشمند و انطباق با کاتالوگ ۵٬۰۰۰ قلمی
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  هوش مصنوعی در حال بررسی هندسه دندانه‌ها، زاویه مقطع، ابعاد{' '}
                  {length ? `${length}mm` : ''} و انطباق با نیاز شماست...
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium pt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>پردازش بلادرنگ هوش مصنوعی</span>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP: RESULTS VIEW                                           */}
          {/* ============================================================ */}
          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-5"
            >
              {/* Summary Bar */}
              <div className="bg-[#0A172F] text-white p-4 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">
                        نتیجه تطبیق قطعه توسط هوش مصنوعی
                      </div>
                      <div className="text-[11px] text-slate-400">
                        نوع قطعه: {analysisResult.summary.detectedPartType} | مقطع: {analysisResult.summary.detectedProfile}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ضریب اطمینان: {toPersianDigits(analysisResult.summary.confidence)}٪</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>جستجوی جدید</span>
                    </button>
                  </div>
                </div>

                {/* Visual Analysis Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysisResult.summary.visualAnalysis}
                </p>
              </div>

              {/* Matched Products List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#0A172F] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#F97316]" />
                    <span>کالاهای شناسایی‌شده ({toPersianDigits(analysisResult.matchedProducts.length)} مورد)</span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    مرتب بر اساس بالاترین دقت انطباق
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResult.matchedProducts.map((match, idx) => {
                    const catalogItem = match.catalogProduct;
                    const priceInfo = getItemPrice(catalogItem);

                    return (
                      <div
                        key={match.code + idx}
                        className="bg-white border border-slate-200 hover:border-[#F97316] rounded-2xl p-4 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-[#F97316] font-mono text-xs font-bold">
                              {match.code}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                              <Zap className="w-3 h-3 text-emerald-600" />
                              <span>{toPersianDigits(match.similarityScore)}٪ انطباق</span>
                            </span>
                          </div>

                          <h5 className="font-bold text-sm text-[#0A172F] leading-snug">
                            {match.name}
                          </h5>

                          {/* Distinction note if slight difference exists between items */}
                          {match.distinction && (
                            <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/70 text-[11px] text-blue-900 flex items-start gap-1.5">
                              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>
                                <strong>تفاوت عملکردی:</strong> {match.distinction}
                              </span>
                            </div>
                          )}

                          <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                            {match.matchReason}
                          </p>

                          {/* Quick Specs */}
                          <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                            {match.specs.slice(0, 4).map((s, sIdx) => (
                              <div key={sIdx} className="bg-slate-50 px-2 py-1 rounded-md text-[10px] text-slate-600 flex justify-between">
                                <span>{s.key}:</span>
                                <span className="font-mono font-bold text-[#0A172F]">{s.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="pt-3 border-t border-slate-100 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">قیمت / استعلام:</span>
                            {priceInfo ? (
                              <div className="text-left font-bold text-[#0A172F]">
                                <span>{formatPrice(priceInfo.calculatedPrice)}</span>
                                {priceInfo.discountPercent > 0 && (
                                  <span className="text-[10px] text-emerald-600 mr-1">
                                    ({toPersianDigits(priceInfo.discountPercent)}٪ تخفیف)
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[#F97316] font-bold">استعلام آنلاین</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {catalogItem && (
                              <button
                                type="button"
                                onClick={() => addItem(catalogItem, 1)}
                                className="flex-1 h-9 bg-slate-100 hover:bg-orange-50 hover:text-[#F97316] text-[#0A172F] rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>افزودن به سبد</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                navigate(`/product/${match.code}`);
                              }}
                              className="h-9 px-4 bg-[#0A172F] hover:bg-[#1B293E] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>مشاهده کالا</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technical Advice Footnote */}
              {analysisResult.technicalAdvice && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold block">توصیه فنی مهندسی هایپر صنعت اطلس:</span>
                    <p className="leading-relaxed">{analysisResult.technicalAdvice}</p>
                  </div>
                </div>
              )}

              {/* Return to edit button */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>بازگشت و اصلاح مشخصات</span>
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-[#0A172F] font-bold cursor-pointer"
                >
                  شروع جستجوی جدید
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
