(() => {
  const select = document.getElementById("progress-test");
  const progressCanvas = document.getElementById("progress-chart");
  const seasonCanvas = document.getElementById("season-chart");
  const progressHint = document.getElementById("progress-hint");
  const seasonSummary = document.getElementById("season-summary");
  const seasonSummaryIcon = document.getElementById("season-summary-icon");
  const seasonSummaryText = document.getElementById("season-summary-text");

  if (!window.Chart || !select || !progressCanvas || !seasonCanvas) return;

  const rootStyle = getComputedStyle(document.documentElement);
  const token = (name) => rootStyle.getPropertyValue(name).trim();

  const color = {
    primary: token("--color-primary"),
    ink: token("--color-base-content"),
    inkSoft: token("--ink-soft"),
    inkMuted: token("--ink-muted"),
    surface: token("--color-base-300"),
    tooltip: token("--color-base-200"),
  };

  function withAlpha(hex, alpha) {
    const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!match) return hex;

    const [red, green, blue] = match.slice(1).map((part) => parseInt(part, 16));
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  const fontFamily = getComputedStyle(document.body).fontFamily;
  const hairline = withAlpha(color.inkSoft, 0.1);

  Chart.defaults.font.family = fontFamily;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = color.inkMuted;

  function formatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds - minutes * 60;

    if (minutes === 0) return remainingSeconds.toFixed(2);

    return `${minutes}:${remainingSeconds.toFixed(2).padStart(5, "0")}`;
  }

  const dayFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
  const DAY_MS = 86_400_000;

  function monthTicks(min, max, maxCount = 5) {
    const start = new Date(min);
    const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
    const months = [];

    while (cursor.getTime() <= max) {
      months.push(cursor.getTime());
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }

    const step = Math.max(1, Math.ceil(months.length / maxCount));
    return months.filter((_, index) => index % step === 0).map((value) => ({ value }));
  }

  function paddedRange(values, ratio = 0.12) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = Math.max((max - min) * ratio, 0.5);

    return { beginAtZero: false, suggestedMin: min - padding, suggestedMax: max + padding };
  }

  const tooltipStyle = {
    backgroundColor: withAlpha(color.tooltip, 0.92),
    borderColor: withAlpha(color.inkSoft, 0.18),
    borderWidth: 1,
    cornerRadius: 10,
    padding: 12,
    displayColors: false,
    titleColor: color.inkMuted,
    titleFont: { size: 12, weight: 500 },
    bodyColor: color.ink,
    bodyFont: { size: 16, weight: 700 },
    footerColor: color.inkSoft,
    footerFont: { size: 12, weight: 400 },
  };

  const hiddenBorder = { display: false };

  const crosshairPlugin = {
    id: "crosshair",
    beforeDatasetsDraw(chart) {
      const [active] = chart.tooltip?.getActiveElements() ?? [];
      if (!active) return;

      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.strokeStyle = withAlpha(color.ink, 0.28);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(active.element.x, chartArea.top);
      ctx.lineTo(active.element.x, chartArea.bottom);
      ctx.stroke();
      ctx.restore();
    },
  };

  const latestValuePlugin = {
    id: "latestValue",
    afterDatasetsDraw(chart) {
      const point = chart.getDatasetMeta(0).data.at(-1);
      const value = chart.data.datasets[0].data.at(-1);
      if (!point || !value) return;

      const { ctx } = chart;
      ctx.save();
      ctx.font = `700 13px ${fontFamily}`;
      ctx.fillStyle = color.ink;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(formatSeconds(value.y), point.x - 10, point.y - 10);
      ctx.restore();
    },
  };

  const seasonBestPlugin = {
    id: "seasonBest",
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const dataset = chart.data.datasets[0];

      ctx.save();
      ctx.font = `700 13px ${fontFamily}`;
      ctx.fillStyle = color.ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      chart.getDatasetMeta(0).data.forEach((point, index) => {
        ctx.fillText(formatSeconds(dataset.data[index].x), point.x, point.y - 10);
      });
      ctx.restore();
    },
  };

  function drawProgressChart(data) {
    const points = data.progress.map((point) => ({ x: Date.parse(point.date), y: point.seconds, place: point.place }));
    const first = points[0].x;
    const last = points.at(-1).x;
    const padding = Math.max((last - first) * 0.04, 10 * DAY_MS);

    return new Chart(progressCanvas, {
      type: "line",
      data: {
        datasets: [
          {
            data: points,
            borderColor: color.primary,
            borderWidth: 2,
            borderJoinStyle: "round",
            borderCapStyle: "round",
            backgroundColor: withAlpha(color.primary, 0.1),
            fill: "end",
            pointRadius: 4,
            pointHoverRadius: 6,
            pointHitRadius: 14,
            pointBackgroundColor: color.primary,
            pointBorderColor: color.surface,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        animation: { duration: 400 },
        layout: { padding: { top: 24, right: 8 } },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        scales: {
          x: {
            type: "linear",
            min: first - padding,
            max: last + padding,
            grid: { display: false },
            border: hiddenBorder,
            afterBuildTicks: (axis) => {
              axis.ticks = monthTicks(axis.min, axis.max);
            },
            ticks: { callback: (value) => monthFormatter.format(value), maxRotation: 0 },
          },
          y: {
            reverse: true, // faster (smaller) times sit higher
            ...paddedRange(points.map((point) => point.y)),
            grid: { color: hairline },
            border: hiddenBorder,
            ticks: { maxTicksLimit: 5, callback: (value) => formatSeconds(value) },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle,
            callbacks: {
              title: ([item]) => dayFormatter.format(item.raw.x),
              label: (item) => formatSeconds(item.raw.y),
              footer: ([item]) => item.raw.place,
            },
          },
        },
      },
      plugins: [crosshairPlugin, latestValuePlugin],
    });
  }

  function drawSeasonChart(data) {
    const { seasons } = data;

    return new Chart(seasonCanvas, {
      data: {
        labels: seasons.map((range) => range.season),
        datasets: [
          {
            type: "scatter",
            label: "Best",
            data: seasons.map((range) => ({ x: range.fastestSeconds, y: range.season })),
            pointRadius: 6,
            pointHoverRadius: 7,
            pointHitRadius: 12,
            pointBackgroundColor: color.primary,
            pointBorderColor: color.surface,
            pointBorderWidth: 2,
            order: 0,
          },
          {
            type: "bar",
            label: "Range",
            data: seasons.map((range) => [range.slowestSeconds, range.fastestSeconds]),
            backgroundColor: withAlpha(color.primary, 0.35),
            borderRadius: 999,
            borderSkipped: false,
            barThickness: 8,
            order: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        maintainAspectRatio: false,
        animation: { duration: 400 },
        layout: { padding: { top: 8, left: 4, right: 16 } },
        scales: {
          x: {
            type: "linear",
            reverse: true, // faster to the right
            ...paddedRange(seasons.flatMap((range) => [range.slowestSeconds, range.fastestSeconds]), 0.15),
            grid: { color: hairline },
            border: hiddenBorder,
            ticks: { maxTicksLimit: 5, callback: (value) => formatSeconds(value) },
          },
          y: {
            type: "category",
            offset: true,
            grid: { display: false },
            border: hiddenBorder,
            ticks: { color: color.inkSoft, font: { weight: 600, size: 13 } },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipStyle,
            bodyFont: { size: 14, weight: 600 },
            callbacks: {
              title: ([item]) => `Season ${seasons[item.dataIndex].season}`,
              label: (item) => {
                const range = seasons[item.dataIndex];
                return item.dataset.type === "scatter"
                  ? `Best ${formatSeconds(range.fastestSeconds)}`
                  : `${formatSeconds(range.slowestSeconds)} to ${formatSeconds(range.fastestSeconds)}`;
              },
            },
          },
        },
      },
      plugins: [seasonBestPlugin],
    });
  }

  function updateSeasonSummary(comparison) {
    if (!seasonSummary || !seasonSummaryText || !seasonSummaryIcon) return;

    seasonSummary.hidden = comparison === null;
    if (comparison === null) return;

    const difference = Math.abs(comparison.improvementSeconds).toFixed(2);
    const faster = comparison.improvementSeconds > 0;

    seasonSummaryIcon.style.transform = faster ? "" : "rotate(180deg)";
    seasonSummaryIcon.hidden = comparison.improvementSeconds === 0;
    seasonSummaryText.textContent =
      comparison.improvementSeconds === 0
        ? `Same best time as ${comparison.previousSeason}`
        : `Best time ${difference}s ${faster ? "faster" : "slower"} than ${comparison.previousSeason}`;
  }

  let charts = [];
  let pendingRequest = null;

  async function render(test) {
    pendingRequest?.abort();
    pendingRequest = new AbortController();

    try {
      const response = await fetch(`/stats/chart-data?test=${encodeURIComponent(test)}`, {
        signal: pendingRequest.signal,
      });
      if (!response.ok) throw new Error(`Chart data request failed: ${response.status}`);

      const data = await response.json();

      charts.forEach((chart) => chart.destroy());
      charts = [];
      if (data.progress.length === 0) return;

      charts = [drawProgressChart(data), drawSeasonChart(data)];

      const best = Math.min(...data.progress.map((point) => point.seconds));
      progressCanvas.setAttribute(
        "aria-label",
        `${data.test}: ${data.progress.length} swims, best ${formatSeconds(best)}. Full list in Personal bests below.`,
      );
      if (progressHint) progressHint.hidden = data.progress.length > 1;
      updateSeasonSummary(data.seasonComparison);
    } catch (error) {
      if (error.name !== "AbortError") console.error(error);
    }
  }

  select.addEventListener("change", () => render(select.value));

  document.fonts.ready.then(() => render(select.value));
})();
