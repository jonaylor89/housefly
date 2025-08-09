export type Dictionary = {
  home: {
    heading: string;
    intro: string;
    whyCreated: {
      title: string;
      content: string;
    };
    getStarted: {
      title: string;
      content: string;
    };
  };
  nav: {
    home: string;
    posts: string;
    howTo: string;
  };
  howTo: {
    title: string;
    description: string;
    content: {
      heading: string;
      cloneRepo: {
        title: string;
        description: string;
      };
      chapter1: {
        title: string;
        description: string;
      };
      writeScraper: {
        title: string;
        description: string;
      };
    };
  };
  metadata: {
    title: string;
    description: string;
  };
  posts: {
    title: string;
  };
};

export const dictionaries: Record<string, Dictionary> = {
  en: {
    home: {
      heading: "Housefly",
      intro: "Web scraping is an essential skill for developers, but learning it can be tricky. That's why I created Housefly, a hands-on project designed to teach web scraping through interactive exercises. Inspired by Google Gruyere, Housefly provides a series of small tutorials with dedicated companion websites built to be scraped. The goal? To give you a safe, structured environment to practice and refine your scraping skills.",
      whyCreated: {
        title: "Why Did I Make This?",
        content: "I've seen countless tutorials that explain web scraping in theory, but very few offer real, controlled environments to experiment in. Housefly solves that by providing self-contained challenges where you scrape provided websites and verify your solutions against expected outputs. It's built for hands-on learners who want to do rather than just read.",
      },
      getStarted: {
        title: "How to Get Started",
        content: "Instructions are in the README.md file of the GitHub repository. From there, you can follow the steps to set up and run the project.",
      },
    },
    nav: {
      home: "home",
      posts: "posts",
      howTo: "how-to",
    },
    howTo: {
      title: "How to Get Started",
      description: "Learn how to get started with Housefly",
      content: {
        heading: "How to Get Started",
        cloneRepo: {
          title: "Clone the Repository",
          description: "Clone the repository using the following command:",
        },
        chapter1: {
          title: "Navigate to Chapter 1",
          description: "Each chapter contains a simple website to scrape, along with an expected.txt file defining the correct output.",
        },
        writeScraper: {
          title: "Write Your Scraper",
          description: "Implement your solution inside the corresponding solution[number]/ directory.",
        },
      },
    },
    metadata: {
      title: "Housefly - Web Scraping Playground",
      description: "An interactive learning project designed to teach web scraping through structured challenges, featuring realistic scenarios and automated solution checking.",
    },
    posts: {
      title: "Posts",
    },
  },
  ru: {
    home: {
      heading: "Housefly",
      intro: "Веб-скрапинг является важным навыком для разработчиков, но его изучение может быть непростым. Именно поэтому я создал Housefly, практический проект, разработанный для обучения веб-скрапингу через интерактивные упражнения. Вдохновленный Google Gruyere, Housefly предоставляет серию небольших уроков со специально созданными сайтами-спутниками, которые предназначены для скрапинга. Цель? Предоставить вам безопасную, структурированную среду для практики и совершенствования ваших навыков скрапинга.",
      whyCreated: {
        title: "Почему я создал это?",
        content: "Я видел множество уроков, которые объясняют веб-скрапинг в теории, но очень мало из них предлагают реальные, контролируемые среды для экспериментов. Housefly решает эту проблему, предоставляя автономные задачи, где вы скрапите предоставленные веб-сайты и проверяете свои решения по ожидаемым результатам. Он создан для людей, которые хотят делать, а не просто читать.",
      },
      getStarted: {
        title: "Как начать",
        content: "Инструкции находятся в файле README.md в GitHub-репозитории. Оттуда вы можете следовать инструкциям для настройки и запуска проекта.",
      },
    },
    nav: {
      home: "главная",
      posts: "статьи",
      howTo: "инструкции",
    },
    howTo: {
      title: "Как начать",
      description: "Узнайте, как начать работу с Housefly",
      content: {
        heading: "Как начать",
        cloneRepo: {
          title: "Клонировать репозиторий",
          description: "Клонируйте репозиторий с помощью следующей команды:",
        },
        chapter1: {
          title: "Перейти к Главе 1",
          description: "Каждая глава содержит простой веб-сайт для скрапинга, а также файл expected.txt, определяющий правильный вывод.",
        },
        writeScraper: {
          title: "Напишите свой скрапер",
          description: "Реализуйте свое решение в соответствующем каталоге solution[number]/.",
        },
      },
    },
    metadata: {
      title: "Housefly - Платформа для обучения веб-скрапингу",
      description: "Интерактивный обучающий проект, разработанный для изучения веб-скрапинга через структурированные задачи, с реалистичными сценариями и автоматической проверкой решений.",
    },
    posts: {
      title: "Статьи",
    },
  },
  es: {
    home: {
      heading: "Housefly",
      intro: "El web scraping es una habilidad esencial para los desarrolladores, pero aprenderlo puede ser complicado. Por eso creé Housefly, un proyecto práctico diseñado para enseñar web scraping a través de ejercicios interactivos. Inspirado en Google Gruyere, Housefly proporciona una serie de pequeños tutoriales con sitios web diseñados específicamente para ser scrapeados. ¿El objetivo? Ofrecerte un entorno seguro y estructurado para practicar y perfeccionar tus habilidades de scraping.",
      whyCreated: {
        title: "¿Por qué hice esto?",
        content: "He visto innumerables tutoriales que explican el web scraping en teoría, pero muy pocos ofrecen entornos reales y controlados para experimentar. Housefly resuelve esto proporcionando desafíos autocontenidos donde puedes scrapear sitios web proporcionados y verificar tus soluciones contra resultados esperados. Está hecho para aprendices prácticos que quieren hacer en lugar de solo leer.",
      },
      getStarted: {
        title: "Cómo empezar",
        content: "Las instrucciones están en el archivo README.md del repositorio GitHub. Desde allí, puedes seguir los pasos para configurar y ejecutar el proyecto.",
      },
    },
    nav: {
      home: "inicio",
      posts: "artículos",
      howTo: "guía",
    },
    howTo: {
      title: "Cómo empezar",
      description: "Aprende cómo empezar con Housefly",
      content: {
        heading: "Cómo empezar",
        cloneRepo: {
          title: "Clonar el repositorio",
          description: "Clona el repositorio usando el siguiente comando:",
        },
        chapter1: {
          title: "Navegar al Capítulo 1",
          description: "Cada capítulo contiene un sitio web simple para scrapear, junto con un archivo expected.txt que define la salida correcta.",
        },
        writeScraper: {
          title: "Escribe tu scraper",
          description: "Implementa tu solución dentro del directorio solution[number]/ correspondiente.",
        },
      },
    },
    metadata: {
      title: "Housefly - Plataforma de Aprendizaje de Web Scraping",
      description: "Un proyecto de aprendizaje interactivo diseñado para enseñar web scraping a través de desafíos estructurados, con escenarios realistas y verificación automática de soluciones.",
    },
    posts: {
      title: "Artículos",
    },
  },
  zh: {
    home: {
      heading: "Housefly",
      intro: "网络爬虫是开发者的一项必备技能，但学习过程可能会有点棘手。这就是为什么我创建了Housefly，一个通过交互式练习来教授网络爬虫的实践项目。受到Google Gruyere的启发，Housefly提供了一系列小型教程，配备专门构建的用于爬取的配套网站。目标？给你提供一个安全、结构化的环境，让你练习和提升爬虫技能。",
      whyCreated: {
        title: "我为什么创建这个？",
        content: "我看过无数解释网络爬虫理论的教程，但很少有教程提供真实、受控的环境进行实验。Housefly通过提供自包含的挑战解决了这一问题，你可以爬取提供的网站并根据预期输出验证你的解决方案。它是为想要动手实践而不仅仅是阅读的学习者设计的。",
      },
      getStarted: {
        title: "如何开始",
        content: "指南在GitHub仓库的README.md文件中。从那里，你可以按照步骤设置和运行项目。",
      },
    },
    nav: {
      home: "首页",
      posts: "文章",
      howTo: "指南",
    },
    howTo: {
      title: "如何开始",
      description: "了解如何开始使用Housefly",
      content: {
        heading: "如何开始",
        cloneRepo: {
          title: "克隆仓库",
          description: "使用以下命令克隆仓库：",
        },
        chapter1: {
          title: "进入第1章",
          description: "每一章都包含一个简单的网站供爬取，以及一个定义正确输出的expected.txt文件。",
        },
        writeScraper: {
          title: "编写你的爬虫",
          description: "在相应的solution[number]/目录中实现你的解决方案。",
        },
      },
    },
    metadata: {
      title: "Housefly - 网络爬虫学习平台",
      description: "一个交互式学习项目，旨在通过结构化的挑战教授网络爬虫，包含真实场景和自动解决方案检查。",
    },
    posts: {
      title: "文章",
    },
  },
  ja: {
    home: {
      heading: "Housefly",
      intro: "Webスクレイピングは開発者にとって重要なスキルですが、学習は難しいかもしれません。だからこそ私はHouseflyを作成しました。インタラクティブな演習を通じてWebスクレイピングを教えるために設計された実践的プロジェクトです。Google Gruyereに影響を受け、Houseflyはスクレイピング用に構築された専用のサイトを伴う一連の小さなチュートリアルを提供します。目標は？あなたに安全で構造化された環境を提供し、スクレイピングスキルを練習し改良することです。",
      whyCreated: {
        title: "なぜこれを作ったのか？",
        content: "理論的にWebスクレイピングを説明する数多くのチュートリアルを見てきましたが、実験するための現実的で管理された環境を提供するものはほとんどありません。Houseflyは、提供されたウェブサイトをスクレイピングし、期待される出力に対して解決策を検証する自己完結型の課題を提供することで、この問題を解決します。これは、単に読むだけではなく、実際に行動したい実践的な学習者のために作られています。",
      },
      getStarted: {
        title: "始め方",
        content: "手順はGitHubリポジトリのREADME.mdファイルにあります。そこから、プロジェクトのセットアップと実行の手順に従ってください。",
      },
    },
    nav: {
      home: "ホーム",
      posts: "投稿",
      howTo: "使い方",
    },
    howTo: {
      title: "始め方",
      description: "Houseflyの始め方を学ぶ",
      content: {
        heading: "始め方",
        cloneRepo: {
          title: "リポジトリをクローンする",
          description: "次のコマンドを使用してリポジトリをクローンします：",
        },
        chapter1: {
          title: "第1章に移動する",
          description: "各章にはスクレイピング用のシンプルなウェブサイトと、正しい出力を定義するexpected.txtファイルが含まれています。",
        },
        writeScraper: {
          title: "スクレイパーを書く",
          description: "対応するsolution[number]/ディレクトリ内にソリューションを実装します。",
        },
      },
    },
    metadata: {
      title: "Housefly - Webスクレイピング学習プラットフォーム",
      description: "構造化された課題を通じてWebスクレイピングを教えるために設計されたインタラクティブな学習プロジェクトで、現実的なシナリオと自動解決策チェックを備えています。",
    },
    posts: {
      title: "投稿",
    },
  },
  de: {
    home: {
      heading: "Housefly",
      intro: "Web Scraping ist eine wichtige Fähigkeit für Entwickler, aber das Erlernen kann schwierig sein. Deshalb habe ich Housefly erstellt, ein praktisches Projekt, das Web Scraping durch interaktive Übungen lehrt. Inspiriert von Google Gruyere bietet Housefly eine Reihe kleiner Tutorials mit speziell entwickelten Begleit-Websites, die zum Scrapen gedacht sind. Das Ziel? Dir eine sichere, strukturierte Umgebung zu bieten, um deine Scraping-Fähigkeiten zu üben und zu verfeinern.",
      whyCreated: {
        title: "Warum habe ich das gemacht?",
        content: "Ich habe unzählige Tutorials gesehen, die Web Scraping in der Theorie erklären, aber nur sehr wenige bieten echte, kontrollierte Umgebungen zum Experimentieren. Housefly löst das, indem es eigenständige Herausforderungen bietet, bei denen du bereitgestellte Websites scrapst und deine Lösungen gegen erwartete Ausgaben validierst. Es ist für praktische Lerner gemacht, die handeln wollen, anstatt nur zu lesen.",
      },
      getStarted: {
        title: "Wie fange ich an",
        content: "Anweisungen befinden sich in der README.md-Datei des GitHub-Repositorys. Von dort aus kannst du den Schritten folgen, um das Projekt einzurichten und auszuführen.",
      },
    },
    nav: {
      home: "startseite",
      posts: "beiträge",
      howTo: "anleitung",
    },
    howTo: {
      title: "Wie fange ich an",
      description: "Lerne, wie du mit Housefly anfängst",
      content: {
        heading: "Wie fange ich an",
        cloneRepo: {
          title: "Repository klonen",
          description: "Klone das Repository mit folgendem Befehl:",
        },
        chapter1: {
          title: "Zu Kapitel 1 navigieren",
          description: "Jedes Kapitel enthält eine einfache Website zum Scrapen sowie eine expected.txt-Datei, die die korrekte Ausgabe definiert.",
        },
        writeScraper: {
          title: "Schreibe deinen Scraper",
          description: "Implementiere deine Lösung im entsprechenden solution[number]/ Verzeichnis.",
        },
      },
    },
    metadata: {
      title: "Housefly - Web Scraping Lernplattform",
      description: "Ein interaktives Lernprojekt, das Web Scraping durch strukturierte Herausforderungen lehrt, mit realistischen Szenarien und automatischer Lösungsüberprüfung.",
    },
    posts: {
      title: "Beiträge",
    },
  },
  ro: {
    home: {
      heading: "Housefly",
      intro: "Web scraping-ul este o abilitate esențială pentru dezvoltatori, dar învățarea poate fi dificilă. De aceea am creat Housefly, un proiect hands-on conceput pentru a învăța web scraping prin exerciții interactive. Inspirat de Google Gruyere, Housefly oferă o serie de tutoriale mici cu site-uri web însoțitoare construite special pentru a fi scrapate. Obiectivul? Să îți ofer un mediu sigur și structurat pentru a-ți practica și perfecționa abilitățile de scraping.",
      whyCreated: {
        title: "De ce am făcut asta?",
        content: "Am văzut nenumărate tutoriale care explică web scraping-ul în teorie, dar foarte puține oferă medii reale și controlate pentru experimente. Housefly rezolvă asta prin oferirea de provocări autonome unde poți scrapa site-uri web furnizate și să îți validezi soluțiile față de rezultatele așteptate. Este construit pentru învățătorii practici care vor să facă, nu doar să citească.",
      },
      getStarted: {
        title: "Cum să încep",
        content: "Instrucțiunile sunt în fișierul README.md din repository-ul GitHub. De acolo, poți urma pașii pentru a configura și rula proiectul.",
      },
    },
    nav: {
      home: "acasă",
      posts: "articole",
      howTo: "ghid",
    },
    howTo: {
      title: "Cum să încep",
      description: "Învață cum să începi cu Housefly",
      content: {
        heading: "Cum să încep",
        cloneRepo: {
          title: "Clonează repository-ul",
          description: "Clonează repository-ul folosind următoarea comandă:",
        },
        chapter1: {
          title: "Navighează la Capitolul 1",
          description: "Fiecare capitol conține un site web simplu pentru scraping, alături de un fișier expected.txt care definește output-ul corect.",
        },
        writeScraper: {
          title: "Scrie scraper-ul tău",
          description: "Implementează soluția ta în directorul solution[number]/ corespunzător.",
        },
      },
    },
    metadata: {
      title: "Housefly - Platformă de Învățare Web Scraping",
      description: "Un proiect de învățare interactiv conceput pentru a învăța web scraping prin provocări structurate, cu scenarii realiste și verificare automată a soluțiilor.",
    },
    posts: {
      title: "Articole",
    },
  },
  hi: {
    home: {
      heading: "Housefly",
      intro: "वेब स्क्रैपिंग डेवलपर्स के लिए एक आवश्यक कौशल है, लेकिन इसे सीखना मुश्किल हो सकता है। इसीलिए मैंने Housefly बनाया है, एक व्यावहारिक प्रोजेक्ट जो इंटरैक्टिव अभ्यासों के माध्यम से वेब स्क्रैपिंग सिखाने के लिए डिज़ाइन किया गया है। Google Gruyere से प्रेरित होकर, Housefly छोटे ट्यूटोरियल्स की एक श्रृंखला प्रदान करता है जिसमें स्क्रैपिंग के लिए निर्मित समर्पित साथी वेबसाइटें हैं। लक्ष्य? आपको अपने स्क्रैपिंग कौशल का अभ्यास और सुधार करने के लिए एक सुरक्षित, संरचित वातावरण देना।",
      whyCreated: {
        title: "मैंने यह क्यों बनाया?",
        content: "मैंने अनगिनत ट्यूटोरियल्स देखे हैं जो वेब स्क्रैपिंग को सिद्धांत में समझाते हैं, लेकिन बहुत कम प्रयोग के लिए वास्तविक, नियंत्रित वातावरण प्रदान करते हैं। Housefly इसे स्वयं-निहित चुनौतियां प्रदान करके हल करता है जहाँ आप प्रदान की गई वेबसाइटों को स्क्रैप कर सकते हैं और अपेक्षित आउटपुट के विपरीत अपने समाधानों को सत्यापित कर सकते हैं। यह उन व्यावहारिक शिक्षार्थियों के लिए बनाया गया है जो केवल पढ़ने के बजाय करना चाहते हैं।",
      },
      getStarted: {
        title: "कैसे शुरू करें",
        content: "निर्देश GitHub रिपॉजिटरी की README.md फ़ाइल में हैं। वहाँ से, आप प्रोजेक्ट सेट करने और चलाने के लिए चरणों का पालन कर सकते हैं।",
      },
    },
    nav: {
      home: "होम",
      posts: "पोस्ट्स",
      howTo: "कैसे करें",
    },
    howTo: {
      title: "कैसे शुरू करें",
      description: "जानें कि Housefly के साथ कैसे शुरुआत करें",
      content: {
        heading: "कैसे शुरू करें",
        cloneRepo: {
          title: "रिपॉजिटरी क्लोन करें",
          description: "निम्नलिखित कमांड का उपयोग करके रिपॉजिटरी को क्लोन करें:",
        },
        chapter1: {
          title: "अध्याय 1 पर जाएं",
          description: "प्रत्येक अध्याय में स्क्रैप करने के लिए एक सरल वेबसाइट है, साथ ही सही आउटपुट को परिभाषित करने वाली expected.txt फ़ाइल है।",
        },
        writeScraper: {
          title: "अपना स्क्रैपर लिखें",
          description: "संबंधित solution[number]/ डायरेक्टरी के अंदर अपना समाधान लागू करें।",
        },
      },
    },
    metadata: {
      title: "Housefly - वेब स्क्रैपिंग प्लेग्राउंड",
      description: "संरचित चुनौतियों के माध्यम से वेब स्क्रैपिंग सिखाने के लिए डिज़ाइन किया गया एक इंटरैक्टिव सीखने का प्रोजेक्ट, जिसमें वास्तविक परिदृश्य और स्वचालित समाधान जांच की सुविधा है।",
    },
    posts: {
      title: "पोस्ट्स",
    },
  },
  ta: {
    home: {
      heading: "Housefly",
      intro: "வலை ஸ்கிராப்பிங் என்பது டெவலப்பர்களுக்கு அவசியமான ஒரு திறமையாகும், ஆனால் அதைக் கற்றுக் கொள்வது கடினமாக இருக்கலாம். அதனால்தான் நான் Housefly ஐ உருவாக்கினேன், இது ஊடாடும் பயிற்சிகள் மூலம் வலை ஸ்கிராப்பிங் கற்பிக்க வடிவமைக்கப்பட்ட ஒரு நடைமுறை திட்டமாகும். Google Gruyere இலிருந்து உத்வேகம் பெற்று, Housefly சிறிய பயிற்சிகளின் தொடரை வழங்குகிறது, இதில் ஸ்கிராப் செய்வதற்காக கட்டமைக்கப்பட்ட பிரத்யேக துணை வலைத்தளங்கள் உள்ளன. குறிக்கோள்? உங்கள் ஸ்கிராப்பிங் திறன்களைப் பயிற்சி செய்து மேம்படுத்துவதற்கு பாதுகாப்பான, கட்டமைக்கப்பட்ட சூழலை வழங்குவது.",
      whyCreated: {
        title: "நான் இதை ஏன் உருவாக்கினேன்?",
        content: "வலை ஸ்கிராப்பிங்கை கோட்பாட்டில் விளக்கும் எண்ணற்ற பயிற்சிகளை நான் பார்த்திருக்கிறேன், ஆனால் மிகக் குறைவானவை மட்டுமே பரிசோதனை செய்வதற்கு உண்மையான, கட்டுப்படுத்தப்பட்ட சூழலை வழங்குகின்றன. Housefly இதை சுயமாக அடங்கிய சவால்களை வழங்குவதன் மூலம் தீர்க்கிறது, அங்கு நீங்கள் வழங்கப்பட்ட வலைத்தளங்களை ஸ்கிராப் செய்யலாம் மற்றும் எதிர்பார்க்கப்படும் வெளியீடுகளுக்கு எதிராக உங்கள் தீர்வுகளை சரிபார்க்கலாம். இது வெறுமனே படிப்பதற்குப் பதிலாக செய்ய விரும்பும் நடைமுறைக் கற்றவர்களுக்காக கட்டமைக்கப்பட்டுள்ளது.",
      },
      getStarted: {
        title: "எப்படி தொடங்குவது",
        content: "அறிவுறுத்தல்கள் GitHub களஞ்சியத்தின் README.md கோப்பில் உள்ளன. அங்கிருந்து, நீங்கள் திட்டத்தை அமைக்க மற்றும் இயக்க படிகளை பின்பற்றலாம்.",
      },
    },
    nav: {
      home: "முகப்பு",
      posts: "இடுகைகள்",
      howTo: "எப்படி",
    },
    howTo: {
      title: "எப்படி தொடங்குவது",
      description: "Housefly உடன் எப்படி தொடங்குவது என்பதைக் கற்றுக்கொள்ளுங்கள்",
      content: {
        heading: "எப்படி தொடங்குவது",
        cloneRepo: {
          title: "களஞ்சியத்தை குளோன் செய்யுங்கள்",
          description: "பின்வரும் கட்டளையைப் பயன்படுத்தி களஞ்சியத்தை குளோன் செய்யுங்கள்:",
        },
        chapter1: {
          title: "அத்தியாயம் 1 க்கு செல்லுங்கள்",
          description: "ஒவ்வொரு அத்தியாயத்திலும் ஸ்கிராப் செய்வதற்கான ஒரு எளிய வலைத்தளம் உள்ளது, அதோடு சரியான வெளியீட்டை வரையறுக்கும் expected.txt கோப்பும் உள்ளது.",
        },
        writeScraper: {
          title: "உங்கள் ஸ்கிராப்பரை எழுதுங்கள்",
          description: "தொடர்புடைய solution[number]/ கோப்பகத்தில் உங்கள் தீர்வை செயல்படுத்துங்கள்.",
        },
      },
    },
    metadata: {
      title: "Housefly - வலை ஸ்கிராப்பிங் விளையாட்டு மைதானம்",
      description: "கட்டமைக்கப்பட்ட சவால்களின் மூலம் வலை ஸ்கிராப்பிங் கற்பிக்க வடிவமைக்கப்பட்ட ஒரு ஊடாடும் கற்றல் திட்டம், இதில் யதார்த்தமான காட்சிகள் மற்றும் தானியங்கி தீர்வு சரிபார்ப்பு ஆகியவை உள்ளன.",
    },
    posts: {
      title: "இடுகைகள்",
    },
  },
  gu: {
    home: {
      heading: "Housefly",
      intro: "વેબ સ્ક્રેપિંગ એ ડેવેલપર્સ માટે એક આવશ્યક કૌશલ્ય છે, પરંતુ તે શીખવું મુશ્કેલ હોઈ શકે છે. તે જ કારણે મેં Housefly બનાવ્યું છે, એક હાથ-પર-હાથ પ્રોજેક્ટ જે ઇન્ટરેક્ટિવ અભ્યાસ દ્વારા વેબ સ્ક્રેપિંગ શીખવવા માટે ડિઝાઇન કરવામાં આવ્યું છે. Google Gruyere થી પ્રેરણા લઈને, Housefly નાના ટ્યુટોરિયલ્સની શ્રેણી પ્રદાન કરે છે જેમાં સ્ક્રેપિંગ માટે બનાવેલી ખાસ સાથીદાર વેબસાઇટ્સ છે. લક્ષ્ય? તમારા સ્ક્રેપિંગ કૌશલ્યોનો અભ્યાસ અને સુધારો કરવા માટે સુરક્ષિત, સંરચિત વાતાવરણ પ્રદાન કરવું.",
      whyCreated: {
        title: "મેં આ કેમ બનાવ્યું?",
        content: "મેં અસંખ્ય ટ્યુટોરિયલ જોયા છે જે વેબ સ્ક્રેપિંગને સિદ્ધાંતમાં સમજાવે છે, પરંતુ ખૂબ જ ઓછા પ્રયોગ માટે વાસ્તવિક, નિયંત્રિત વાતાવરણ પ્રદાન કરે છે. Housefly આને સ્વ-સમાવિષ્ટ પડકારો પ્રદાન કરીને હલ કરે છે જ્યાં તમે પ્રદાન કરવામાં આવેલ વેબસાઇટ્સને સ્ક્રેપ કરી શકો છો અને અપેક્ષિત આઉટપુટ સામે તમારા ઉકેલોને ચકાસી શકો છો. તે વ્યવહારિક શિક્ષાર્થીઓ માટે બનાવવામાં આવ્યું છે જેઓ માત્ર વાંચવાને બદલે કરવા માંગે છે.",
      },
      getStarted: {
        title: "કેવી રીતે શરૂઆત કરવી",
        content: "સૂચનાઓ GitHub રિપોઝિટરીની README.md ફાઇલમાં છે. ત્યાંથી, તમે પ્રોજેક્ટ સેટ કરવા અને ચલાવવા માટેના પગલાં અનુસરી શકો છો.",
      },
    },
    nav: {
      home: "હોમ",
      posts: "પોસ્ટ્સ",
      howTo: "કેવી રીતે",
    },
    howTo: {
      title: "કેવી રીતે શરૂઆત કરવી",
      description: "Housefly સાથે કેવી રીતે શરૂઆત કરવી તે શીખો",
      content: {
        heading: "કેવી રીતે શરૂઆત કરવી",
        cloneRepo: {
          title: "રિપોઝિટરી ક્લોન કરો",
          description: "નીચેના આદેશનો ઉપયોગ કરીને રિપોઝિટરી ક્લોન કરો:",
        },
        chapter1: {
          title: "અધ્યાય 1 પર જાઓ",
          description: "દરેક અધ્યાયમાં સ્ક્રેપ કરવા માટે એક સરળ વેબસાઇટ છે, સાથે સાચું આઉટપુટ વ્યાખ્યાયિત કરતી expected.txt ફાઇલ છે.",
        },
        writeScraper: {
          title: "તમારું સ્ક્રેપર લખો",
          description: "અનુરૂપ solution[number]/ ડિરેક્ટરીમાં તમારો ઉકેલ લાગુ કરો.",
        },
      },
    },
    metadata: {
      title: "Housefly - વેબ સ્ક્રેપિંગ પ્લેગ્રાઉન્ડ",
      description: "સંરચિત પડકારો દ્વારા વેબ સ્ક્રેપિંગ શીખવવા માટે ડિઝાઇન કરેલ ઇન્ટરેક્ટિવ શીખવાનો પ્રોજેક્ટ, જેમાં વાસ્તવિક દૃશ્યો અને સ્વચાલિત ઉકેલ તપાસ છે.",
    },
    posts: {
      title: "પોસ્ટ્સ",
    },
  },
  fa: {
    home: {
      heading: "Housefly",
      intro: "وب اسکرپینگ مهارت ضروری برای برنامه‌نویسان است، اما یادگیری آن می‌تواند سخت باشد. به همین دلیل من Housefly را ساختم، یک پروژه عملی که برای آموزش وب اسکرپینگ از طریق تمرینات تعاملی طراحی شده است. با الهام از Google Gruyere، Housefly مجموعه‌ای از آموزش‌های کوچک با وب‌سایت‌های همراه اختصاصی ارائه می‌دهد که برای اسکرپ کردن ساخته شده‌اند. هدف؟ فراهم کردن محیطی امن و ساختاریافته برای تمرین و تقویت مهارت‌های اسکرپینگ شما.",
      whyCreated: {
        title: "چرا این را ساختم؟",
        content: "آموزش‌های بی‌شماری دیده‌ام که وب اسکرپینگ را از نظر تئوری توضیح می‌دهند، اما تعداد بسیار کمی محیط واقعی و کنترل‌شده برای آزمایش ارائه می‌دهند. Housefly این مشکل را با ارائه چالش‌های خودکفا حل می‌کند که در آن می‌توانید وب‌سایت‌های ارائه شده را اسکرپ کنید و راه‌حل‌های خود را در برابر خروجی‌های مورد انتظار اعتبارسنجی کنید. این برای یادگیرندگان عملی که می‌خواهند کار کنند نه فقط بخوانند ساخته شده است.",
      },
      getStarted: {
        title: "چگونه شروع کنیم",
        content: "دستورالعمل‌ها در فایل README.md مخزن GitHub قرار دارد. از آنجا می‌توانید مراحل تنظیم و اجرای پروژه را دنبال کنید.",
      },
    },
    nav: {
      home: "خانه",
      posts: "پست‌ها",
      howTo: "نحوه انجام",
    },
    howTo: {
      title: "چگونه شروع کنیم",
      description: "یاد بگیرید چگونه با Housefly شروع کنید",
      content: {
        heading: "چگونه شروع کنیم",
        cloneRepo: {
          title: "کلون کردن مخزن",
          description: "مخزن را با استفاده از دستور زیر کلون کنید:",
        },
        chapter1: {
          title: "رفتن به فصل ۱",
          description: "هر فصل حاوی یک وب‌سایت ساده برای اسکرپ کردن است، همراه با فایل expected.txt که خروجی صحیح را تعریف می‌کند.",
        },
        writeScraper: {
          title: "اسکرپر خود را بنویسید",
          description: "راه‌حل خود را در دایرکتوری solution[number]/ مربوطه پیاده‌سازی کنید.",
        },
      },
    },
    metadata: {
      title: "Housefly - زمین بازی وب اسکرپینگ",
      description: "پروژه یادگیری تعاملی طراحی شده برای آموزش وب اسکرپینگ از طریق چالش‌های ساختاریافته، با سناریوهای واقعی و بررسی خودکار راه‌حل.",
    },
    posts: {
      title: "پست‌ها",
    },
  },
  ur: {
    home: {
      heading: "Housefly",
      intro: "ویب اسکریپنگ ڈویلپرز کے لیے ایک ضروری مہارت ہے، لیکن اسے سیکھنا مشکل ہو سکتا ہے۔ اسی لیے میں نے Housefly بنایا ہے، ایک عملی پروجیکٹ جو انٹریکٹو مشقوں کے ذریعے ویب اسکریپنگ سکھانے کے لیے ڈیزائن کیا گیا ہے۔ Google Gruyere سے متاثر ہو کر، Housefly چھوٹے ٹیوٹوریلز کی سیریز فراہم کرتا ہے جس میں اسکریپنگ کے لیے بنائی گئی مخصوص ساتھی ویب سائٹس ہیں۔ مقصد؟ آپ کی اسکریپنگ مہارتوں کی مشق اور بہتری کے لیے محفوظ، منظم ماحول فراہم کرنا۔",
      whyCreated: {
        title: "میں نے یہ کیوں بنایا؟",
        content: "میں نے بے شمار ٹیوٹوریلز دیکھے ہیں جو ویب اسکریپنگ کو نظریاتی طور پر سمجھاتے ہیں، لیکن بہت کم تجربے کے لیے حقیقی، کنٹرولڈ ماحول فراہم کرتے ہیں۔ Housefly یہ خود کفیل چیلنجز فراہم کر کے حل کرتا ہے جہاں آپ فراہم کردہ ویب سائٹس کو اسکریپ کر سکتے ہیں اور متوقع آؤٹ پٹ کے مقابلے میں اپنے حل کی توثیق کر سکتے ہیں۔ یہ عملی سیکھنے والوں کے لیے بنایا گیا ہے جو صرف پڑھنے کے بجائے کرنا چاہتے ہیں۔",
      },
      getStarted: {
        title: "کیسے شروع کریں",
        content: "ہدایات GitHub repository کی README.md فائل میں ہیں۔ وہاں سے، آپ پروجیکٹ سیٹ اپ اور چلانے کے قدامات کی پیروی کر سکتے ہیں۔",
      },
    },
    nav: {
      home: "ہوم",
      posts: "پوسٹس",
      howTo: "کیسے کریں",
    },
    howTo: {
      title: "کیسے شروع کریں",
      description: "سیکھیں کہ Housefly کے ساتھ کیسے شروعات کریں",
      content: {
        heading: "کیسے شروع کریں",
        cloneRepo: {
          title: "repository کو clone کریں",
          description: "مندرجہ ذیل کمانڈ استعمال کرتے ہوئے repository کو clone کریں:",
        },
        chapter1: {
          title: "باب 1 پر جائیں",
          description: "ہر باب میں اسکریپ کرنے کے لیے ایک سادہ ویب سائٹ ہے، ساتھ ہی expected.txt فائل جو صحیح آؤٹ پٹ کی تعین کرتی ہے۔",
        },
        writeScraper: {
          title: "اپنا scraper لکھیں",
          description: "متعلقہ solution[number]/ ڈائرکٹری میں اپنا حل نافذ کریں۔",
        },
      },
    },
    metadata: {
      title: "Housefly - ویب اسکریپنگ کھیل کا میدان",
      description: "منظم چیلنجز کے ذریعے ویب اسکریپنگ سکھانے کے لیے ڈیزائن کیا گیا انٹریکٹو سیکھنے کا پروجیکٹ، جس میں حقیقی منظرنامے اور خودکار حل کی جانچ شامل ہے۔",
    },
    posts: {
      title: "پوسٹس",
    },
  },
  ar: {
    home: {
      heading: "Housefly",
      intro: "استخراج البيانات من الويب مهارة أساسية للمطورين، لكن تعلمها قد يكون صعباً. لهذا السبب أنشأت Housefly، مشروع عملي مصمم لتعليم استخراج البيانات من الويب من خلال تمارين تفاعلية. مستوحى من Google Gruyere، يوفر Housefly سلسلة من البرامج التعليمية الصغيرة مع مواقع ويب مرافقة مخصصة مبنية للاستخراج. الهدف؟ توفير بيئة آمنة ومنظمة لممارسة وتحسين مهارات الاستخراج لديك.",
      whyCreated: {
        title: "لماذا صنعت هذا؟",
        content: "رأيت عددًا لا يحصى من البرامج التعليمية التي تشرح استخراج البيانات من الويب نظرياً، لكن القليل جداً منها يوفر بيئات حقيقية ومحكومة للتجربة. يحل Housefly هذا من خلال توفير تحديات مستقلة حيث يمكنك استخراج البيانات من المواقع المقدمة والتحقق من حلولك مقابل المخرجات المتوقعة. إنه مبني للمتعلمين العمليين الذين يريدون العمل بدلاً من القراءة فقط.",
      },
      getStarted: {
        title: "كيفية البدء",
        content: "التعليمات موجودة في ملف README.md في مستودع GitHub. من هناك، يمكنك اتباع الخطوات لإعداد وتشغيل المشروع.",
      },
    },
    nav: {
      home: "الرئيسية",
      posts: "المنشورات",
      howTo: "كيفية العمل",
    },
    howTo: {
      title: "كيفية البدء",
      description: "تعلم كيفية البدء مع Housefly",
      content: {
        heading: "كيفية البدء",
        cloneRepo: {
          title: "استنساخ المستودع",
          description: "استنسخ المستودع باستخدام الأمر التالي:",
        },
        chapter1: {
          title: "الانتقال إلى الفصل 1",
          description: "كل فصل يحتوي على موقع ويب بسيط للاستخراج، مع ملف expected.txt الذي يحدد المخرجات الصحيحة.",
        },
        writeScraper: {
          title: "اكتب مستخرج البيانات الخاص بك",
          description: "قم بتنفيذ حلك في دليل solution[number]/ المقابل.",
        },
      },
    },
    metadata: {
      title: "Housefly - ملعب استخراج البيانات من الويب",
      description: "مشروع تعلم تفاعلي مصمم لتعليم استخراج البيانات من الويب من خلال تحديات منظمة، مع سيناريوهات واقعية وفحص تلقائي للحلول.",
    },
    posts: {
      title: "المنشورات",
    },
  },
  tr: {
    home: {
      heading: "Housefly",
      intro: "Web scraping geliştiriciler için temel bir beceridir, ancak öğrenmesi zor olabilir. Bu yüzden Housefly'ı oluşturdum; etkileşimli alıştırmalar aracılığıyla web scraping öğretmek için tasarlanmış uygulamalı bir proje. Google Gruyere'den ilham alan Housefly, scraping için özel olarak inşa edilmiş yardımcı web siteleri ile birlikte küçük eğitim serileri sunar. Hedef? Scraping becerilerinizi pratik etmek ve geliştirmek için güvenli, yapılandırılmış bir ortam sağlamak.",
      whyCreated: {
        title: "Bunu neden yaptım?",
        content: "Web scraping'i teorik olarak açıklayan sayısız eğitim gördüm, ancak çok azı deney için gerçek, kontrollü ortamlar sunar. Housefly bunu, sağlanan web sitelerini scraplayabileceğiniz ve çözümlerinizi beklenen çıktılara karşı doğrulayabileceğiniz bağımsız zorluklar sunarak çözer. Sadece okumak yerine yapmak isteyen praktik öğreniciler için inşa edilmiştir.",
      },
      getStarted: {
        title: "Nasıl başlanır",
        content: "Talimatlar GitHub deposundaki README.md dosyasında bulunmaktadır. Oradan projeyi kurma ve çalıştırma adımlarını takip edebilirsiniz.",
      },
    },
    nav: {
      home: "Ana sayfa",
      posts: "Gönderiler",
      howTo: "Nasıl yapılır",
    },
    howTo: {
      title: "Nasıl başlanır",
      description: "Housefly ile nasıl başlayacağınızı öğrenin",
      content: {
        heading: "Nasıl başlanır",
        cloneRepo: {
          title: "Depoyu klonlayın",
          description: "Aşağıdaki komutu kullanarak depoyu klonlayın:",
        },
        chapter1: {
          title: "Bölüm 1'e gidin",
          description: "Her bölüm, doğru çıktıyı tanımlayan expected.txt dosyası ile birlikte scraplanacak basit bir web sitesi içerir.",
        },
        writeScraper: {
          title: "Scraper'ınızı yazın",
          description: "Çözümünüzu ilgili solution[number]/ dizininde uygulayın.",
        },
      },
    },
    metadata: {
      title: "Housefly - Web Scraping Oyun Alanı",
      description: "Yapılandırılmış zorluklar, gerçekçi senaryolar ve otomatik çözüm kontrolü ile web scraping öğretmek için tasarlanmış etkileşimli öğrenme projesi.",
    },
    posts: {
      title: "Gönderiler",
    },
  }
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  return dictionaries[locale] || dictionaries.en;
}