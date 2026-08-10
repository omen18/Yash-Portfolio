import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'omen18';
const FILE_PATH = path.join(__dirname, '../src/components/GithubHeatmap.tsx');

async function getContributions() {
  if (process.env.GITHUB_TOKEN) {
    try {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `;
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'NodeJS'
        },
        body: JSON.stringify({ query, variables: { username: USERNAME } })
      });
      const data = await res.json();
      if (data.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions) {
        return data.data.user.contributionsCollection.contributionCalendar.totalContributions;
      }
    } catch (e) {
      console.log('GraphQL fetch failed, falling back to public HTML parser...');
    }
  }

  const res = await fetch(`https://github.com/users/${USERNAME}/contributions`);
  const html = await res.text();
  
  // Parse data-count="X" or Tooltip values
  const matches = html.matchAll(/data-count="(\d+)"/g);
  let total = 0;
  for (const match of matches) {
    total += parseInt(match[1], 10);
  }

  if (total === 0) {
    const altMatches = html.matchAll(/(\d+)\s+contribution/gi);
    for (const match of altMatches) {
      total += parseInt(match[1], 10);
    }
  }

  console.log(`Fetched total contributions for ${USERNAME}: ${total}`);
  return total;
}

async function main() {
  const count = await getContributions();
  if (!count || count === 0) {
    console.error('Failed to parse contribution count.');
    process.exit(1);
  }

  let content = fs.readFileSync(FILE_PATH, 'utf8');
  const regex = /totalContributions:\s*\d+/;
  if (!regex.test(content)) {
    console.error('Could not find totalContributions pattern in GithubHeatmap.tsx');
    process.exit(1);
  }

  const newContent = content.replace(regex, `totalContributions: ${count}`);

  if (content === newContent) {
    console.log(`No change. Total contributions remains ${count}.`);
  } else {
    fs.writeFileSync(FILE_PATH, newContent, 'utf8');
    console.log(`Successfully updated GithubHeatmap.tsx to totalContributions: ${count}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
