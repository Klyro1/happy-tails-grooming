// Happy Tails Grooming — small interactions
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Header shadow on scroll
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal sections on scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // Opening hours: highlight today and show open/closed (Denver time)
  const HOURS = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 19], 5: [9, 19], 6: [8, 16] };
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver", weekday: "short", hour: "numeric", minute: "numeric", hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const time = (parseInt(get("hour"), 10) % 24) + parseInt(get("minute"), 10) / 60;

  const todayRow = document.querySelector(`.hours tr[data-day="${day}"]`);
  if (todayRow) todayRow.classList.add("today");

  const status = document.getElementById("open-status");
  const range = HOURS[day];
  const isOpen = range && time >= range[0] && time < range[1];
  status.textContent = isOpen ? "Open now" : "Closed now";
  status.classList.add(isOpen ? "open" : "closed");

  // Booking form (demo only: no data is sent anywhere)
  const form = document.getElementById("booking-form");
  const msg = document.getElementById("form-msg");
  const dateInput = form.elements.date;
  dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const ok = field.value.trim() !== "";
      field.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    msg.className = "form-msg";
    if (!valid) {
      msg.textContent = "Please fill in all fields.";
      msg.classList.add("error");
      return;
    }

    if (new Date(dateInput.value + "T12:00").getDay() === 0) {
      dateInput.classList.add("invalid");
      msg.textContent = "Sorry, we're closed on Sundays. Please pick another day.";
      msg.classList.add("error");
      return;
    }

    const dog = form.elements.dog.value.trim();
    msg.textContent = `Thanks! We'll call you soon to confirm ${dog}'s appointment. 🐾`;
    msg.classList.add("success");
    form.reset();
  });

  form.querySelectorAll("input").forEach((field) =>
    field.addEventListener("input", () => field.classList.remove("invalid"))
  );

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
});
