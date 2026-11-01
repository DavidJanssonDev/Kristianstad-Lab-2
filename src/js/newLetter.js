import { getNewsLetters } from "./storage.js";
const newsList = document.getElementById("news-list");
const newsCount = document.getElementById("news-count");


const all = getNewsLetters().sort((a, b) => b.datetime.localeCompare(a.datetime));

newsCount.textContent =  `${all.length} news letters${all.length === 1 ?  "" : "s"}`;

if (all.length === 0) {
    newsList.textContent = "No News Letters yet"
}

for (const n of all) {
  const card = document.createElement("article");
  card.className = "card card-body p-4 shadow-sm"

  const meta = document.createElement("p");
  meta.className = "text-muted mb-2";
  meta.textContent = `${n.author} · ${n.datetime}`;

  const body = document.createElement("p");
  body.className = "mb-0";
  body.style.whiteSpace = "pre-line"; // keeps line breaks from the textarea
  body.textContent = n.message;

  card.append(meta, body);
  newsList.append(card);
}