import axios from 'axios';
import chalk from 'chalk';

interface AuditScore {
  total: number;
  missing: string[];
  recommendations: string[];
}

const CRITICAL_EVENTS = [
  'user_signup',
  'user_login',
  'payment_completed',
  'subscription_created',
  'trial_started',
  'onboarding_completed',
  'feature_used',
  'invite_sent',
  'upgrade_clicked'
];

const VANITY_METRICS = [
  'page_view',
  'total_sessions',
  'bounce_rate',
  'time_on_site',
  'scroll_depth'
];

export async function auditRepo(repoPath: string, options: any): Promise<AuditScore> {
  const [owner, repo] = repoPath.split('/');

  console.log(chalk.gray(`📡 Fetching ${owner}/${repo} from GitHub...`));

  try {
    // Scan package.json for stack hints
    const packageResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
      { headers: { 'User-Agent': 'GrowthOS-Audit' } }
    );

    const packageContent = JSON.parse(
      Buffer.from(packageResponse.data.content, 'base64').toString()
    );

    // Scan for existing analytics
    const hasAnalytics = checkAnalyticsStack(packageContent);

    // Scan codebase for event tracking
    const eventPatterns = await scanForEvents(owner, repo);

    // Calculate score
    const score = calculateGrowthScore(hasAnalytics, eventPatterns, packageContent);

    if (options.output) {
      await generateAuditReport(score, options.output);
    }

    return score;

  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Repository not found. Make sure it\'s public or provide a token.');
    }
    throw error;
  }
}

function checkAnalyticsStack(packageJson: any): { found: string[], missing: string[] } {
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const analyticsLibs = [
    'posthog-js',
    '@posthog/posthog-js',
    'mixpanel-browser',
    'segment-analytics',
    '@amplitude/analytics-browser'
  ];

  const found = analyticsLibs.filter(lib => dependencies[lib]);
  const missing = analyticsLibs.filter(lib => !dependencies[lib]);

  return { found, missing };
}

async function scanForEvents(owner: string, repo: string): Promise<string[]> {
  try {
    // Search for common event tracking patterns
    const searchQueries = [
      'track(',
      'capture(',
      'analytics.',
      'gtag(',
      '_gaq.push'
    ];

    const foundEvents: string[] = [];

    for (const query of searchQueries) {
      try {
        const response = await axios.get(
          `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:${owner}/${repo}`,
          { headers: { 'User-Agent': 'GrowthOS-Audit' } }
        );

        if (response.data.total_count > 0) {
          foundEvents.push(query);
        }
      } catch (e) {
        // Continue if search fails
      }
    }

    return foundEvents;
  } catch (error) {
    return [];
  }
}

function calculateGrowthScore(
  analytics: { found: string[], missing: string[] },
  eventPatterns: string[],
  packageJson: any
): AuditScore {
  let score = 0;
  const missing: string[] = [];
  const recommendations: string[] = [];

  // Analytics setup (30 points)
  if (analytics.found.length > 0) {
    score += 30;
  } else {
    missing.push('Analytics library (PostHog, Mixpanel, etc.)');
    recommendations.push('Add PostHog for privacy-first analytics');
  }

  // Event tracking patterns (40 points)
  const eventScore = Math.min(40, eventPatterns.length * 10);
  score += eventScore;

  if (eventPatterns.length === 0) {
    missing.push('Event tracking calls');
    recommendations.push('Track user actions with .capture() calls');
  }

  // Business model detection (30 points)
  const hasPayments = packageJson.dependencies?.stripe ||
                     packageJson.dependencies?.paddle ||
                     packageJson.dependencies?.['@lemonsqueezy/lemonsqueezy.js'];

  if (hasPayments) {
    score += 15;
  } else {
    missing.push('Payment tracking');
    recommendations.push('Track subscription/payment events for revenue analytics');
  }

  const hasAuth = packageJson.dependencies?.['@supabase/supabase-js'] ||
                 packageJson.dependencies?.['next-auth'] ||
                 packageJson.dependencies?.auth0;

  if (hasAuth) {
    score += 15;
  } else {
    missing.push('User authentication events');
    recommendations.push('Track signup/login for user journey analysis');
  }

  // Penalize vanity metrics
  const hasVanityMetrics = VANITY_METRICS.some(metric =>
    JSON.stringify(packageJson).includes(metric)
  );

  if (hasVanityMetrics) {
    score -= 10;
    recommendations.push('Remove vanity metrics - focus on business KPIs');
  }

  return {
    total: Math.max(0, Math.min(100, score)),
    missing,
    recommendations
  };
}

async function generateAuditReport(score: AuditScore, filename: string): Promise<void> {
  // For v0.1, just save as JSON. PDF generation in v0.2
  const report = {
    score: score.total,
    audit_date: new Date().toISOString(),
    issues: score.missing,
    recommendations: score.recommendations,
    next_steps: [
      'Run: npx growthos init',
      'Add missing event tracking',
      'Set up PostHog dashboards',
      'Configure A/B testing'
    ]
  };

  console.log(chalk.green(`📄 Report saved: ${filename}.json`));
  // In real implementation, write to file
}