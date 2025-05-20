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
  }
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  return dictionaries[locale] || dictionaries.en;
}