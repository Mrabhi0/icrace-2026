import { Card, CardBody } from "@/components/ui/Card";
import { Brain, Microscope, Shield, Cpu, Code, Cloud } from "lucide-react";

export const metadata = { title: "Tracks — ICRACE 2026" };

const tracks = [
  {
    icon: Brain,
    name: "Artificial Intelligence & Machine Learning",
    description: "Deep learning, NLP, computer vision, and AI applications.",
    topics: ["Deep Learning", "Natural Language Processing", "Computer Vision", "Reinforcement Learning", "AI Ethics", "Generative Models"],
    guidelines: "Papers should demonstrate novel AI/ML methodologies with experimental validation on standard datasets.",
  },
  {
    icon: Microscope,
    name: "Data Science & Big Data Analytics",
    description: "Data mining, analytics, visualization, and scalable data systems.",
    topics: ["Data Mining", "Predictive Analytics", "Data Visualization", "Streaming Data", "Graph Analytics", "Federated Data Systems"],
    guidelines: "Submissions should include datasets, reproducible experiments, and performance benchmarks.",
  },
  {
    icon: Shield,
    name: "Cybersecurity & Privacy",
    description: "Network security, cryptography, intrusion detection, and privacy-preserving systems.",
    topics: ["Cryptography", "Network Security", "Intrusion Detection", "Privacy-Enhancing Tech", "Blockchain Security", "Zero Trust Architecture"],
    guidelines: "Papers must include threat models and formal security analysis.",
  },
  {
    icon: Cpu,
    name: "Internet of Things & Edge Computing",
    description: "IoT architectures, edge intelligence, and sensor networks.",
    topics: ["IoT Architecture", "Edge Computing", "Sensor Networks", "Fog Computing", "Smart Cities", "Energy-Efficient IoT"],
    guidelines: "Submissions should address scalability, energy efficiency, or real-world deployment scenarios.",
  },
  {
    icon: Code,
    name: "Software Engineering & Systems",
    description: "Software architecture, DevOps, testing, and distributed systems.",
    topics: ["Microservices", "CI/CD", "Software Testing", "Distributed Systems", "Container Orchestration", "Code Quality Analysis"],
    guidelines: "Papers should include empirical studies or case studies with measurable results.",
  },
  {
    icon: Cloud,
    name: "High-Performance & Cloud Computing",
    description: "Parallel computing, GPU computing, cloud-native architectures.",
    topics: ["Parallel Algorithms", "GPU Computing", "Cloud Native", "Serverless", "Quantum Computing", "Energy-Efficient Computing"],
    guidelines: "Submissions should demonstrate significant performance improvements or novel architectures.",
  },
];

export default function TracksPage() {
  return (
    <div>
      <section className="bg-navy-900 text-white section-padding">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-3">Research Tracks</h1>
          <p className="text-lg text-gray-300 max-w-2xl">Six diverse tracks covering the breadth of contemporary computing research.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="space-y-6">
            {tracks.map((track, idx) => (
              <Card key={track.name}>
                <CardBody>
                  <div className="flex gap-4 items-start">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100">
                      <track.icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-navy-800 mb-1">{track.name}</h2>
                      <p className="text-sm text-gray-600 mb-3">{track.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {track.topics.map((t) => (
                          <span key={t} className="badge bg-gray-100 text-gray-600">{t}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400"><span className="font-medium">Guidelines:</span> {track.guidelines}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
