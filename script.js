let suma = 0;
let premia = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="celowanie"]').forEach(radio => {
    radio.addEventListener("change", () => {
      document.getElementById("lokalizacja-div").style.display =
        document.querySelector('input[name="celowanie"]:checked').value === "tak"
          ? "block" : "none";
    });
  });
});

function obsluzKrytyczne10() {
  let bonus = 0;
  let opis = "";
  let runda = 1;
  let rzut = 10;

  while (rzut === 10) {
    const kolejny = Math.floor(Math.random() * 10) + 1;
    const wynik = kolejny - 5;

    if (wynik <= 0) {
      bonus += 1;
      opis += `🔁 Runda ${runda}: 10 → ${kolejny} – 5 = ${wynik} → +1\n`;
      break;
    } else {
      bonus += wynik;
      opis += `🔁 Runda ${runda}: 10 → ${kolejny} – 5 = ${wynik} → +${wynik}\n`;
      rzut = kolejny;
      runda++;
    }
  }

  return { bonus, opis };
}

function losujRzut() {
  const celowanie = document.querySelector('input[name="celowanie"]:checked').value;
  const lokalizacja = document.getElementById("lokalizacja")?.value;
  const modCechy = parseInt(document.getElementById("mod_cechy").value) || 0;
  const modMG = parseInt(document.getElementById("mod_mg").value) || 0;
  const numerAtaku = parseInt(document.getElementById("atak").value) || 1;

  const modAtaku = -(Math.max(numerAtaku - 1, 0) * 2);
  let modCelowanie = 0;

  if (celowanie === "tak") {
    switch (lokalizacja) {
      case "glowa": modCelowanie = -5; break;
      case "nogi":
      case "rece": modCelowanie = -2; break;
      case "tors": modCelowanie = -1; break;
    }
  }

  let rzut = Math.floor(Math.random() * 10) + 1;
  let bonusKrytyczny = 0;
  let infoKrytyk = "";

  // Obsługa trafienia krytycznego 10
  if (rzut === 10) {
    const kryt = obsluzKrytyczne10();
    bonusKrytyczny = kryt.bonus;
    infoKrytyk = kryt.opis.trim();
  }

  // Obsługa porażki krytycznej 1
  else if (rzut === 1) {
    const rzutDodatkowy = Math.floor(Math.random() * 10) + 1;
    const wynik = rzutDodatkowy - 5;

    if (wynik < 0) {
      rzut += wynik; // Dodajemy wartość ujemną → rzut spada
      infoKrytyk = `💀 Krytyczna porażka: ${rzutDodatkowy} – 5 = ${wynik} → zmniejszono rzut o ${Math.abs(wynik)}`;
    } else {
      rzut += -1;
      infoKrytyk = `💀 Krytyczna porażka: ${rzutDodatkowy} – 5 = ${wynik} → dodano –1 do wyniku`;
    }
  }

  let losowaLokalizacja = "";
  if (celowanie === "nie") {
    switch (Math.min(rzut, 10)) {
      case 1: losowaLokalizacja = "🧠 Głowa"; break;
      case 2: losowaLokalizacja = "🤚 Prawa ręka"; break;
      case 3: losowaLokalizacja = "✋ Lewa ręka"; break;
      case 4: case 5: case 6: losowaLokalizacja = "🛡️ Tors"; break;
      case 7: case 8: losowaLokalizacja = "🦵 Prawa noga"; break;
      case 9: case 10: losowaLokalizacja = "🦿 Lewa noga"; break;
    }
  }

  suma = rzut + bonusKrytyczny + modAtaku + modCelowanie + modCechy + modMG;

  if (suma >= 15 && suma <= 16) premia = 1;
  else if (suma >= 17 && suma <= 19) premia = 2;
  else if (suma >= 21 && suma <= 23) premia = 3;
  else if (suma >= 24) premia = 3 + (suma - 23);
  else premia = 0;

  const utrataWytrzymalosci = Math.floor(Math.random() * 4) + 1;

  let wynik = `🎲 Rzut trafienia: ${rzut}
${infoKrytyk ? infoKrytyk + "\n" : ""}
📉 Modyfikator ataku #${numerAtaku}: ${modAtaku}
🎯 ${celowanie === "tak" ? `Celowanie w ${lokalizacja} (${modCelowanie})` : "Brak celowania"}
📊 Modyfikator cech: ${modCechy}
🎭 Modyfikator MG: ${modMG}
🔮 Suma końcowa: ${suma}`;

  if (celowanie === "nie") {
    wynik += `\n📍 Trafiono w: ${losowaLokalizacja}`;
  }

  if (suma >= 9) {
    wynik += `\n✅ Sukces! Można wykonać obrażenia.`;
    document.getElementById("obrazenia-div").style.display = "block";
    document.getElementById("wynik-obrazen").textContent = "";
  } else {
    wynik += `\n❌ Porażka. Atak chybiony.`;
    document.getElementById("obrazenia-div").style.display = "none";
    document.getElementById("wynik-obrazen").textContent = "";
  }

  wynik += `\n❤️ Utrata wytrzymałości: ${utrataWytrzymalosci}`;
  document.getElementById("wynik").textContent = wynik;
}

function liczObrazenia() {
  const sila = parseInt(document.getElementById("sila").value) || 0;
  const modObrazen = parseInt(document.getElementById("mod_obrazen").value) || 0;
  const kosc = parseInt(document.getElementById("kosc").value) || 6;

  const rzutObrazen = Math.floor(Math.random() * kosc) + 1;
  const bazowa = rzutObrazen + premia;
  const mnoznik = sila + modObrazen;
  const obrazenia = bazowa * mnoznik;

  document.getElementById("wynik-obrazen").textContent =
    `🎲 Rzut kością: ${rzutObrazen}
🎁 Premia za trafienie: ${premia}
🧪 Obrażenia: (${rzutObrazen} + ${premia}) × (${sila} + ${modObrazen}) = ${obrazenia}
💥 Obrażenia końcowe: ${obrazenia}`;
}
