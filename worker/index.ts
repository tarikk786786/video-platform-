import { JobRunner } from './jobs/job-runner';

async function main() {
  console.log('--------------------------------------------------');
  console.log('Freedom-First Media Platform — Autonomous Background Worker');
  console.log('Starting polling loop for media_jobs...');
  console.log('--------------------------------------------------');

  const runner = new JobRunner();

  const poll = async () => {
    try {
      const processed = await runner.processNextJob();
      // If we processed a job, check immediately for the next one; otherwise back off 3 seconds
      setTimeout(poll, processed ? 500 : 3000);
    } catch (err) {
      console.error('[Worker WorkerLoop] Error:', err);
      setTimeout(poll, 5000);
    }
  };

  poll();
}

main().catch(console.error);
