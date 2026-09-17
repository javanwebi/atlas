import { Product } from '../types';
import { getProductByCode, generateMockProducts } from '../data/mockGenerator';

export interface AiPartAnalysisRequest {
  imageBase64?: string;
  mimeType?: string;
  length?: number;
  width?: number;
  pitch?: number;
  application?: string;
  features?: string;
}

export interface MatchedPartItem {
  code: string;
  name: string;
  brand: string;
  type: string;
  similarityScore: number;
  matchReason: string;
  distinction?: string;
  specs: { key: string; value: string }[];
  catalogProduct?: Product;
}

export interface AiPartAnalysisResult {
  success: boolean;
  isAiGenerated: boolean;
  summary: {
    detectedPartType: string;
    detectedProfile: string;
    visualAnalysis: string;
    confidence: number;
  };
  matchedProducts: MatchedPartItem[];
  technicalAdvice: string;
  fallbackNotice?: string;
}

// Sample industrial presets for one-click testing
export interface IndustrialPresetSample {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  length: number;
  width: number;
  pitch?: number;
  application: string;
  features: string;
}

export const INDUSTRIAL_PRESET_SAMPLES: IndustrialPresetSample[] = [
  {
    id: 'sample-timing-htd',
    title: 'تسمه تایمینگ دندانه‌دار SWR',
    subtitle: 'HTD-8M با کورد فایبرگلاس سوپر',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    length: 1760,
    width: 50,
    pitch: 8,
    application: 'خط پخت و پرس کاشی و سرامیک میبد',
    features: 'مقاومت بسیار بالا در برابر کشش، بدون لغزش دندانه، روکش ضدسایش',
  },
  {
    id: 'sample-vbelt-forza',
    title: 'تسمه وی‌بلت استاندارد FORZA',
    subtitle: 'مدل ذوزنقه‌ای مقطع SPA',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    length: 1600,
    width: 13,
    application: 'الکتروموتور فن مکنده کوره و پمپ آب صنعتی',
    features: 'تحمل حرارت خط تولید تا ۸۰ درجه، مقاومت به گریس و روغن',
  },
  {
    id: 'sample-kiln-roller',
    title: 'غلتک سرامیکی نسوز کوره اطلس',
    subtitle: 'مدل AT-751 آلومینا بالا',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    length: 3200,
    width: 45,
    application: 'کوره رولری پخت سرامیک پرسلان یزد',
    features: 'تحمل شوک حرارتی تا ۱۲۸۰ درجه سانتی‌گراد، خمش ناچیز در دور مداوم',
  },
  {
    id: 'sample-pu-timing',
    title: 'تسمه پلی‌یورتان دندانه T10',
    subtitle: 'PU سفید با کورد استیل ضدزنگ',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
    length: 1200,
    width: 32,
    pitch: 10,
    application: 'خط انتقال بسته‌بندی و پولیش کاشی بدون سایش',
    features: 'کورد استیل ضدزنگ، مقاومت به مواد شیمیایی و شستشو، ضدلک',
  },
];

export const aiVisualSearchService = {
  async analyzePartWithAi(request: AiPartAnalysisRequest): Promise<AiPartAnalysisResult> {
    const response = await fetch('/api/ai/analyze-part', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`خطای ارتباط با سرور هوش مصنوعی: کد ${response.status}`);
    }

    const data: AiPartAnalysisResult = await response.json();

    // Enrich matched products with full catalog objects
    const allProducts = generateMockProducts();

    data.matchedProducts = data.matchedProducts.map(m => {
      let catalogItem = getProductByCode(m.code);
      if (!catalogItem) {
        // Find by partial code or name
        catalogItem = allProducts.find(
          p => p.code.toLowerCase() === m.code.toLowerCase() || p.name.includes(m.name)
        );
      }
      return {
        ...m,
        catalogProduct: catalogItem,
      };
    });

    return data;
  },

  // Helper to convert File to base64
  fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve({
          base64: result,
          mimeType: file.type || 'image/jpeg',
        });
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  },
};
