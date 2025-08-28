import { db } from "../server/db/client";
    console.log("📊 Creating evaluation results...");
    const evaluationData = [
      {
        modelName: "fraud-detector-v2",
        version: "2.1.3",
        accuracy: "0.9670",
        precision: "0.9420", 
        recall: "0.8890",
        f1Score: "0.9150",
        latency: 142
      },
      {
        modelName: "risk-scorer",
        version: "1.8.2",
        accuracy: "0.9230",
        precision: "0.9010",
        recall: "0.8760",
        f1Score: "0.8880",
        latency: 89
      }
    ];

    for (const evalData of evaluationData) {
      await db.insert(evaluationResults).values(evalData);
    }

    console.log("🎉 Database seed completed successfully!");
    console.log("\n📈 Seeded data summary:");
    console.log(`- 1 demo user (admin)`);
    console.log(`- 5 demo transactions (varied risk levels)`);
    console.log(`- 5 risk assessments`);
    console.log(`- 1 CDP position (health ratio: 2.0)`);
    console.log(`- 1 chat session`);
    console.log(`- 3 audit log entries`);
    console.log(`- 2 evaluation results`);

  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run seed if called directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const isMain = process.argv[1] === __filename;

if (isMain) {
  seed().then(() => {
    process.exit(0);
  });
}

export { seed };
