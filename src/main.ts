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
    text: 'Стабильный выпуск партий в согласованном формате и объеме с производственной дисциплиной на каждом этапе.'
  },
  {
    title: 'Стикеровка',
    text: 'Ручная и автоматическая стикеровка под требования SKU, каналов продаж и логистики.'
  },
  {
    title: 'Упаковка',
    text: 'Финальная сборка продукции, коробочных решений и наборов в едином технологическом контуре.'
  },
  {
    title: 'Термоусадка',
    text: 'Аккуратная фиксация упаковки для защиты продукции и готовности к транспортировке.'
  },
  {
    title: 'Маркировка "Честный знак"',
    text: 'Встраиваем маркировку в производственный цикл, чтобы партия выходила без операционных задержек.'
  },
  {
    title: 'Хранение',
    text: 'Хранение готовой продукции до отгрузки по согласованному графику и параметрам поставок.'
  },
  {
    title: 'Логистика',
    text: 'Отгрузка по РФ по согласованной схеме, включая распределение партий и календарь поставок.'
  },
  {
    title: 'Подбор и заказ тары',
    text: 'Подбор флаконов, банок, туб и упаковки, включая согласование поставок из Китая.'
  }
];

const formats = ['Флаконы', 'Банки', 'Тубы', 'Стики'];
const categories = ['Тушь', 'Блески', 'Помады', 'Декоративная косметика', 'Шампуни', 'Гели'];

const advantages = [
  'Быстрый запуск производства и вывода партии.',
  'Готовность к крупным объемам и регулярным поставкам.',
  'Конкурентная стоимость при стабильном исполнении.',
  'Опыт работы с крупными действующими заказчиками.',
  'Полный цикл работ от задачи до отгрузки.',
  'Согласование и поставка тары и упаковки под проект.',
  'Выстроенные процессы серийного производства.',
  'Надежная база для долгосрочного масштабирования.'
];

const steps = [
  'Заявка и обсуждение задачи: объем, сроки, требования к выпуску.',
  'Согласование формата продукции и упаковки.',
  'Подбор или заказ тары при необходимости.',
  'Производство, разлив, стикеровка и упаковка.',
  'Маркировка "Честный знак".',
  'Хранение и отгрузка по согласованной схеме.'
];

app.innerHTML = `
  <div class="bg-layer" aria-hidden="true"></div>
  <canvas class="starfield" aria-hidden="true"></canvas>
  <div class="cursor-glow" aria-hidden="true">
    <span class="cursor-glow__core"></span>
    <span class="cursor-glow__halo"></span>
  </div>

  <header class="header">
    <div class="container header__inner">
      <a class="logo" href="#top" aria-label="best. cosmetics">
        <span class="logo__line">best.</span>
        <span class="logo__line">cosmetics</span>
      </a>

      <nav class="nav" aria-label="Навигация по сайту">
        <a href="#about">О компании</a>
        <a href="#services">Услуги</a>
        <a href="#capacity">Мощности</a>
        <a href="#process">Процесс</a>
        <a href="#contacts">Контакты</a>
      </nav>

      <a class="btn btn--ghost btn--compact" href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">
        Telegram
      </a>
    </div>
  </header>

  <main id="top">
    <section class="section hero">
      <div class="container hero__grid">
        <div class="reveal">
          <p class="eyebrow">Московская область, Сергиев Посад • Работаем по всей России</p>
          <h1>Контрактное производство косметики под ключ в России</h1>
          <p class="lead">
            Разлив, упаковка, маркировка и сопровождение выпуска крупных партий для брендов по всей РФ.
          </p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">
              Написать в Telegram
            </a>
            <a class="btn btn--secondary" href="${CONTACTS.phoneHref}">Позвонить</a>
          </div>
          <ul class="facts">
            <li>До 3 000 000 единиц в месяц</li>
            <li>Производство в Московской области</li>
            <li>Разлив, упаковка и "Честный знак"</li>
            <li>Работаем по всей России</li>
          </ul>
        </div>

        <figure class="image-block image-block--hero reveal" style="--delay: 120ms;">
          <figcaption>hero-image / production-preview</figcaption>
        </figure>
      </div>
    </section>

    <section class="section reveal" id="about">
      <div class="container split">
        <div>
          <p class="eyebrow">О компании</p>
          <h2>BestCosmetics — производственный подрядчик для масштабных запусков</h2>
          <p class="copy">
            BestCosmetics — контрактное производство декоративной и уходовой косметики в Московской области.
            Мы ориентированы на крупные партии, стабильный выпуск и прозрачные процессы взаимодействия.
          </p>
          <p class="copy">
            Производственная база в Сергиевом Посаде позволяет поддерживать темп поставок по всей России
            и сопровождать масштабирование бренда на рынке РФ.
          </p>
        </div>

        <article class="note">
          <h3>Сфокусированы на B2B-проектах с большими объемами</h3>
          <p>Работаем как системный производственный партнер: четкие этапы, понятные сроки и прогнозируемый результат.</p>
        </article>
      </div>
    </section>

    <section class="section reveal" id="services">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Услуги</p>
            <h2>Полный набор операций для контрактного производства</h2>
          </div>
          <figure class="image-block image-block--wide">
            <figcaption>services-image</figcaption>
          </figure>
        </div>

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
        <p class="eyebrow">Форматы и категории продукции</p>
        <h2>Работаем с ключевыми форматами фасовки и востребованными категориями</h2>

        <div class="duo">
          <article class="panel">
            <h3>Форматы</h3>
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

        <figure class="image-block image-block--wide image-block--offset">
          <figcaption>packaging-image</figcaption>
        </figure>
      </div>
    </section>

    <section class="section reveal" id="capacity">
      <div class="container capacity">
        <p class="eyebrow">Производственные мощности</p>
        <p class="capacity__value">До 3 000 000 единиц продукции в месяц</p>
        <p class="capacity__text">
          Производственная база BestCosmetics позволяет поддерживать стабильный выпуск крупных партий
          для масштабного присутствия бренда на рынке РФ.
        </p>
      </div>
    </section>

    <section class="section reveal" id="advantages">
      <div class="container">
        <p class="eyebrow">Почему выбирают BestCosmetics</p>
        <h2>Сильная производственная платформа для долгосрочной работы</h2>
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
        <h2>Понятная последовательность от заявки до отгрузки</h2>
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

    <section class="section reveal" id="control">
      <div class="container split">
        <div>
          <p class="eyebrow">Контроль, маркировка и процессы</p>
          <h2>Системный выпуск и прозрачное взаимодействие с заказчиком</h2>
          <p class="copy">
            Производственные процессы выстроены под серийный выпуск крупных партий. Этапы маркировки
            и сопутствующие операции организованы с учетом требований законодательства РФ и требований РПН.
          </p>
          <p class="copy">
            Взаимодействие строится прозрачно: фиксируем задачи, сроки и параметры партии, чтобы заказчик
            получал управляемый и предсказуемый результат.
          </p>
        </div>

        <figure class="image-block image-block--facility">
          <figcaption>facility-image</figcaption>
        </figure>
      </div>
    </section>

    <section class="section section--contacts reveal" id="contacts">
      <div class="container contacts">
        <div>
          <p class="eyebrow">Контакты</p>
          <h2>Обсудим ваш проект</h2>
          <p class="copy">
            Если вам нужен надежный производственный подрядчик для выпуска косметики крупными партиями,
            свяжитесь с нами — обсудим задачу, формат и объемы.
          </p>

          <div class="contacts__actions">
            <a class="btn btn--primary" href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">
              Написать в Telegram
            </a>
            <a class="btn btn--secondary" href="${CONTACTS.phoneHref}">Позвонить</a>
          </div>

          <div class="contacts__list">
            <a href="${CONTACTS.phoneHref}">${CONTACTS.phoneDisplay}</a>
            <a href="mailto:${CONTACTS.email}">${CONTACTS.email}</a>
          </div>
        </div>

        <form class="form" action="#" method="post">
          <label>
            <span>Имя</span>
            <input type="text" name="name" placeholder="Ваше имя" />
          </label>
          <label>
            <span>Телефон / Telegram</span>
            <input type="text" name="contact" placeholder="+7 или @username" />
          </label>
          <label>
            <span>Комментарий</span>
            <textarea name="comment" rows="4" placeholder="Кратко о задаче и планируемых объемах"></textarea>
          </label>
          <button class="btn btn--primary btn--full" type="submit">Отправить</button>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <a class="logo" href="#top" aria-label="best. cosmetics">
        <span class="logo__line">best.</span>
        <span class="logo__line">cosmetics</span>
      </a>

      <p>Контрактное производство косметики: разлив, упаковка, маркировка, логистика.</p>

      <div class="footer__contacts">
        <a href="${CONTACTS.telegramHref}" target="_blank" rel="noopener noreferrer">${CONTACTS.telegramDisplay}</a>
        <a href="${CONTACTS.phoneHref}">${CONTACTS.phoneDisplay}</a>
        <a href="mailto:${CONTACTS.email}">${CONTACTS.email}</a>
      </div>

      <small>© <span id="year"></span> BestCosmetics. Все права защищены.</small>
    </div>
  </footer>
`;

const form = document.querySelector<HTMLFormElement>('.form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}

const year = document.querySelector<HTMLSpanElement>('#year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const header = document.querySelector<HTMLElement>('.header');
window.addEventListener(
  'scroll',
  () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 6);
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

function initStarfield(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('.starfield');
  if (!canvas) {
    return;
  }

  const isDesktopPointer = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isDesktopPointer || reducedMotion) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    canvas.remove();
    return;
  }

  interface Star {
    nx: number;
    ny: number;
    size: number;
    alpha: number;
    twinkleSpeed: number;
    twinklePhase: number;
    driftSpeedX: number;
    driftSpeedY: number;
    depth: number;
    offsetX: number;
    offsetY: number;
  }

  let stars: Star[] = [];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = 1;
  let rafId = 0;
  let lastFrame = performance.now();
  let elapsed = 0;
  let isHidden = document.hidden;

  const pointer = {
    x: width * 0.5,
    y: height * 0.5,
    active: false
  };

  const setCanvasSize = (): void => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const createStars = (): void => {
    const area = width * height;
    const count = Math.max(40, Math.min(80, Math.round(area / 26000)));

    stars = Array.from({ length: count }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      size: 1 + Math.random() * 1.5,
      alpha: 0.12 + Math.random() * 0.2,
      twinkleSpeed: 0.12 + Math.random() * 0.28,
      twinklePhase: Math.random() * Math.PI * 2,
      driftSpeedX: (Math.random() - 0.5) * 0.04,
      driftSpeedY: (Math.random() - 0.5) * 0.04,
      depth: 0.35 + Math.random() * 0.85,
      offsetX: 0,
      offsetY: 0
    }));
  };

  const onPointerMove = (event: PointerEvent): void => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };

  const onPointerLeave = (): void => {
    pointer.active = false;
  };

  const onVisibilityChange = (): void => {
    isHidden = document.hidden;
  };

  const onResize = (): void => {
    setCanvasSize();
    createStars();
  };

  const animate = (now: number): void => {
    const delta = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    elapsed += delta;

    if (!isHidden) {
      ctx.clearRect(0, 0, width, height);

      const radius = 260;
      const maxShift = 5;

      for (const star of stars) {
        const baseX = star.nx * width + Math.sin(elapsed * star.driftSpeedX + star.twinklePhase) * 2.1;
        const baseY = star.ny * height + Math.cos(elapsed * star.driftSpeedY + star.twinklePhase * 0.85) * 2.1;

        let targetOffsetX = 0;
        let targetOffsetY = 0;
        let cursorBoost = 0;

        if (pointer.active) {
          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < radius) {
            const force = Math.pow(1 - distance / radius, 2);
            const displacement = force * maxShift * star.depth;
            const nx = distance > 0 ? dx / distance : 0;
            const ny = distance > 0 ? dy / distance : 0;

            targetOffsetX = nx * displacement;
            targetOffsetY = ny * displacement;
            cursorBoost = force * 0.08;
          }
        }

        star.offsetX += (targetOffsetX - star.offsetX) * 0.08;
        star.offsetY += (targetOffsetY - star.offsetY) * 0.08;

        const twinkle = 0.85 + Math.sin(elapsed * star.twinkleSpeed + star.twinklePhase) * 0.15;
        const alpha = Math.min(0.35, star.alpha * twinkle + cursorBoost);

        ctx.beginPath();
        ctx.fillStyle = `rgba(240, 242, 245, ${alpha.toFixed(3)})`;
        ctx.arc(baseX + star.offsetX, baseY + star.offsetY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    rafId = window.requestAnimationFrame(animate);
  };

  setCanvasSize();
  createStars();

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

  rafId = window.requestAnimationFrame((time) => {
    lastFrame = time;
    animate(time);
  });

  window.addEventListener('beforeunload', () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });
}

initStarfield();

function initCursorGlow(): void {
  const glow = document.querySelector<HTMLElement>('.cursor-glow');
  if (!glow) {
    return;
  }

  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isDesktopPointer || reducedMotion) {
    glow.remove();
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
    current.x += (target.x - current.x) * 0.09;
    current.y += (target.y - current.y) * 0.09;
    current.opacity += (target.opacity - current.opacity) * 0.08;

    glow.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    glow.style.opacity = current.opacity.toFixed(3);

    rafId = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent): void => {
    target.x = event.clientX;
    target.y = event.clientY;
    target.opacity = 0.9;
  };

  const onPointerEnter = (): void => {
    target.opacity = 0.9;
  };

  const onPointerLeave = (): void => {
    target.opacity = 0;
  };

  const onBlur = (): void => {
    target.opacity = 0;
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerenter', onPointerEnter, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onBlur, { passive: true });

  rafId = window.requestAnimationFrame(tick);

  window.addEventListener('beforeunload', () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerenter', onPointerEnter);
    window.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', onBlur);
  });
}

initCursorGlow();
