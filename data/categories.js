export const CATEGORIES = [
  {
    id: 'social-media-campaigns',
    slug: 'social-media-campaigns',
    type: 'social',
    color: '#7C3AED',
    secondaryColor: '#0359D7',
    accentColor: '#E879F9',
    badge: {
      en: '01 · Core Discipline',
      ar: '01 · التخصص الرئيسي'
    },
    title: {
      en: 'Social Media Campaigns',
      ar: 'حملات السوشيال ميديا'
    },
    shortTitle: {
      en: 'Social Media',
      ar: 'سوشيال ميديا'
    },
    subtitle: {
      en: 'Launch campaigns, poster series & unified social grids',
      ar: 'حملات الإطلاق، سلاسل البوسترات، والشبكات البصرية الموحّدة'
    },
    description: {
      en: 'Bold, cohesive social media campaigns crafted with strong typography, product-led art direction, and consistent grid systems where each post stands alone and works as part of the set.',
      ar: 'حملات سوشيال ميديا جريئة ومتماسكة مبنية على التايبوجرافي القوي، وإبراز المنتج، والشبكات البصرية الموحّدة التي تجعل كل تصميم يُقرأ وحده ويعمل ضمن المجموعة.'
    },
    deliverables: {
      en: ['Launch Campaigns', 'Social Grids', 'Arabic & English Typography', 'National Day Posters'],
      ar: ['حملات الإطلاق', 'شبكات السوشيال', 'تايبوجرافي عربي وإنجليزي', 'بوسترات المناسبات الوطنية']
    }
  },
  {
    id: 'product-advertising',
    slug: 'product-advertising',
    type: 'social',
    color: '#0359D7',
    secondaryColor: '#4F46E5',
    accentColor: '#A78BFA',
    badge: {
      en: '02 · Commercial & Product',
      ar: '02 · إعلانات المنتجات'
    },
    title: {
      en: 'Product & Cleanser Campaigns',
      ar: 'حملات المنتجات والإعلانات'
    },
    shortTitle: {
      en: 'Product Campaigns',
      ar: 'حملات المنتجات'
    },
    subtitle: {
      en: 'Product-led visual storytelling, skincare & beverage ads',
      ar: 'تصاميم إعلانية تركّز على المنتج والعناية والمشروبات'
    },
    description: {
      en: 'Clean backgrounds, soft lighting, splash motion cues, and restrained typography designed to place the product front and center.',
      ar: 'خلفيات نظيفة، وإضاءة ناعمة، ولمسات حركة مدروسة تترك المساحة الكاملة للمنتج ليظهر بوضوح وثقة.'
    },
    deliverables: {
      en: ['Product Ad Posts', 'Skincare Visuals', 'Beverage Campaigns', 'Visual Direction'],
      ar: ['إعلانات المنتجات', 'تصاميم العناية بالبشرة', 'حملات المشروبات', 'التوجيه البصري']
    }
  },
  {
    id: 'website-ui-ux',
    slug: 'website-ui-ux',
    type: 'uiux',
    color: '#C026D3',
    secondaryColor: '#7C3AED',
    accentColor: '#60A5FA',
    badge: {
      en: '03 · Digital Products',
      ar: '03 · المنتجات الرقمية'
    },
    title: {
      en: 'Website UI/UX Design',
      ar: 'تصميم واجهات المواقع UI/UX'
    },
    shortTitle: {
      en: 'Website UI/UX',
      ar: 'واجهات UI/UX'
    },
    subtitle: {
      en: 'Multi-page websites, Arabic RTL interfaces & Figma systems',
      ar: 'مواقع متعددة الصفحات، واجهات عربية RTL، وأنظمة فيجما'
    },
    description: {
      en: 'User-centered websites and interfaces designed around clear user flows, bilingual English and right-to-left Arabic typography, and developer-ready Figma layouts.',
      ar: 'مواقع وواجهات مستخدم مصممة حول مسارات واضحة، وتجارب عربية بالكامل من اليمين لليسار (RTL) وإنجليزية، وتسليم جاهز للمطورين على Figma.'
    },
    deliverables: {
      en: ['Multi-Page Websites', 'Arabic RTL Layouts', 'Wireframes & Flows', 'Figma Design Systems'],
      ar: ['مواقع متعددة الصفحات', 'واجهات عربية RTL', 'مسار المستخدم والوايرفريم', 'أنظمة تصميم فيجما']
    }
  },
  {
    id: 'branding-identity',
    slug: 'branding-identity',
    type: 'branding',
    color: '#4F46E5',
    secondaryColor: '#9333EA',
    accentColor: '#E879F9',
    badge: {
      en: '04 · Identity Systems',
      ar: '04 · أنظمة الهوية'
    },
    title: {
      en: 'Branding & Visual Identity',
      ar: 'الهوية البصرية والبراندينج'
    },
    shortTitle: {
      en: 'Branding',
      ar: 'الهوية البصرية'
    },
    subtitle: {
      en: 'Logos, color systems, typography & brand guidelines',
      ar: 'الشعارات، الألوان، الخطوط، وأدلة استخدام الهوية'
    },
    description: {
      en: 'Logos and visual languages that communicate who a brand is at first glance, backed by clear typography, color palettes, and brand guidelines.',
      ar: 'شعارات ولغات بصرية تعبّر عن العلامة التجارية من أول نظرة، مدعومة بنظام ألوان وخطوط ودليل استخدام واضح.'
    },
    deliverables: {
      en: ['Logo Design', 'Color & Type Systems', 'Brand Guidelines', 'Visual Language'],
      ar: ['تصميم الشعارات', 'أنظمة الألوان والخطوط', 'دليل الهوية البصرية', 'اللغة البصرية']
    }
  }
];

export const PROJECT_TYPES = [
  ['social', 'Social Media', 'سوشيال ميديا'],
  ['branding', 'Branding', 'براندينج'],
  ['uiux', 'UI/UX', 'UI/UX']
];

export const UIUX_SUBTYPES = [
  ['website', 'Website', 'موقع ويب'],
  ['mobile', 'Mobile App', 'تطبيق موبايل'],
  ['dashboard', 'Dashboard', 'داشبورد']
];
