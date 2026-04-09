import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Root container #app not found');
}

const CONTACTS = {
  phoneDisplay: '+7 (495) 000-00-00',
  phoneHref: 'tel:+74950000000',
  telegramDisplay: '@bestcosmetics_rf',
  telegramHref: 'https://t.me/bestcosmetics_rf',
  email: 'info@bestcosmetics.ru'
};

const services = [
  {
    title: 'Разлив продукции',
    text: 'Фасуем косметические составы в нужный формат с контролем стабильности выпуска и производственной дисциплины.'
  },
  {
    title: 'Стикеровка',
    text: 'Ручная и автоматическая стикеровка под требования партии, SKU и конкретных каналов продаж.'
  },
  {
    title: 'Упаковка',
    text: 'Собираем финальную единицу продукции, наборы и коробочные решения в едином производственном потоке.'
  },
  {
    title: 'Термоусадка',
    text: 'Обеспечиваем аккуратную фиксацию упаковки, защиту продукта и готовность к транспортировке.'
  },
  {
    title: 'Маркировка "Честный знак"',
    text: 'Интегрируем маркировку в производственный цикл, чтобы отгрузка шла без операционных задержек.'
  },
  {
    title: 'Хранение готовой продукции',
    text: 'Организуем хранение партий до момента отгрузки согласно согласованному графику поставок.'
  },
  {
    title: 'Логистика по согласованию',
    text: 'Подстраиваем схему отгрузки под задачи заказчика: распределение, график и приоритеты поставок по РФ.'
  },
  {
    title: 'Подбор и заказ тары',
    text: 'Подбираем флаконы, банки, тубы и упаковку, включая согласование и поставки из Китая.'
  }
];

const formats = ['Флаконы', 'Банки', 'Тубы', 'Стики'];
const categories = ['Тушь', 'Блески', 'Помады', 'Декоративная косметика', 'Шампуни', 'Гели'];

const advantages = [
  'Высокая скорость запуска и вывода партии в производство.',
  'Операционная готовность к крупным объемам и регулярным поставкам.',
  'Конкурентная стоимость без потери производственного качества.',
  'Практический опыт работы с крупными действующими заказчиками.',
  'Полный цикл: от согласования тары до отгрузки готовой партии.',
  'Организация закупки и поставки упаковки под требования проекта.',
  'Стабильные процессы, выстроенные под серийный выпуск.',
  'Надежный подрядчик для долгосрочного масштабирования бренда.'
];

const steps = [
  'Заявка и предметное обсуждение задачи: объем, сроки, требования к выпуску.',
  'Согласование формата продукта, упаковки и производственного маршрута.',
  'При необходимости подбор и заказ тары, включая координацию поставок.',
  'Производство, разлив, стикеровка и упаковка в едином цикле.',
  'Маркировка "Честный знак" и финальная подготовка партии к отгрузке.',
  'Хранение, комплектование и отгрузка по согласованной логистической схеме.'
];

app.innerHTML = `
  <div class="page-glow"></div>
  <div class="cursor-light" aria-hidden="true">
    <span class="cursor-light__core"></span>
    <span class="cursor-light__halo"></span>
  </div>
  <header class="topbar">
    <div class="container topbar__inner">
      <a class="brand" href="#top" aria-label="BestCosmetics">
        <span class="brand__mark">BC</span>
        <span class="brand__text">
          <strong>BestCosmetics</strong>
          <small>Контрактное производство косметики</small>
        </span>
      </a>
      <nav class="topbar__nav" aria-label="Навигация по сайту">
        <a href="#about">О компании</a>
        <a href="#services">Услуги</a>
        <a href="#capacity">Мощности</a>
        <a href="#process">Процесс</a>
        <a href="#contacts">Контакты</a>
      </nav>
      <a class="btn btn--ghost btn--compact" href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">Telegram</a>
    </div>
  </header>

  <main id="top">
    <section class="hero section">
      <div class="container hero__grid">
        <div class="hero__content reveal">
          <p class="eyebrow">Сергиев Посад, Московская область • Работаем по всей РФ</p>
          <h1>Контрактное производство косметики в России для крупных партий</h1>
          <p class="hero__lead">
            BestCosmetics обеспечивает выпуск декоративной и уходовой косметики под ключ:
            разлив, упаковка, термоусадка, маркировка "Честный знак" и отгрузка в согласованные сроки.
          </p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>
            <a class="btn btn--secondary" href="${CONTACTS.phoneHref}">Позвонить</a>
          </div>
          <ul class="hero__highlights">
            <li>До 3 000 000 единиц в месяц</li>
            <li>Контрактное производство под ключ</li>
            <li>Разлив, упаковка и "Честный знак"</li>
            <li>Поставки по всей России</li>
          </ul>
        </div>
        <aside class="hero__media reveal" style="--delay: 120ms;">
          <article class="media-card media-card--large">
            <p>Производственная зона</p>
            <span>Место для фото линии розлива</span>
          </article>
          <article class="media-card">
            <p>Упаковка и маркировка</p>
            <span>Место для фото финальной комплектации</span>
          </article>
          <article class="metric">
            <strong>3 000 000</strong>
            <span>единиц продукции в месяц</span>
          </article>
        </aside>
      </div>
    </section>

    <section class="section reveal" id="about">
      <div class="container split">
        <div>
          <p class="eyebrow">О компании</p>
          <h2>BestCosmetics — производственная база для брендов, которым нужен масштаб</h2>
          <p class="section-copy">
            Мы выпускаем декоративную и уходовую косметику на площадке в Сергиевом Посаде.
            Фокус компании — крупные партии, стабильный темп производства и контроль качества на каждом этапе.
          </p>
          <p class="section-copy">
            Работаем по всей РФ и строим процесс так, чтобы заказчик получал предсказуемый результат:
            от согласования упаковки до готовой партии на отгрузку.
          </p>
        </div>
        <div class="about__notes">
          <article class="note-card">
            <h3>Производственная дисциплина</h3>
            <p>Выстроенные процессы без хаотичных ручных операций в критических точках.</p>
          </article>
          <article class="note-card">
            <h3>Ориентация на объем</h3>
            <p>Инфраструктура и команды адаптированы под серийные, а не тестовые, запуски.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section reveal" id="services">
      <div class="container">
        <p class="eyebrow">Услуги</p>
        <h2>Полный набор операций для контрактного производства</h2>
        <div class="cards">
          ${services
            .map(
              (item) => `
                <article class="card">
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section reveal" id="formats">
      <div class="container">
        <p class="eyebrow">Форматы и категории</p>
        <h2>Работаем с ключевыми типами упаковки и востребованными категориями косметики</h2>
        <div class="duo">
          <article class="panel">
            <h3>Форматы фасовки</h3>
            <div class="chips">
              ${formats.map((item) => `<span class="chip">${item}</span>`).join('')}
            </div>
          </article>
          <article class="panel">
            <h3>Категории продукции</h3>
            <div class="chips">
              ${categories.map((item) => `<span class="chip">${item}</span>`).join('')}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section reveal" id="capacity">
      <div class="container capacity">
        <p class="eyebrow">Производственные мощности</p>
        <p class="capacity__value">До 3 000 000</p>
        <p class="capacity__subtitle">единиц продукции в месяц</p>
        <p class="capacity__text">
          Поддерживаем выпуск крупных партий для масштабного присутствия бренда на рынке РФ
          и стабильного выполнения контрактных обязательств.
        </p>
      </div>
    </section>

    <section class="section reveal" id="advantages">
      <div class="container">
        <p class="eyebrow">Почему выбирают BestCosmetics</p>
        <h2>Сильный подрядчик для системной и долгосрочной работы</h2>
        <div class="advantages">
          ${advantages
            .map(
              (item) => `
                <article class="advantage">
                  <span class="advantage__line"></span>
                  <p>${item}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section reveal" id="process">
      <div class="container">
        <p class="eyebrow">Как строится работа</p>
        <h2>Прозрачный производственный цикл от заявки до отгрузки</h2>
        <ol class="steps">
          ${steps
            .map(
              (item, index) => `
                <li class="step">
                  <span class="step__index">${index + 1}</span>
                  <p>${item}</p>
                </li>
              `
            )
            .join('')}
        </ol>
      </div>
    </section>

    <section class="section reveal" id="trust">
      <div class="container trust">
        <p class="eyebrow">Доверие, качество, маркировка</p>
        <h2>Операционная и документальная часть выстроена под требования российского рынка</h2>
        <div class="trust__grid">
          <article class="trust-card">
            <h3>Требования РФ и РПН</h3>
            <p>
              Работаем в соответствии с требованиями законодательства РФ и требованиями Роспотребнадзора
              в части маркировки и сопутствующих производственных процессов.
            </p>
          </article>
          <article class="trust-card">
            <h3>Контроль качества</h3>
            <p>
              Поддерживаем контроль ключевых этапов производства, чтобы партия соответствовала
              согласованным стандартам и срокам.
            </p>
          </article>
          <article class="trust-card">
            <h3>Прозрачное взаимодействие</h3>
            <p>
              Заказчик получает понятную коммуникацию по этапам, объемам и готовности партии к отгрузке.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--contacts reveal" id="contacts">
      <div class="container contacts">
        <div>
          <p class="eyebrow">Контакты</p>
          <h2>Обсудим задачу и подготовим запуск партии под ваш объем</h2>
          <p class="section-copy">
            Если вам нужен надежный производственный партнер для масштабных запусков косметики по РФ,
            свяжитесь с нами удобным способом.
          </p>
        </div>
        <div class="contacts__panel">
          <a class="btn btn--primary btn--full" href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">
            Написать в Telegram
          </a>
          <a class="btn btn--secondary btn--full" href="${CONTACTS.phoneHref}">
            Позвонить: ${CONTACTS.phoneDisplay}
          </a>
          <a class="contact-link" href="mailto:${CONTACTS.email}">
            ${CONTACTS.email}
          </a>
          <p class="contacts__hint">Основной канал для старта диалога: Telegram и телефон.</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <div>
        <strong>BestCosmetics</strong>
        <p>Контрактное производство косметики: разлив, упаковка, маркировка, логистика.</p>
      </div>
      <div class="footer__contacts">
        <a href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">${CONTACTS.telegramDisplay}</a>
        <a href="${CONTACTS.phoneHref}">${CONTACTS.phoneDisplay}</a>
        <a href="mailto:${CONTACTS.email}">${CONTACTS.email}</a>
      </div>
      <small>© <span id="year"></span> BestCosmetics. Все права защищены.</small>
    </div>
  </footer>
`;

function initCursorLight(): void {
  const cursorLight = document.querySelector<HTMLElement>('.cursor-light');
  if (!cursorLight) {
    return;
  }

  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsFinePointer || reducedMotion) {
    cursorLight.remove();
    return;
  }

  const target = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.35,
    opacity: 0
  };

  const current = {
    x: target.x,
    y: target.y,
    opacity: 0
  };

  let rafId = 0;

  const tick = (): void => {
    current.x += (target.x - current.x) * 0.085;
    current.y += (target.y - current.y) * 0.085;
    current.opacity += (target.opacity - current.opacity) * 0.075;

    cursorLight.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    cursorLight.style.opacity = current.opacity.toFixed(3);

    rafId = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent): void => {
    target.x = event.clientX;
    target.y = event.clientY;
    target.opacity = 1;
  };

  const onPointerEnter = (): void => {
    target.opacity = 1;
  };

  const onPointerLeave = (): void => {
    target.opacity = 0;
  };

  const onWindowBlur = (): void => {
    target.opacity = 0;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerenter', onPointerEnter, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onWindowBlur, { passive: true });

  rafId = window.requestAnimationFrame(tick);

  window.addEventListener('beforeunload', () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerenter', onPointerEnter);
    window.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', onWindowBlur);
  });
}

initCursorLight();

const year = document.querySelector<HTMLSpanElement>('#year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const topbar = document.querySelector<HTMLElement>('.topbar');
window.addEventListener(
  'scroll',
  () => {
    topbar?.classList.toggle('is-scrolled', window.scrollY > 8);
  },
  { passive: true }
);

const revealElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        (entry.target as HTMLElement).classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}
