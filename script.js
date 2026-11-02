
document.addEventListener("DOMContentLoaded", () => {
  // Мобильное меню
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.textContent = isOpen ? "✕" : "☰";
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  // Появление блоков при прокрутке
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
  });

  // Анимация чисел в статистике
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased) + suffix;

        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
      counterObserver.unobserve(element);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll("[data-count]").forEach(counter => {
    counterObserver.observe(counter);
  });

  // Свечение курсора и 3D-эффект сферы
  const glow = document.querySelector(".cursor-glow");
  const orb = document.querySelector(".orb");
  const hero = document.querySelector(".hero");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", event => {
      glow.style.left = event.clientX + "px";
      glow.style.top = event.clientY + "px";
    }, { passive: true });

    hero.addEventListener("pointermove", event => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      orb.style.transform =
        `rotateY(${x * 25}deg) rotateX(${-y * 25}deg)`;
    });

    hero.addEventListener("pointerleave", () => {
      orb.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  // Небольшая реакция карточек на курсор
  document.querySelectorAll(".project-card").forEach(card => {
    const visual = card.querySelector(".project-visual");

    if (reducedMotion) return;

    card.addEventListener("pointermove", event => {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform =
        `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      visual.style.transform = "";
    });
  });
});
