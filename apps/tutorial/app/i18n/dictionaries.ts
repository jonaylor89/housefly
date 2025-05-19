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
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  return dictionaries[locale] || dictionaries.en;
}