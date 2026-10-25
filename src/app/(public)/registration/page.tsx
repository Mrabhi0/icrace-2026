import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Globe, Monitor, Users } from "lucide-react";

export const metadata = { title: "Registration — ICRACE 2026" };

const fees = [
  { category: "Undergraduate Student", early: "₹1,500", standard: "₹2,500", desc: "Full-time UG students with valid ID" },
  { category: "Postgraduate / Research Scholar", early: "₹3,000", standard: "₹4,000", desc: "PG students and PhD scholars" },
  { category: "Faculty / Academician", early: "₹5,000", standard: "₹6,000", desc: "Teaching faculty from academic institutions" },
  { category: "Industry Professional", early: "₹8,000", standard: "₹10,000", desc: "Professionals from industry organizations" },
  { category: "International Participant", early: "$150", standard: "$200", desc: "Participants from outside India" },
  { category: "Virtual Participant", early: "₹1,000", standard: "₹1,500", desc: "Online attendance for all sessions" },
  { category: "Invited Speaker", early: "₹0", standard: "₹0", desc: "Exempt — invited keynote speakers" },
];

const modes = [
  { icon: Users, title: "In-Person", desc: "Attend all sessions on-site at NIT Rourkela with full networking and cultural events" },
  { icon: Monitor, title: "Virtual", desc: "Join all sessions online with live streaming and interactive Q&A" },
  { icon: Globe, title: "Hybrid", desc: "Flexible attendance — participate in person or virtually as per your convenience" },
];

export default function RegistrationPage() {
  return (
    <div>
      <section className="bg-navy-900 text-white section-padding">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-3">Registration</h1>
          <p className="text-lg text-gray-300 max-w-2xl">Register for ICRACE 2026. Choose your category and attendance mode.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-xl font-bold text-navy-800 mb-4">Attendance Modes</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {modes.map((m) => (
              <Card key={m.title} hover>
                <CardBody>
                  <m.icon className="h-8 w-8 text-teal-500 mb-3" />
                  <p className="font-semibold text-navy-800">{m.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-4">Registration Fees</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="table-header">Category</th>
                    <th className="table-header">Early Bird</th>
                    <th className="table-header">Standard</th>
                    <th className="table-header hidden md:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {fees.map((f) => (
                    <tr key={f.category}>
                      <td className="table-cell font-medium text-navy-800">{f.category}</td>
                      <td className="table-cell text-teal-600 font-medium">{f.early}</td>
                      <td className="table-cell">{f.standard}</td>
                      <td className="table-cell text-gray-500 hidden md:table-cell">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <span className="badge bg-amber-100 text-amber-800">SAMPLE AMOUNTS</span>
            <span>Fees are configurable by administrators. Early bird ends Jan 15, 2026. Taxes extra (18% GST).</span>
          </div>

          <Card className="mt-8">
            <CardBody>
              <h3 className="font-semibold text-navy-800 mb-3">Registration Includes</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {["Conference kit and badge", "All technical sessions access", "Coffee breaks and lunch", "Conference proceedings", "Certificate of participation", "Networking dinner (in-person)"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-teal-500" /> {item}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/register">
              <Button variant="secondary" className="gap-2">Register Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
