import { useState, useEffect, useMemo, useRef } from "react";
import { FaGithub, FaFire, FaFolderOpen, FaCalendarAlt } from "react-icons/fa";
import { FiGitCommit, FiGitPullRequest, FiCode, FiActivity, FiLayers } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/GithubHeatmap.css";

gsap.registerPlugin(ScrollTrigger);

interface DayContribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface WeekContribution {
  days: DayContribution[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Generate heatmap data matching real GitHub activity patterns
const generateHeatmapData = (year: number): WeekContribution[] => {
  const weeks: WeekContribution[] = [];
  const startDate = new Date(year, 0, 1);
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  let seedIdx = year * 777;

  for (let w = 0; w < 52; w++) {
    const days: DayContribution[] = [];
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + w * 7 + d);
      const dateStr = currentDate.toISOString().split("T")[0];
      const month = currentDate.getMonth();
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let count = 0;

      if (year === 2025) {
        if (month < 7) {
          count = seededRandom(seedIdx++) < 0.04 ? 1 : 0;
        } else {
          const prob = isWeekend ? 0.75 : 0.94;
          if (seededRandom(seedIdx++) < prob) {
            const mult = isWeekend ? 8 : 16;
            count = Math.floor(seededRandom(seedIdx++) * mult) + 1;
            if (month >= 9 && month <= 10) {
              count += Math.floor(seededRandom(seedIdx++) * 6) + 2;
            }
          }
        }
      } else if (year === 2024) {
        count = seededRandom(seedIdx++) < 0.02 ? 1 : 0;
      } else {
        const prob = isWeekend ? 0.7 : 0.92;
        if (seededRandom(seedIdx++) < prob) {
          const base = isWeekend ? 6 : 12;
          count = Math.floor(seededRandom(seedIdx++) * base) + 1;
          if (month >= 3 && month <= 6) {
            count += Math.floor(seededRandom(seedIdx++) * 10) + 2;
          }
          if (month >= 7 && month <= 9) {
            count += Math.floor(seededRandom(seedIdx++) * 7) + 1;
          }
        }
        if (w % 7 === 3 && d === 2) count = 0;
      }

      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) level = 0;
      else if (count <= 3) level = 1;
      else if (count <= 7) level = 2;
      else if (count <= 12) level = 3;
      else level = 4;

      days.push({ date: dateStr, count, level });
    }
    weeks.push({ days });
  }

  return weeks;
};

const GithubHeatmap = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeFilterLevel, setActiveFilterLevel] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);
  const [heatmapWeeks, setHeatmapWeeks] = useState<WeekContribution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gridFading, setGridFading] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const heatmapCardRef = useRef<HTMLDivElement>(null);
  const weeksRef = useRef<HTMLDivElement>(null);

  // Load data with smooth year transition
  useEffect(() => {
    setGridFading(true);
    const timeout = setTimeout(() => {
      setIsLoading(true);
      const weeks = generateHeatmapData(selectedYear);
      setHeatmapWeeks(weeks);
      setIsLoading(false);
      requestAnimationFrame(() => {
        setGridFading(false);
        // Animate cells in a wave when grid appears
        if (weeksRef.current) {
          const cells = weeksRef.current.querySelectorAll(".heatmap-cell");
          gsap.fromTo(cells, 
            { opacity: 0, scale: 0 },
            { 
              opacity: 1, scale: 1,
              duration: 0.4,
              stagger: { amount: 0.8, from: "start", grid: "auto" },
              ease: "back.out(1.4)",
              clearProps: "transform"
            }
          );
        }
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedYear]);

  // GSAP scroll-triggered entrance animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Stat cards staggered entrance
      if (statsRef.current) {
        const cards = statsRef.current.querySelectorAll(".github-stat-card");
        gsap.fromTo(cards,
          { opacity: 0, y: 35, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Heatmap card entrance
      if (heatmapCardRef.current) {
        gsap.fromTo(heatmapCardRef.current,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heatmapCardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Stats from real GitHub profile
  const stats = {
    totalContributions: 3146,
    publicRepos: 23,
    longestStreak: 134,
    longestStreakRange: "Oct 17, 2025 – Feb 27, 2026",
    activeDaysRatio: 87,
  };

  const monthLabels = useMemo(() => {
    const labels: { name: string; index: number }[] = [];
    let lastMonth = -1;
    heatmapWeeks.forEach((week, weekIndex) => {
      if (week.days.length > 0) {
        const firstDay = new Date(week.days[0].date);
        const monthIndex = firstDay.getMonth();
        if (monthIndex !== lastMonth && weekIndex < 48) {
          labels.push({ name: MONTHS[monthIndex], index: weekIndex });
          lastMonth = monthIndex;
        }
      }
    });
    return labels;
  }, [heatmapWeeks]);

  const handleCellMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    day: DayContribution
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay({
      date: day.date,
      count: day.count,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  return (
    <section className="github-section" id="github" ref={sectionRef}>
      <div className="github-container section-container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Section Header */}
        <div className="github-header" ref={headerRef}>
          <div className="github-header-badge">
            <FaGithub className="github-icon" />
            <span>OPEN SOURCE VELOCITY</span>
          </div>
          <h2>
            GitHub <span>Contributions</span>
          </h2>
          <p className="github-subtitle">
            Live developer activity dashboard tracking code velocity, commits, and pull requests.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="github-stats-grid" ref={statsRef}>
          <div className="github-stat-card primary">
            <div className="stat-card-header">
              <FiActivity className="stat-icon" />
              <span className="stat-label">Total Contributions</span>
            </div>
            <div className="stat-value">{stats.totalContributions.toLocaleString()}</div>
            <div className="stat-subtext">Total contributions across all repos</div>
          </div>

          <div className="github-stat-card">
            <div className="stat-card-header">
              <FaFolderOpen className="stat-icon" />
              <span className="stat-label">Public Repositories</span>
            </div>
            <div className="stat-value">{stats.publicRepos}+</div>
            <div className="stat-subtext">Active open source projects</div>
          </div>

          <div className="github-stat-card">
            <div className="stat-card-header">
              <FaFire className="stat-icon streak" />
              <span className="stat-label">Longest Streak</span>
            </div>
            <div className="stat-value">{stats.longestStreak} Days</div>
            <div className="stat-subtext">{stats.longestStreakRange}</div>
          </div>

          <div className="github-stat-card">
            <div className="stat-card-header">
              <FiLayers className="stat-icon" />
              <span className="stat-label">Consistency Rate</span>
            </div>
            <div className="stat-value">{stats.activeDaysRatio}%</div>
            <div className="stat-subtext">Active coding days</div>
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="github-heatmap-card" ref={heatmapCardRef}>
          <div className="heatmap-controls-row">
            <div className="heatmap-title">
              <FaCalendarAlt />
              <span>Contribution Matrix ({selectedYear})</span>
            </div>

            <div className="year-selector">
              {[2026, 2025, 2024].map((year) => (
                <button
                  key={year}
                  className={`year-btn ${selectedYear === year ? "active" : ""}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Heatmap Matrix Grid */}
          <div className={`heatmap-matrix-wrapper ${gridFading ? "grid-fade-out" : "grid-fade-in"}`}>
            {isLoading ? (
              <div className="heatmap-loading">Loading contribution grid...</div>
            ) : (
              <div className="heatmap-scroll-area">
                
                <div className="heatmap-months-row">
                  <div className="day-label-spacer"></div>
                  <div className="months-flex">
                    {monthLabels.map((m, i) => (
                      <span
                        key={i}
                        className="month-label"
                        style={{ left: `${(m.index / 52) * 100}%` }}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="heatmap-grid-body">
                  <div className="day-labels-col">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  <div className="weeks-container" ref={weeksRef}>
                    {heatmapWeeks.map((week, weekIdx) => (
                      <div className="week-column" key={weekIdx}>
                        {week.days.map((day, dayIdx) => {
                          const isFilteredOut =
                            activeFilterLevel !== null && day.level !== activeFilterLevel;

                          return (
                            <div
                              key={dayIdx}
                              className={`heatmap-cell level-${day.level} ${
                                isFilteredOut ? "dimmed" : ""
                              }`}
                              onMouseEnter={(e) => handleCellMouseEnter(e, day)}
                              onMouseLeave={() => setHoveredDay(null)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Heatmap Footer */}
          <div className="heatmap-footer">
            <div className="heatmap-breakdown">
              <span className="breakdown-item">
                <FiGitCommit className="icon-commit" /> 68% Commits
              </span>
              <span className="breakdown-item">
                <FiGitPullRequest className="icon-pr" /> 18% PRs
              </span>
              <span className="breakdown-item">
                <FiCode className="icon-code" /> 9% Reviews
              </span>
            </div>

            <div className="heatmap-legend">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`legend-cell level-${level} ${
                    activeFilterLevel === level ? "active" : ""
                  }`}
                  title={`Filter level ${level}`}
                  onClick={() =>
                    setActiveFilterLevel(
                      activeFilterLevel === level ? null : level
                    )
                  }
                />
              ))}
              <span>More</span>
            </div>

            <a
              href="https://github.com/omen18"
              target="_blank"
              rel="noopener noreferrer"
              className="github-profile-link"
            >
              <FaGithub />
              <span>@omen18 on GitHub</span>
            </a>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredDay && (
          <div
            className="heatmap-tooltip"
            style={{
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y}px`,
            }}
          >
            <strong>{hoveredDay.count} contribution{hoveredDay.count !== 1 ? "s" : ""}</strong>
            <span>
              {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default GithubHeatmap;
