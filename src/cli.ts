#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { auditRepo } from './audit/scanner';
import { initProject } from './init/setup';

const program = new Command();

program
  .name('growthos')
  .description('Growth in a Box - Analytics, A/B tests & referrals for indie hackers')
  .version('0.1.0');

program
  .command('audit')
  .description('🔍 Scan GitHub repo for missing growth events (FREE)')
  .argument('<repo>', 'GitHub repo URL (e.g., username/repo)')
  .option('-o, --output <file>', 'Save audit report as PDF')
  .option('--share', 'Generate shareable score for social media')
  .action(async (repo, options) => {
    console.log(chalk.blue('🔍 Scanning repo for growth opportunities...'));

    try {
      const score = await auditRepo(repo, options);

      console.log(chalk.green(`\n✅ Growth Score: ${score.total}/100`));
      console.log(chalk.yellow(`\n📊 Missing ${score.missing.length} critical events:`));

      score.missing.forEach((event: string, i: number) => {
        console.log(chalk.red(`   ${i + 1}. ${event}`));
      });

      if (options.share) {
        console.log(chalk.cyan('\n🚀 Shareable: "Just scored ' + score.total + '/100 on growth tracking with @GrowthOS - here\'s what I\'m missing: ' + score.missing.slice(0, 2).join(', ') + '"'));
      }

      console.log(chalk.blue('\n💡 Fix these issues with: npx growthos init'));
      console.log(chalk.gray('   Get full analytics + A/B tests + referrals in <30min'));

    } catch (error) {
      console.error(chalk.red('❌ Audit failed:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('🚀 Initialize GrowthOS in your project')
  .option('-k, --key <posthog>', 'PostHog API key')
  .option('--skip-setup', 'Skip interactive setup')
  .action(async (options) => {
    console.log(chalk.blue('🚀 Initializing GrowthOS...'));

    try {
      await initProject(options);
      console.log(chalk.green('\n✅ GrowthOS ready! Check your dashboard in <5min'));
    } catch (error) {
      console.error(chalk.red('❌ Init failed:'), error);
      process.exit(1);
    }
  });

program.parse();