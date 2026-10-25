import { Card, CardBody } from "@/components/ui/Card";
import { Clock, Calendar } from "lucide-react";

export const metadata = { title: "Important Dates — ICRACE 2026" };

const dates = [
  { date: "January 15, 2026", event: "Early Bird Registration Ends", desc: "Last date to avail discounted registration fees" },
  { date: "January 31, 2026", event: "Abstract Submission Deadline", desc: "Submit your abstract (max 250 words) through the portal" },
  { date: "February 10, 2026", event: "Full Paper Submission Deadline", desc: "Accepted abstracts must submit full papers (max 8 pages)" },
  { date: "February 15, 2026", event: "Acceptance Notification", desc: "Authors will be notified of the review decision via email" },
  { date: "February 20, 2026", event: "Standard Registration Ends", desc: "Last date for regular registration fees" },
  { date: "February 28, 2026", event: "Camera-Ready Submission", desc: "Final revised paper submission with copyright form" },
  { date: "March 5–7, 2026", event: "Conference Dates", desc: "Three days of keynotes, technical sessions, and networking" },
];

export default function ImportantDatesPage() {
  return (
    <div>
      <section className="bg-navy-900 text-white section-padding">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-3">Important Dates</h1>
          <p className="text-lg text-gray-300 max-w-2xl">Key deadlines for abstract submission, registration, and the conference itself.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="relative">
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gray-200" />
            <div className="space-y-6">
              {dates.map((d, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 z-10">
                    <Calendar className="h-5 w-5 text-teal-600" />
                  </div>
                  <Card className="flex-1">
                    <CardBody>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-navy-800">{d.event}</p>
                          <p className="text-sm text-gray-500 mt-1">{d.desc}</p>
                        </div>
                        <span className="badge bg-navy-50 text-navy-700 whitespace-nowrap">
                          <Clock className="h-3 w-3 mr-1" /> {d.date}
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
            <span className="badge bg-amber-100 text-amber-800">SAMPLE DATES</span>
            <span>All dates are configurable through the admin panel</span>
          </div>
        </div>
      </section>
    </div>
  );
}
