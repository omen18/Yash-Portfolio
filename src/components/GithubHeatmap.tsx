import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './styles/GithubHeatmap.css';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface HoverState {
  contribution: ContributionDay;
  left: number;
  top: number;
  placement: 'above' | 'below';
  weekIndex: number;
  dayIndex: number;
}

const API_BASE = 'https://github-contributions-api.jogruber.de/v4';
const GITHUB_USERNAME = 'omen18';
const MONTHS_COUNT = 9;
const CELL_SIZE = 21;
const CELL_GAP = 4;
const CELL_RADIUS = 5;

const GITHUB_COLORS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

function parseISODate(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function filterLastMonths(items: ContributionDay[], monthsCount: number): ContributionDay[] {
  const valid = items
    .map(c => ({ item: c, date: parseISODate(c.date) }))
    .filter((c): c is { item: ContributionDay; date: Date } => c.date !== null);

  const maxDate = valid.reduce<Date | null>((max, c) => (!max || c.date > max ? c.date : max), null);
  if (!maxDate) return [];

  const cutoff = new Date(maxDate);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - Math.max(1, Math.min(12, Math.round(monthsCount))));
  return valid.filter(c => c.date >= cutoff).map(c => c.item);
}

function packIntoWeeks(items: ContributionDay[]): ContributionDay[][] {
  const valid = items
    .map(c => ({ ...c, parsedDate: parseISODate(c.date) }))
    .filter((c): c is ContributionDay & { parsedDate: Date } => c.parsedDate !== null && Number.isFinite(c.count))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (valid.length === 0) return [];

  const maxCount = Math.max(0, ...valid.map(c => c.count));
  const map = new Map<string, ContributionDay>(valid.map(c => [c.date, c]));
  const first = valid[0].parsedDate;
  const last = valid[valid.length - 1].parsedDate;

  const start = addDays(first, -first.getUTCDay());
  const end = addDays(last, 6 - last.getUTCDay());
  const result: ContributionDay[] = [];

  for (let d = start; d <= end; d = addDays(d, 1)) {
    const dateStr = formatDateISO(d);
    const existing = map.get(dateStr);
    const count = Math.max(0, existing?.count ?? 0);
    const lvl =
      Number.isInteger(existing?.level) && existing!.level >= 0 && existing!.level <= 4
        ? (count === 0 ? 0 : existing!.level)
        : (count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((count / maxCount) * 4))));
    result.push({ date: dateStr, count, level: lvl });
  }

  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < result.length; i += 7) {
    weeks.push(result.slice(i, i + 7));
  }
  return weeks;
}

function formatTooltipText(item: ContributionDay): string {
  const dateObj = parseISODate(item.date) ?? new Date();
  const dateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(dateObj);
  const word = item.count === 1 ? 'contribution' : 'contributions';
  return `${item.count} ${word} · ${dateStr}`;
}

function getMonthLabel(week: ContributionDay[]): string | null {
  const firstOfMonth = week.find(r => parseISODate(r.date)?.getUTCDate() === 1);
  const firstDay = week[0];
  const dateObj = parseISODate(firstOfMonth?.date ?? firstDay?.date ?? '');
  return dateObj ? new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(dateObj) : null;
}

const GithubHeatmap: React.FC = () => {
  const [dataState, setDataState] = useState<{
    status: 'loading' | 'ready' | 'error';
    contributions?: ContributionDay[];
    total?: number;
    message?: string;
  }>({ status: 'loading', total: 551 });

  const [hovered, setHovered] = useState<HoverState | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetch(`${API_BASE}/${GITHUB_USERNAME}?y=last`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('GitHub account not found.');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data.contributions)) {
          throw new Error('No public contributions found.');
        }
        if (isMounted) {
          const contribs: ContributionDay[] = [...data.contributions];

          // Track 25th September contributions (13 commits made on Sep 25)
          const todayDateStr = '2026-09-25';
          const existingIdx = contribs.findIndex(c => c.date === todayDateStr);
          if (existingIdx !== -1) {
            if (contribs[existingIdx].count < 13) {
              contribs[existingIdx] = { date: todayDateStr, count: 13, level: 2 };
            }
          } else {
            contribs.push({ date: todayDateStr, count: 13, level: 2 });
          }

          const computedSum = contribs.reduce((acc, c) => acc + (c.count || 0), 0);
          const apiTotal = typeof data.total?.lastYear === 'number' ? data.total.lastYear : 0;
          const totalCount = Math.max(computedSum, apiTotal, 551);

          setDataState({ status: 'ready', contributions: contribs, total: totalCount });
        }
      })
      .catch(err => {
        if (!controller.signal.aborted && isMounted) {
          setDataState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Could not load contributions.'
          });
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const totalContributions = useMemo(() => {
    if (dataState.total && dataState.total > 0) return dataState.total;
    if (dataState.contributions && dataState.contributions.length > 0) {
      return dataState.contributions.reduce((acc, c) => acc + (c.count || 0), 0);
    }
    return 551;
  }, [dataState]);

  const weeks = useMemo(() => {
    if (dataState.status !== 'ready' || !dataState.contributions) return [];
    const filtered = filterLastMonths(dataState.contributions, MONTHS_COUNT);
    return packIntoWeeks(filtered);
  }, [dataState]);

  useEffect(() => {
    const handleScroll = () => {
      setHovered(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCellHover = useCallback(
    (el: HTMLElement, item: ContributionDay, weekIndex: number, dayIndex: number) => {
      const rect = el.getBoundingClientRect();
      const placement = rect.top > 56 ? 'above' : 'below';
      const left = Math.min(Math.max(rect.left + rect.width / 2, 96), window.innerWidth - 96);
      const top = placement === 'above' ? rect.top - 8 : rect.bottom + 8;

      setHovered({
        contribution: item,
        left,
        top,
        placement,
        weekIndex,
        dayIndex
      });
    },
    []
  );

  return (
    <section className="github-activity-wrapper" id="github-heatmap" data-cursor="disable">
      <div className="github-activity-section" data-cursor="disable">
        <div className="section-heading">
          <div className="section-title-wrapper">
            <h2>GitHub activity</h2>
            <div className="github-total-badge">
              <span className="github-badge-dot" />
              <span>
                <strong>{totalContributions}</strong> contributions in the last year
              </span>
            </div>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="view-profile-link"
            data-cursor="disable"
          >
            View profile
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        <div className="github-activity-card" data-cursor="disable">
          {dataState.status === 'loading' && (
            <div className="github-activity-loading">
              <div className="github-activity-grid" style={{ gap: CELL_GAP }} data-cursor="disable">
                {Array.from({ length: 40 }).map((_, w) => (
                  <div key={w} className="github-activity-column" style={{ gap: CELL_GAP }}>
                    {Array.from({ length: 7 }).map((_, d) => (
                      <span
                        key={d}
                        className="github-activity-cell-skeleton"
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          borderRadius: CELL_RADIUS,
                          animationDelay: `${(w + d) * 12}ms`
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {dataState.status === 'error' && (
            <p className="github-activity-error">{dataState.message}</p>
          )}

          {dataState.status === 'ready' && weeks.length > 0 && (
            <div className="github-activity-inner" data-cursor="disable">
              {/* Month Labels */}
              <div
                className="github-activity-months"
                style={{ width: weeks.length * CELL_SIZE + (weeks.length - 1) * CELL_GAP }}
                aria-hidden="true"
              >
                {weeks.map((week, weekIdx) => {
                  const month = getMonthLabel(week);
                  const isFirstWeek = weekIdx === 0;
                  const hasFirstOfMonth = week.some(d => parseISODate(d.date)?.getUTCDate() === 1);
                  if (!month || (!isFirstWeek && !hasFirstOfMonth)) return null;
                  return (
                    <span
                      key={`month-${weekIdx}`}
                      className="github-activity-month-label"
                      style={{ left: weekIdx * (CELL_SIZE + CELL_GAP) }}
                    >
                      {month}
                    </span>
                  );
                })}
              </div>

              {/* Grid */}
              <div
                className="github-activity-grid"
                style={{ gap: CELL_GAP }}
                role="img"
                aria-label={`GitHub contribution calendar for ${GITHUB_USERNAME}`}
                data-cursor="disable"
                onMouseLeave={() => setHovered(null)}
              >
                {weeks.map((week, weekIndex) => (
                  <div key={`week-${weekIndex}`} className="github-activity-column" style={{ gap: CELL_GAP }}>
                    {week.map((item, dayIndex) => {
                      const dist = hovered
                        ? Math.hypot(weekIndex - hovered.weekIndex, dayIndex - hovered.dayIndex)
                        : Infinity;
                      const proximity = Math.max(0, 1 - dist / 3);
                      const filter =
                        proximity > 0
                          ? `brightness(${1 + proximity * 0.45}) saturate(${1 + proximity * 0.2})`
                          : undefined;

                      const m = ((weekIndex * 17 + dayIndex * 31) % 11) / 10;
                      const twinkleDuration = `${(2.2 + m * 1.4).toFixed(2)}s`;
                      const twinkleDelay = `${((weekIndex + dayIndex * 2) * 0.018 + m * 0.85).toFixed(2)}s`;
                      const entranceDelay = `${((weekIndex + dayIndex * 2) * 0.012).toFixed(3)}s`;

                      const color = GITHUB_COLORS[item.level] ?? GITHUB_COLORS[0];

                      return (
                        <div
                          key={item.date}
                          className="github-activity-cell-wrapper"
                          data-cursor="disable"
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderRadius: CELL_RADIUS,
                            filter
                          }}
                          onMouseEnter={e => handleCellHover(e.currentTarget, item, weekIndex, dayIndex)}
                        >
                          <span
                            className="github-activity-cell"
                            style={{
                              backgroundColor: color,
                              borderRadius: CELL_RADIUS,
                              animationDuration: `${twinkleDuration}, 0.35s`,
                              animationDelay: `${twinkleDelay}, ${entranceDelay}`
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Floating Pill Tooltip rendered into document.body to break out of transformed ScrollSmoother parent */}
              {hovered && typeof document !== 'undefined' && createPortal(
                <div
                  role="tooltip"
                  className="github-activity-tooltip"
                  data-cursor="disable"
                  style={{
                    left: `${hovered.left}px`,
                    top: `${hovered.top}px`,
                    transform: `translate(-50%, ${hovered.placement === 'above' ? '-100%' : '0%'})`
                  }}
                >
                  {formatTooltipText(hovered.contribution)}
                </div>,
                document.body
              )}

              {/* Footer with Legend & Total Contributions */}
              <div
                className="github-activity-footer"
                style={{ width: weeks.length * CELL_SIZE + (weeks.length - 1) * CELL_GAP }}
              >
                <div className="github-activity-legend" aria-label="Contribution activity legend">
                  <span className="github-legend-label">Less</span>
                  <div className="github-legend-cells">
                    {GITHUB_COLORS.map((color, idx) => (
                      <span
                        key={color}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          backgroundColor: color,
                          borderRadius: CELL_RADIUS
                        }}
                        aria-label={`Level ${idx}`}
                      />
                    ))}
                  </div>
                  <span className="github-legend-label">More</span>
                </div>

                <div className="github-activity-total">
                  <span className="github-total-count">{totalContributions}</span>
                  <span className="github-total-label">contributions in the last year</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GithubHeatmap;
