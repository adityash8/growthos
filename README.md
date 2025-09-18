# 📈 GrowthOS

> Growth in a Box - Analytics, A/B tests & referrals for indie hackers

Stop burning weeks on analytics plumbing. Get trusted data + growth experiments in <30 minutes.

## 🚀 Quick Start

```bash
# Free audit - scan any GitHub repo
npx growthos audit username/repo --share

# Initialize in your project
npx growthos init
```

## ✨ What You Get

- **🎯 Anti-Vanity SDK** - Auto-rejects page_view noise, tracks business KPIs only
- **📊 Instant Dashboards** - Activation, retention, revenue metrics that matter
- **🧪 A/B Testing** - Feature flags + PostHog bridge in 5 minutes
- **🔗 Referral System** - QR codes, tracking, commission exports
- **🤖 Growth Insights** - Daily Slack pings: "Fix 15% drop-off with this CTA change"

## 🎯 The Problem

Every indie hacker burns 2-4 weeks setting up:
- PostHog/Mixpanel plumbing
- Event schema design
- A/B testing infrastructure
- Referral tracking
- Revenue attribution

**Result:** Months of dev time before first growth experiment.

## 💡 The GrowthOS Solution

1. **Audit First** - Free CLI scans your repo for missing events
2. **Ship Fast** - One command installs full growth stack
3. **Anti-Vanity** - Hardcoded rejection of useless metrics
4. **AI-Powered** - Growth agents suggest flag variants automatically

## 🔧 Installation

```bash
npm install -g growthos
```

Or use directly:
```bash
npx growthos --help
```

## 📋 Commands

### `growthos audit <repo>`
Scan GitHub repo for growth opportunities.

```bash
# Basic audit
npx growthos audit vercel/next.js

# Generate shareable score
npx growthos audit username/repo --share

# Save detailed report
npx growthos audit username/repo -o report.pdf
```

### `growthos init`
Initialize GrowthOS in your project.

```bash
# Interactive setup
npx growthos init

# With PostHog key
npx growthos init --key phc_abc123

# Skip prompts
npx growthos init --skip-setup
```

## 🎯 Example Output

```
🔍 Scanning repo for growth opportunities...
📡 Fetching username/repo from GitHub...

✅ Growth Score: 42/100

📊 Missing 4 critical events:
   1. Analytics library (PostHog, Mixpanel, etc.)
   2. Event tracking calls
   3. Payment tracking
   4. User authentication events

🚀 Shareable: "Just scored 42/100 on growth tracking with @GrowthOS - here's what I'm missing: Analytics library, Event tracking calls"

💡 Fix these issues with: npx growthos init
   Get full analytics + A/B tests + referrals in <30min
```

## 🏗️ What Gets Generated

After running `growthos init`:

```
growthos/
├── sdk.js           # Anti-vanity autotrack SDK
├── events.yaml      # Business KPI schema
└── dashboard.json   # Pre-built metric configs
```

### SDK Usage
```javascript
import { initGrowthOS } from './growthos/sdk';

// Initialize with PostHog
initGrowthOS('your-posthog-key');

// Track business events (vanity metrics auto-rejected)
growthos.track('subscription_created', {
  plan: 'pro',
  amount: 49
});

// A/B testing
const variant = growthos.getVariant('checkout_button_test');

// Referral tracking
growthos.trackReferral('FRIEND123');
```

## 🎯 Rejected Vanity Metrics

GrowthOS automatically rejects these useless metrics:
- `page_view`
- `total_sessions`
- `bounce_rate`
- `time_on_site`
- `scroll_depth`

**Focus on business KPIs that drive revenue.**

## 🚀 Viral Loop

1. Run audit on any public repo
2. Get shareable score (e.g., "42/100")
3. Tweet/share your results
4. Others try the tool
5. Repeat

## 🗺️ Roadmap

### v0.1 (Current)
- [x] Growth Audit CLI
- [x] Anti-vanity autotrack SDK
- [x] Events schema generation

### v0.2 (Next 2 weeks)
- [ ] A/B testing engine
- [ ] Referral system with QR codes
- [ ] Social proof widgets
- [ ] Growth console dashboard

### v1.0 (2 months)
- [ ] AI Drop-off Doctor
- [ ] Lifecycle email sequences
- [ ] Revenue attribution
- [ ] Auto-guardrail rollbacks

## 💰 Pricing

- **Free**: Growth audit for any public repo
- **$49/mo**: Full growth stack for <10K MAU
- **$149/mo**: AI insights + advanced targeting
- **$499/mo**: White-glove setup + custom integrations

## 🤝 Contributing

We're building in public! Join the community:

- 🐦 [Twitter updates](https://twitter.com/growthos)
- 💬 [Discord community](https://discord.gg/growthos)
- 🐛 [Report issues](https://github.com/growthos/growthos/issues)

## 📄 License

MIT - Build cool stuff!