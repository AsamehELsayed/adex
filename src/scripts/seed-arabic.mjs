import dotenv from 'dotenv';
import { connectDB } from '../lib/db.js';
import Content from '../models/Content.js';
import Service from '../models/Service.js';

dotenv.config();

const contentTranslations = {
  'hero-section': {
    label: 'استشارات استراتيجية',
    title: 'حيث تلتقي الاستراتيجية\nبالتنفيذ',
    description:
      'نتعاون مع القادة أصحاب الرؤية لتحويل الاستراتيجيات الطموحة إلى نتائج قابلة للقياس. نجاحكم هو التزامنا.',
    primaryButton: 'ابدأ محادثة',
    secondaryButton: 'استكشف الخدمات',
  },
  'about-section': {
    label: 'عن شركتنا',
    title: 'شريكك الاستراتيجي\nلأثر مستدام',
    description1:
      'تتميّز أدكس بكونها شريكا استراتيجيا لا مجرد جهة استشارية. نندمج مع رؤية مؤسستكم وتحدياتها وطموحاتها.',
    description2:
      'يضم فريقنا خبراء تنفيذيين ومتخصصين يمتلكون عقودا من الخبرة العملية عبر الشركات الكبرى والشركات الناشئة سريعة النمو. نحن لا نقدّم المشورة فقط، بل ننفّذ معكم.',
    linkText: 'اعرف المزيد عنا',
    statLabel: 'عاما من التميّز',
  },
  'services-section': {
    label: 'خبراتنا',
    title: 'حلول شاملة\nلتحديات معقدة',
    description:
      'نقدّم خدمات استشارية متكاملة تعالج أبرز تحديات أعمالكم وتفتح فرصا جديدة للنمو.',
  },
  'why-choose-us-section': {
    label: 'تميّز أدكس',
    title: 'لماذا يختار القادة\nالشراكة معنا',
    reasons: [
      {
        title: 'نهج قائم على النتائج',
        description:
          'نقيس كل مشروع بنتائج ملموسة. نحدّد مؤشرات النجاح من البداية ونلتزم بتحقيق أثر واضح.',
        statLabel: 'رضا العملاء',
      },
      {
        title: 'خبرة قطاعية عميقة',
        description:
          'يمتلك مستشارونا معرفة متخصصة عبر قطاعات متعددة من التقنية والرعاية الصحية إلى المالية والصناعة.',
        statLabel: 'قطاعات خدمناها',
      },
      {
        title: 'تنفيذ عملي مباشر',
        description:
          'لا نقدّم توصيات ونغادر؛ نعمل مع فرقكم لضمان التنفيذ الناجح وتحقيق النتائج.',
        statLabel: 'مشروعا تم تنفيذه',
      },
    ],
  },
  'cta-section': {
    label: 'مستعد للتحول؟',
    title: 'لنصنع معاً\nفصلكم القادم',
    description:
      'كل تحول كبير يبدأ بمحادثة. شاركونا رؤيتكم وسنرسم معا طريق التنفيذ.',
    primaryButton: 'احجز استشارة',
    secondaryButton: 'اطلع على خدماتنا',
  },
  'about-page': {
    hero: {
      label: 'عن أدكس',
      title: 'مستشارون موثوقون\nلقادة الصناعة',
      description:
        'لأكثر من عقدين، تعاونت أدكس مع المؤسسات الطموحة لمواجهة التعقيد وتحقيق نتائج نوعية.',
    },
    story: {
      title: 'قصتنا',
      paragraphs: [
        'تأسست أدكس عام 1998 على مبدأ بسيط: يجب أن تحقق الاستشارات نتائج عملية لا مجرد عروض تقديمية.',
        'اليوم نمونا إلى شركة عالمية بمكاتب في عدة مناطق، ويضم فريقنا خبرات متنوعة وعميقة عبر قطاعات مختلفة.',
        'ما لم يتغير هو التزامنا الأساسي: نقيس نجاحنا بمدى النجاح الذي نحققه لعملائنا.',
      ],
    },
    values: {
      label: 'قيمنا',
      title: 'مبادئ تقود\nكل شراكة',
      values: [
        {
          title: 'التميّز بلا تنازل',
          description: 'نضع أعلى المعايير في كل عمل ونلتزم بجودة استثنائية.',
        },
        {
          title: 'شراكة العميل',
          description: 'نجاحنا مرتبط بنجاحكم، ونبني علاقة قائمة على الثقة المتبادلة.',
        },
        {
          title: 'النزاهة أولاً',
          description: 'نقدّم رأيا صريحا وشفافا حتى في القرارات الصعبة.',
        },
        {
          title: 'مدفوعون بالابتكار',
          description: 'نطوّر منهجياتنا باستمرار ونستفيد من التقنيات الحديثة.',
        },
      ],
    },
    cta: {
      title: 'انضم إلى فريقنا',
      description: 'نبحث دائما عن المواهب المتميزة للانضمام إلى فريقنا المتنامي.',
      buttonText: 'تواصل معنا',
    },
  },
  'services-page': {
    hero: {
      label: 'خدماتنا',
      title: 'حلول شاملة\nلتحديات معقدة',
      description:
        'نقدّم خدمات استشارية متكاملة لمعالجة تحدياتكم الأكثر إلحاحا وفتح فرص نمو مستدامة.',
    },
    cta: {
      title: 'هل أنتم مستعدون للبدء؟',
      description:
        'كل شراكة تبدأ بفهم تحدياتكم وأهدافكم. لنبدأ هذه المحادثة.',
      buttonText: 'احجز استشارة',
    },
    discussButtonText: 'ناقش احتياجاتك',
    capabilitiesLabel: 'القدرات الأساسية',
  },
  'vision-page': {
    hero: {
      label: 'الرؤية والقيم',
      title: 'نسترشد بالهدف\nونقود بالتميّز',
      description:
        'تشكل رؤيتنا وقيمنا كل ما نقوم به، من علاقتنا بالعملاء إلى تطوير فرقنا.',
    },
    vision: {
      label: 'رؤيتنا',
      title: 'أن نكون المحفز\nللتغيير التحولي',
      description:
        'نؤمن بعالم تمتلك فيه كل مؤسسة القدرة على تحويل إمكاناتها إلى نتائج ملموسة.',
    },
    mission: {
      label: 'رسالتنا',
      title: 'تمكين القادة\nلتحقيق الاستثنائي',
      description:
        'نتعاون مع القادة أصحاب الرؤية لتحويل الاستراتيجيات الطموحة إلى نتائج قابلة للقياس.',
    },
    values: {
      label: 'القيم الأساسية',
      title: 'المبادئ التي نعيش بها',
      values: [
        { title: 'الابتكار', description: 'نتبنى الأفكار الجديدة ونطوّر حلولنا باستمرار.' },
        { title: 'النزاهة', description: 'المصداقية والممارسة الأخلاقية أساس كل علاقة.' },
        { title: 'منظور عالمي', description: 'نقدّم خبرة دولية ورؤى متنوعة في كل مشروع.' },
        { title: 'الشراكة', description: 'ننجح حين ينجح عملاؤنا، وأهدافهم هي أهدافنا.' },
      ],
    },
    commitment: {
      label: 'التزامنا',
      title: 'نتائج ذات معنى\nوعلاقات تدوم',
      description:
        'نقيس النجاح بنتائجنا وبالعلاقات طويلة الأمد التي نبنيها مع عملائنا.',
      buttonText: 'شاركنا الرحلة',
    },
  },
  'contact-page': {
    hero: {
      label: 'اتصل بنا',
      title: 'لنبدأ\nمحادثة',
      description:
        'كل تحول كبير يبدأ بمحادثة. يسعدنا الاستماع إلى تحدياتكم واستكشاف كيف نساعدكم.',
    },
    form: {
      title: 'أرسل لنا رسالة',
      nameLabel: 'الاسم الكامل *',
      emailLabel: 'البريد الإلكتروني *',
      companyLabel: 'الشركة',
      phoneLabel: 'رقم الهاتف *',
      messageLabel: 'كيف يمكننا مساعدتك؟ *',
      submitButton: 'إرسال الرسالة',
    },
    info: {
      title: 'تواصل معنا',
      description:
        'فريقنا متاح لمناقشة احتياجاتكم الاستراتيجية. يمكنكم التواصل معنا عبر القنوات التالية.',
      address: {
        title: 'المقر الرئيسي',
      },
      email: {
        title: 'البريد الإلكتروني',
      },
      phone: {
        title: 'الهاتف',
      },
    },
  },
  'header-section': {
    navLinks: [
      { name: 'الرئيسية', path: '/' },
      { name: 'من نحن', path: '/about' },
      { name: 'خدماتنا', path: '/services' },
      { name: 'رؤيتنا', path: '/vision' },
      { name: 'اتصل بنا', path: '/contact' },
    ],
    ctaText: 'تواصل معنا',
  },
  'footer-section': {
    brandDescription:
      'استشارات استراتيجية للمؤسسات التي تسعى لتحويل رؤيتها إلى نتائج قابلة للقياس.',
    navigationLinks: [
      { name: 'من نحن', path: '/about' },
      { name: 'خدماتنا', path: '/services' },
      { name: 'الرؤية والقيم', path: '/vision' },
      { name: 'اتصل بنا', path: '/contact' },
    ],
    bottomLinks: [
      { name: 'سياسة الخصوصية', url: '#' },
      { name: 'الشروط والأحكام', url: '#' },
    ],
    copyrightText: 'أدكس للاستشارات. جميع الحقوق محفوظة.',
  },
};

const serviceDictionary = {
  'Strategy Consulting': {
    title: 'الاستشارات الاستراتيجية',
    subtitle: 'حدّد ميزتك التنافسية',
    description:
      'في الأسواق المتسارعة، لا تكفي الخطة وحدها. نبني أطر عمل مرنة تحافظ على الأهداف طويلة المدى.',
    capabilities: [
      'استراتيجية الشركة ووحدات الأعمال',
      'خطط دخول الأسواق والتوسع',
      'التموضع التنافسي',
      'الشراكات الاستراتيجية واستشارات الاندماج والاستحواذ',
      'تخطيط السيناريوهات وتقييم المخاطر',
    ],
  },
  'Business Transformation': {
    title: 'تحول الأعمال',
    subtitle: 'أدر التغيير بثقة',
    description:
      'نقود برامج التحول المعقدة لضمان أثر مستدام على التقنية والثقافة والعمليات.',
    capabilities: [
      'التحول الرقمي',
      'إعادة هيكلة المؤسسات',
      'إدارة التغيير',
      'تطوير الثقافة والقيادة',
      'تكامل ما بعد الاندماج',
    ],
  },
  'Operational Excellence': {
    title: 'التميّز التشغيلي',
    subtitle: 'عزّز الكفاءة والجودة',
    description:
      'نصمم أنظمة تشغيل تحقق نتائج متفوقة باستمرار مع تقليل الهدر والتكلفة.',
    capabilities: [
      'تحسين العمليات والأتمتة',
      'تحول سلسلة الإمداد',
      'برامج خفض التكاليف',
      'أنظمة إدارة الجودة',
      'إدارة الأداء',
    ],
  },
  'Growth & Expansion': {
    title: 'النمو والتوسع',
    subtitle: 'توسّع بدقة استراتيجية',
    description:
      'نساعد المؤسسات على اكتشاف الفرص وبناء القدرات وتنفيذ استراتيجيات توسع مستدامة.',
    capabilities: [
      'دخول أسواق جديدة',
      'ابتكار المنتجات والخدمات',
      'تحسين الإيرادات',
      'تحسين تجربة العملاء',
      'استراتيجية القنوات وتطويرها',
    ],
  },
};

async function upsertArabicContent(key, arData) {
  const content = await Content.findOne({ where: { key } });

  if (!content) {
    await Content.create({
      key,
      type: 'section',
      data: { ar: arData },
      metadata: { seededBy: 'seed-arabic' },
      isActive: true,
    });
    console.log(`✅ Created key '${key}' with Arabic content`);
    return;
  }

  content.data = {
    ...(content.data || {}),
    ar: {
      ...(content.data?.ar || {}),
      ...arData,
    },
  };
  content.metadata = {
    ...(content.metadata || {}),
    seededBy: 'seed-arabic',
    seededAt: new Date().toISOString(),
  };
  await content.save();
  console.log(`✅ Updated Arabic content for '${key}'`);
}

async function seedArabic() {
  try {
    await connectDB();
    console.log('🔄 Seeding Arabic translations...');

    for (const [key, arData] of Object.entries(contentTranslations)) {
      await upsertArabicContent(key, arData);
    }

    const services = await Service.findAll();
    for (const service of services) {
      const mapped = serviceDictionary[service.title] || {
        title: service.title,
        subtitle: service.subtitle || '',
        description: service.description || '',
        capabilities: Array.isArray(service.capabilities) ? service.capabilities : [],
      };

      service.serviceData = {
        ...(service.serviceData || {}),
        ar: {
          ...(service.serviceData?.ar || {}),
          ...mapped,
        },
      };
      await service.save();
    }

    console.log(`✅ Seeded Arabic translations for ${services.length} services`);
    console.log('🎉 Arabic seed complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Arabic translations:', error);
    process.exit(1);
  }
}

seedArabic();
