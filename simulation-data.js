'use strict';

window.simulationConfigs = {
    "grundlagen.html": {
      title: "Grundlagen-Mix",
      intro: "Übe einfache Zahlen, Prozentwerte und Rechenschritte mit kleinen Zahlen.",
      controls: [
        ["Zahl a", 1, 30, 1, 12],
        ["Zahl b", 1, 30, 1, 4],
        ["Prozent", 0, 100, 5, 25],
      ],
      calc: ([a, b, p]) => `a + b = ${a + b}<br>a - b = ${a - b}<br>${p}% von ${a} = ${(a * p / 100).toFixed(2)}`,
    },
    "algebra.html": {
      title: "Gleichungssimulator",
      intro: "Verändere die Werte und sieh, welche Lösung die Gleichung ax + b = c hat.",
      controls: [
        ["a", 1, 9, 1, 3],
        ["b", -20, 20, 1, 5],
        ["c", -20, 40, 1, 20],
      ],
      calc: ([a, b, c]) => `Gleichung: ${a}x + ${b} = ${c}<br>Lösung: x = ${((c - b) / a).toFixed(2)}`,
    },
    "algebra-gleichungen.html": {
      title: "Gleichung umformen",
      intro: "Die Simulation zeigt die drei Schritte zum Lösen einer linearen Gleichung.",
      controls: [
        ["a", 1, 9, 1, 3],
        ["b", -15, 15, 1, 5],
        ["c", -15, 30, 1, 20],
      ],
      calc: ([a, b, c]) => `${a}x + ${b} = ${c}<br>${a}x = ${c - b}<br>x = ${((c - b) / a).toFixed(2)}`,
    },
    "algebra-terme.html": {
      title: "Terme zusammenfassen",
      intro: "Gleichartige Terme mit x werden addiert.",
      controls: [
        ["erster x-Faktor", -10, 10, 1, 2],
        ["zweiter x-Faktor", -10, 10, 1, 3],
        ["konstante Zahl", -20, 20, 1, -4],
      ],
      calc: ([a, b, c]) => `${a}x + ${b}x + ${c} = ${a + b}x + ${c}`,
    },
    "algebra-potenzen.html": {
      title: "Potenzrechner",
      intro: "Verändere Basis und Exponent.",
      controls: [
        ["Basis", 1, 12, 1, 2],
        ["Exponent", 0, 8, 1, 4],
      ],
      calc: ([base, exp]) => `${base}^${exp} = ${base ** exp}`,
    },
    "algebra-variablen.html": {
      title: "Variable einsetzen",
      intro: "Setze einen Wert für x ein und beobachte, wie aus einem Term eine Zahl wird.",
      controls: [
        ["a", -8, 8, 1, 3],
        ["b", -20, 20, 1, 2],
        ["x", -10, 10, 1, 5],
      ],
      calc: ([a, b, x]) => `${a}x + ${b}<br>${a} * ${x} + ${b} = ${a * x + b}`,
    },
    "algebra-pq-formel.html": {
      title: "pq-Formel",
      intro: "Die Werte p und q bestimmen, ob x^2 + px + q = 0 zwei, eine oder keine reelle Lösung hat.",
      controls: [
        ["p", -10, 10, 1, -5],
        ["q", -20, 20, 1, 6],
      ],
      calc: ([p, q]) => {
        const d = (p / 2) ** 2 - q;
        if (d < 0) return `D = ${d.toFixed(2)}<br>Keine reelle Lösung`;
        const r = Math.sqrt(d);
        return `D = ${d.toFixed(2)}<br>x1 = ${(-p / 2 + r).toFixed(2)}<br>x2 = ${(-p / 2 - r).toFixed(2)}`;
      },
    },
    "algebra-mitternachtsformel.html": {
      title: "Mitternachtsformel",
      intro: "Die abc-Formel löst ax^2 + bx + c = 0 auch dann, wenn vor x^2 nicht 1 steht.",
      controls: [
        ["a", -5, 5, 1, 1],
        ["b", -12, 12, 1, -3],
        ["c", -20, 20, 1, 2],
      ],
      calc: ([a, b, c]) => {
        const safeA = a === 0 ? 1 : a;
        const d = b ** 2 - 4 * safeA * c;
        if (d < 0) return `a = ${safeA}<br>D = ${d.toFixed(2)}<br>Keine reelle Lösung`;
        const r = Math.sqrt(d);
        return `a = ${safeA}<br>D = ${d.toFixed(2)}<br>x1 = ${((-b + r) / (2 * safeA)).toFixed(2)}<br>x2 = ${((-b - r) / (2 * safeA)).toFixed(2)}`;
      },
    },
    "algebra-gleichungssysteme.html": {
      title: "Gleichungssystem",
      intro: "Zwei Geraden schneiden sich in der Lösung des Gleichungssystems.",
      controls: [
        ["m1", -4, 4, 0.5, 1],
        ["b1", -8, 8, 1, 2],
        ["m2", -4, 4, 0.5, -1],
        ["b2", -8, 8, 1, 6],
      ],
      calc: ([m1, b1, m2, b2]) => {
        if (m1 === m2) return "Gleiche Steigung: kein einzelner Schnittpunkt";
        const x = (b2 - b1) / (m1 - m2);
        const y = m1 * x + b1;
        return `x = ${x.toFixed(2)}<br>y = ${y.toFixed(2)}`;
      },
    },
    "grundlagen-brueche.html": {
      title: "Bruchwert",
      intro: "Zähler geteilt durch Nenner ergibt den Dezimalwert eines Bruchs.",
      controls: [
        ["Zähler", 0, 20, 1, 3],
        ["Nenner", 1, 20, 1, 4],
      ],
      calc: ([a, b]) => `${a}/${b} = ${(a / b).toFixed(3)}`,
    },
    "grundlagen-prozent.html": {
      title: "Prozentwert",
      intro: "Der Prozentwert ist der Anteil am Grundwert.",
      controls: [
        ["Grundwert G", 1, 500, 10, 200],
        ["Prozentsatz p", 0, 100, 5, 25],
      ],
      calc: ([g, p]) => `W = ${g} * ${p}/100 = ${(g * p / 100).toFixed(2)}`,
    },
    "grundlagen-negative-zahlen.html": {
      title: "Vorzeichenrechnung",
      intro: "Beim Multiplizieren entscheidet die Kombination der Vorzeichen über plus oder minus.",
      controls: [
        ["a", -12, 12, 1, -4],
        ["b", -12, 12, 1, 3],
      ],
      calc: ([a, b]) => `${a} * ${b} = ${a * b}<br>|${a}| = ${Math.abs(a)}`,
    },
    "grundlagen-dreisatz.html": {
      title: "Direkter Dreisatz",
      intro: "Erst auf eine Einheit rechnen, dann auf die gesuchte Menge.",
      controls: [
        ["Menge", 1, 20, 1, 4],
        ["Wert", 1, 100, 1, 12],
        ["Zielmenge", 1, 50, 1, 10],
      ],
      calc: ([amount, value, target]) => `1 Einheit = ${(value / amount).toFixed(2)}<br>${target} Einheiten = ${(value / amount * target).toFixed(2)}`,
    },
    "funktionen.html": {
      title: "Lineare Funktion",
      intro: "Steigung und y-Achsenabschnitt bestimmen die Gerade.",
      controls: [
        ["m", -5, 5, 0.5, 2],
        ["b", -10, 10, 1, 1],
        ["x", -10, 10, 1, 3],
      ],
      calc: ([m, b, x]) => `f(x) = ${m}x + ${b}<br>f(${x}) = ${(m * x + b).toFixed(2)}`,
    },
    "funktionen-lineare.html": {
      title: "Steigungsdreieck",
      intro: "Die Steigung ist Änderung in y geteilt durch Änderung in x.",
      controls: [
        ["Delta x", 1, 10, 1, 4],
        ["Delta y", -10, 10, 1, 6],
      ],
      calc: ([dx, dy]) => `m = Delta y / Delta x = ${dy} / ${dx} = ${(dy / dx).toFixed(2)}`,
    },
    "funktionen-quadratische.html": {
      title: "Parabel in Normalform",
      intro: "Verändere a, b und c in f(x) = ax^2 + bx + c.",
      controls: [
        ["a", -3, 3, 0.5, 1],
        ["b", -8, 8, 1, -4],
        ["c", -6, 6, 1, 1],
      ],
      calc: ([a, b, c]) => {
        if (a === 0) return `f(x) = ${b}x + ${c}<br>a = 0: Das ist keine Parabel, sondern eine lineare Funktion.<br>y-Achsenabschnitt: (0 | ${c})`;
        const xs = -b / (2 * a);
        const ys = a * xs ** 2 + b * xs + c;
        return `f(x) = ${a}x^2 + ${b}x + ${c}<br>y-Achsenabschnitt: (0 | ${c})<br>Symmetrieachse: x = ${xs.toFixed(2)}<br>Scheitelpunkt: S(${xs.toFixed(2)} | ${ys.toFixed(2)})`;
      },
    },
    "funktionen-exponentiell.html": {
      title: "Exponentielles Wachstum",
      intro: "Startwert und Faktor bestimmen, ob der Graph wächst oder fällt.",
      controls: [
        ["Startwert a", 0.5, 8, 0.5, 2],
        ["Faktor q", 0.2, 2.5, 0.1, 1.3],
        ["x", 0, 10, 1, 4],
      ],
      calc: ([a, q, x]) => `f(x) = ${a} * ${q}^x<br>f(${x}) = ${(a * q ** x).toFixed(2)}`,
    },
    "geometrie.html": {
      title: "Pythagoras-Simulation",
      intro: "Aus zwei Katheten wird die Hypotenuse berechnet.",
      controls: [
        ["a", 1, 20, 1, 3],
        ["b", 1, 20, 1, 4],
      ],
      calc: ([a, b]) => `c = Wurzel(${a}^2 + ${b}^2) = ${Math.hypot(a, b).toFixed(2)}`,
    },
    "geometrie-pythagoras.html": {
      title: "Rechtwinkliges Dreieck",
      intro: "Ändere die Katheten und beobachte die Hypotenuse.",
      controls: [
        ["Kathete a", 1, 20, 1, 5],
        ["Kathete b", 1, 20, 1, 12],
      ],
      calc: ([a, b]) => `a^2 + b^2 = ${a * a + b * b}<br>c = ${Math.hypot(a, b).toFixed(2)}`,
    },
    "geometrie-kreis.html": {
      title: "Kreisrechner",
      intro: "Radius verändern und Umfang sowie Fläche vergleichen.",
      controls: [["Radius", 1, 30, 1, 8]],
      calc: ([r]) => `Umfang: ${(2 * Math.PI * r).toFixed(2)}<br>Fläche: ${(Math.PI * r * r).toFixed(2)}`,
    },
    "geometrie-koerper.html": {
      title: "Körperrechner",
      intro: "Vergleiche Volumen und Oberfläche einfacher Körper.",
      controls: [
        ["Kantenlänge a", 1, 12, 1, 4],
        ["Höhe h", 1, 20, 1, 8],
      ],
      calc: ([a, h]) => `Würfel: V = ${a ** 3}, O = ${6 * a ** 2}<br>Prisma mit G = ${a ** 2}: V = ${a ** 2 * h}<br>Pyramide mit G = ${a ** 2}: V = ${(a ** 2 * h / 3).toFixed(2)}`,
    },
    "trigonometrie.html": {
      title: "Dreieck-Sinus",
      intro: "Bei fester Hypotenuse verändert der Winkel die Gegenkathete.",
      controls: [
        ["Winkel", 0, 90, 1, 30],
        ["Hypotenuse", 1, 20, 1, 10],
      ],
      calc: ([deg, hyp]) => `Gegenkathete = ${hyp} * sin(${deg} deg) = ${(hyp * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`,
    },
    "trigonometrie-einheitskreis.html": {
      title: "Einheitskreis",
      intro: "Sinus und Kosinus sind die Koordinaten eines Punktes auf dem Einheitskreis.",
      controls: [["Winkel", 0, 360, 5, 45]],
      calc: ([deg]) => {
        const rad = (deg * Math.PI) / 180;
        return `sin(${deg} deg) = ${Math.sin(rad).toFixed(3)}<br>cos(${deg} deg) = ${Math.cos(rad).toFixed(3)}<br>Bogenmaß = ${rad.toFixed(3)}`;
      },
    },
    "trigonometrie-dreieck.html": {
      title: "Seitenverhaeltnisse",
      intro: "Ändere den Winkel und berechne sin, cos und tan.",
      controls: [["Winkel", 1, 89, 1, 35]],
      calc: ([deg]) => {
        const rad = (deg * Math.PI) / 180;
        return `sin = ${Math.sin(rad).toFixed(3)}<br>cos = ${Math.cos(rad).toFixed(3)}<br>tan = ${Math.tan(rad).toFixed(3)}`;
      },
    },
    "trigonometrie-graphen.html": {
      title: "Sinusparameter",
      intro: "Amplitude und Periode verändern den Sinusgraphen.",
      controls: [
        ["Amplitude a", 0.5, 5, 0.5, 2],
        ["Faktor b", 0.5, 4, 0.5, 1],
      ],
      calc: ([a, b]) => `f(x) = ${a} * sin(${b}x)<br>Amplitude: ${a}<br>Periode: ${(2 * Math.PI / b).toFixed(2)}`,
    },
    "analysis.html": {
      title: "Steigung an einer Stelle",
      intro: "Bei f(x)=x^2 ist die Ableitung f'(x)=2x.",
      controls: [["x", -6, 6, 0.5, 2]],
      calc: ([x]) => `f(${x}) = ${(x * x).toFixed(2)}<br>f'(${x}) = ${(2 * x).toFixed(2)}`,
    },
    "analysis-ableitung.html": {
      title: "Ableitung von x² - 1",
      intro: "Die Ableitung zeigt die Tangentensteigung an einer Stelle.",
      controls: [["x", -6, 6, 0.5, 1]],
      calc: ([x]) => `f(${x}) = ${(x * x - 1).toFixed(2)}<br>f'(${x}) = ${(2 * x).toFixed(2)}`,
    },
    "analysis-kurvendiskussion.html": {
      title: "Extrempunkt einer Parabel",
      intro: "Bei f(x)=a(x-d)^2+e liegt der Extrempunkt bei S(d|e).",
      controls: [
        ["a", -3, 3, 0.5, 1],
        ["d", -5, 5, 1, 1],
        ["e", -5, 5, 1, -2],
      ],
      calc: ([a, d, e]) => `${a > 0 ? "Tiefpunkt" : "Hochpunkt"} bei S(${d} | ${e})`,
    },
    "analysis-integral.html": {
      title: "Fläche unter f(x)=x^2",
      intro: "Das Integral von 0 bis b wächst mit b^3/3.",
      controls: [["obere Grenze b", 0, 10, 0.5, 3]],
      calc: ([b]) => `Integral von 0 bis ${b}: ${(b ** 3 / 3).toFixed(2)}`,
    },
    "stochastik.html": {
      title: "Laplace-Wahrscheinlichkeit",
      intro: "Bei gleich wahrscheinlichen Ergebnissen ist Wahrscheinlichkeit der Anteil der passenden Ergebnisse.",
      controls: [
        ["günstige", 1, 20, 1, 2],
        ["mögliche", 1, 20, 1, 6],
      ],
      calc: ([good, total]) => `P = ${good}/${Math.max(good, total)} = ${(good / Math.max(good, total) * 100).toFixed(1)} %`,
    },
    "stochastik-wahrscheinlichkeit.html": {
      title: "Würfel-Ereignis",
      intro: "Wie wahrscheinlich ist eine Zahl bis zu deinem Grenzwert?",
      controls: [["Grenzwert", 1, 6, 1, 3]],
      calc: ([limit]) => `P(Zahl <= ${limit}) = ${limit}/6 = ${(limit / 6 * 100).toFixed(1)} %`,
    },
    "stochastik-baumdiagramm.html": {
      title: "Zweistufiges Baumdiagramm",
      intro: "Vergleiche zwei Pfade: Erst A oder nicht A, danach jeweils B. Einzelne Pfade werden multipliziert, passende Pfade werden addiert.",
      controls: [
        ["P(A) in %", 0, 100, 5, 60],
        ["P(B | A) in %", 0, 100, 5, 50],
        ["P(B | nicht A) in %", 0, 100, 5, 20],
      ],
      calc: ([pA, pBgivenA, pBgivenNotA]) => {
        const pNotA = 100 - pA;
        const pathAB = (pA / 100) * (pBgivenA / 100) * 100;
        const pathNotAB = (pNotA / 100) * (pBgivenNotA / 100) * 100;
        return `P(A und B) = ${pathAB.toFixed(1)} %<br>P(nicht A und B) = ${pathNotAB.toFixed(1)} %<br>P(B) = ${(pathAB + pathNotAB).toFixed(1)} %`;
      },
    },
    "stochastik-erwartungswert.html": {
      title: "Erwartungswert-Spiel",
      intro: "Vergleiche Gewinn, Wahrscheinlichkeit und Einsatz.",
      controls: [
        ["Gewinn", 0, 100, 5, 20],
        ["Chance in %", 0, 100, 5, 25],
        ["Einsatz", 0, 50, 1, 3],
      ],
      calc: ([win, chance, cost]) => `E = ${win} * ${chance / 100} - ${cost} = ${(win * chance / 100 - cost).toFixed(2)}`,
    },
    "vektoren.html": {
      title: "Vektorbetrag",
      intro: "Der Betrag ist die Länge eines Vektors.",
      controls: [
        ["x", -10, 10, 1, 3],
        ["y", -10, 10, 1, 4],
        ["z", -10, 10, 1, 0],
      ],
      calc: ([x, y, z]) => `|v| = ${Math.hypot(x, y, z).toFixed(2)}`,
    },
    "vektoren-grundlagen.html": {
      title: "Vektorbetrag",
      intro: "Ändere die Komponenten und beobachte die Länge.",
      controls: [
        ["x", -10, 10, 1, 6],
        ["y", -10, 10, 1, 8],
      ],
      calc: ([x, y]) => `|v| = Wurzel(${x}^2 + ${y}^2) = ${Math.hypot(x, y).toFixed(2)}`,
    },
    "vektoren-geraden.html": {
      title: "Gerade in Parameterform",
      intro: "Der Parameter t bewegt einen Punkt auf der Geraden.",
      controls: [["t", -5, 5, 0.5, 1]],
      calc: ([t]) => `p=(1|2), v=(3|1)<br>x = 1 + ${t}*3 = ${(1 + 3 * t).toFixed(1)}<br>y = 2 + ${t}*1 = ${(2 + t).toFixed(1)}`,
    },
    "vektoren-skalarprodukt.html": {
      title: "Skalarprodukt",
      intro: "Ist das Skalarprodukt 0, stehen zwei Vektoren senkrecht.",
      controls: [
        ["a1", -5, 5, 1, 2],
        ["a2", -5, 5, 1, 1],
        ["b1", -5, 5, 1, -1],
        ["b2", -5, 5, 1, 2],
      ],
      calc: ([a1, a2, b1, b2]) => `a*b = ${a1 * b1 + a2 * b2}<br>${a1 * b1 + a2 * b2 === 0 ? "senkrecht" : "nicht senkrecht"}`,
    },
    "finanzmathe.html": {
      title: "Zinseszins",
      intro: "Kapital wächst jedes Jahr mit demselben Faktor.",
      controls: [
        ["Kapital", 100, 10000, 100, 1000],
        ["Zins %", 0, 20, 0.5, 5],
        ["Jahre", 1, 30, 1, 10],
      ],
      calc: ([k, p, n]) => `Endkapital: ${(k * (1 + p / 100) ** n).toFixed(2)}`,
    },
    "finanzmathe-zinsen.html": {
      title: "Jahreszinsen",
      intro: "Zinsen sind ein prozentualer Anteil des Kapitals.",
      controls: [
        ["Kapital", 100, 10000, 100, 2000],
        ["Zins %", 0, 20, 0.5, 3],
      ],
      calc: ([k, p]) => `Z = ${k} * ${p}/100 = ${(k * p / 100).toFixed(2)}`,
    },
    "finanzmathe-zinseszins.html": {
      title: "Wachstum mit Zinseszins",
      intro: "Jedes Jahr wird das neue Kapital verzinst.",
      controls: [
        ["Kapital", 100, 10000, 100, 1000],
        ["Zins %", 0, 20, 0.5, 4],
        ["Jahre", 1, 40, 1, 12],
      ],
      calc: ([k, p, n]) => `K(${n}) = ${(k * (1 + p / 100) ** n).toFixed(2)}`,
    },
    "finanzmathe-wachstum.html": {
      title: "Lineares vs. exponentielles Wachstum",
      intro: "Vergleiche konstanten Zuwachs mit konstantem Faktor.",
      controls: [
        ["Startwert", 1, 1000, 10, 100],
        ["Schritte", 1, 20, 1, 8],
        ["Rate %", 0, 30, 1, 10],
      ],
      calc: ([start, steps, rate]) => `linear: ${(start + steps * rate).toFixed(2)}<br>exponentiell: ${(start * (1 + rate / 100) ** steps).toFixed(2)}`,
    },
  };

