import { Card, CardBody } from "@/components/ui/Card";
import { Calendar, MapPin, Coffee, Mic, Presentation, Users } from "lucide-react";

export const metadata = { title: "Programme — ICRACE 2026" };

const sessions = {
  1: [
    { time: "09:00–10:00", title: "Inaugural Keynote: The Future of AI-Driven Computing", location: "Main Auditorium", type: "KEYNOTE", speaker: "Prof. Geoffrey Hinton" },
    { time: "10:00–10:30", title: "Tea Break", location: "Foyer", type: "BREAK" },
    { time: "10:30–12:00", title: "Session 1A: AI & Machine Learning", location: "Hall A", type: "TALK", speaker: "6 paper presentations" },
    { time: "10:30–12:00", title: "Session 1B: IoT & Edge Computing", location: "Hall B", type: "TALK", speaker: "5 paper presentations" },
    { time: "12:00–13:30", title: "Lunch Break", location: "Dining Hall", type: "BREAK" },
    { time: "13:30–15:00", title: "Session 2A: Data Science & Big Data", location: "Hall A", type: "TALK", speaker: "5 paper presentations" },
    { time: "15:00–15:30", title: "Tea Break", location: "Foyer", type: "BREAK" },
    { time: "15:30–17:00", title: "Panel Discussion: AI Ethics & Society", location: "Main Auditorium", type: "PANEL" },
  ],
  2: [
    { time: "09:00–10:00", title: "Keynote: Secure Computing in the Quantum Era", location: "Main Auditorium", type: "KEYNOTE", speaker: "Dr. Andrew Yao" },
    { time: "10:00–10:30", title: "Tea Break", location: "Foyer", type: "BREAK" },
    { time: "10:30–12:00", title: "Session 3A: Cybersecurity & Privacy", location: "Hall A", type: "TALK", speaker: "6 paper presentations" },
    { time: "10:30–12:00", title: "Session 3B: Software Engineering", location: "Hall B", type: "TALK", speaker: "5 paper presentations" },
    { time: "12:00–13:30", title: "Lunch Break", location: "Dining Hall", type: "BREAK" },
    { time: "13:30–15:00", title: "Session 4A: HPC & Cloud Computing", location: "Hall A", type: "TALK", speaker: "5 paper presentations" },
    { time: "15:00–15:30", title: "Tea Break", location: "Foyer", type: "BREAK" },
    { time: "15:30–17:00", title: "Workshop: Hands-on Edge AI", location: "Lab 101", type: "WORKSHOP" },
    { time: "19:00–21:00", title: "Conference Banquet & Cultural Evening", location: "Lawns", type: "BREAK" },
  ],
  3: [
    { time: "09:00–11:00", title: "Poster Session", location: "Exhibition Hall", type: "POSTER", speaker: "15+ poster presentations" },
    { time: "11:00–11:30", title: "Tea Break", location: "Foyer", type: "BREAK" },
    { time: "11:30–13:00", title: "Session 5: Best Paper Presentations", location: "Main Auditorium", type: "TALK", speaker: "Top 5 papers" },
    { time: "13:00–14:00", title: "Lunch Break", location: "Dining Hall", type: "BREAK" },
    { time: "14:00–15:30", title: "Industry Panel: Computing for Sustainability", location: "Main Auditorium", type: "PANEL" },
    { time: "15:30–16:00", title: "Closing Ceremony & Awards", location: "Main Auditorium", type: "TALK", speaker: "Best Paper Awards" },
  ],
};

const typeStyles: Record<string, string> = {
  KEYNOTE: "bg-teal-100 text-teal-800",
  TALK: "bg-blue-100 text-blue-800",
  BREAK: "bg-gray-100 text-gray-600",
  PANEL: "bg-purple-100 text-purple-800",
  WORKSHOP: "bg-amber-100 text-amber-800",
  POSTER: "bg-emerald-100 text-emerald-800",
};

const typeIcons: Record<string, typeof Mic> = {
  KEYNOTE: Mic, TALK: Presentation, BREAK: Coffee, PANEL: Users, WORKSHOP: Presentation, POSTER: Presentation,
};

export default function ProgrammePage() {
  return (
    <div>
      <section className="bg-navy-900 text-white section-padding">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-3">Conference Programme</h1>
          <p className="text-lg text-gray-300 max-w-2xl">Three days of keynotes, technical sessions, panels, and workshops.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          {Object.entries(sessions).map(([day, items]) => (
            <div key={day} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-white font-bold">
                  {day}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy-800">Day {day}</h2>
                  <p className="text-sm text-gray-500">{day === "1" ? "March 5, 2026" : day === "2" ? "March 6, 2026" : "March 7, 2026"}</p>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((s, i) => {
                  const Icon = typeIcons[s.type] || Presentation;
                  return (
                    <Card key={i} hover>
                      <CardBody className="flex items-center gap-4 flex-wrap">
                        <div className="w-28 flex-shrink-0 text-sm font-medium text-gray-600">{s.time}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`badge ${typeStyles[s.type]} flex items-center gap-1`}>
                              <Icon className="h-3 w-3" /> {s.type}
                            </span>
                            <p className="font-medium text-navy-800">{s.title}</p>
                          </div>
                          {s.speaker && <p className="text-sm text-gray-500 mt-1">{s.speaker}</p>}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin className="h-3 w-3" /> {s.location}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="badge bg-amber-100 text-amber-800">SAMPLE PROGRAMME</span>
            <span>Schedule is configurable through the admin panel</span>
          </div>
        </div>
      </section>
    </div>
  );
}
