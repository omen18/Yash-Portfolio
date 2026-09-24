import { GitHubCalendar } from 'react-github-calendar';
import 'react-github-calendar/tooltips.css';
import './styles/GithubHeatmap.css';

const GithubHeatmap = () => {
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const monthStr = date.toLocaleString('en-US', { month: 'short' });
    return `${monthStr} ${Number(day)}`;
  };

  return (
    <section className="github-heatmap-wrapper" id="github-heatmap">
      <div className="github-heatmap-section">
        <div className="heatmap-header">
          <h2>GitHub activity</h2>
          <a 
            href="https://github.com/omen18" 
            target="_blank" 
            rel="noreferrer"
            className="view-profile-link"
          >
            View profile ↗
          </a>
        </div>
        <div className="calendar-container">
          <GitHubCalendar 
            username="omen18" 
            colorScheme="dark"
            blockSize={14}
            blockMargin={4}
            blockRadius={3}
            fontSize={12}
            showTotalCount={false}
            labels={{
              legend: { less: '', more: '' },
            }}
            theme={{
              light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
              dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            tooltips={{
              activity: {
                placement: 'top',
                offset: 8,
                hoverRestMs: 20,
                withArrow: false,
                text: (activity) => 
                  `${activity.count === 0 ? 'No' : activity.count} contribution${activity.count === 1 ? '' : 's'} · ${formatDate(activity.date)}`
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default GithubHeatmap;
