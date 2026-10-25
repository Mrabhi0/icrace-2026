import { Card, CardBody } from "@/components/ui/Card";
import { Target, GraduationCap, Users, Award, Building2 } from "lucide-react";

export const metadata = { title: "About — ICRACE 2026" };

const objectives = [
  "Provide a platform for researchers to share cutting-edge advancements in computing",
  "Foster collaboration between academia and industry on emerging technologies",
  "Address societal challenges through computing research and innovation",
  "Promote interdisciplinary research across computing domains",
  "Encourage participation from students, faculty, and industry professionals",
];

const organisingCommittee = [
  { role: "General Chair", name: "Prof. S. Radhakrishnan", affiliation: "NIT Rourkela" },
  { role: "Program Chair", name: "Dr. Vikram Nair", affiliation: "NIT Rourkela" },
  { role: "Technical Chair", name: "Dr. Anjali Reddy", affiliation: "IIIT Hyderabad" },
  { role: "Finance Chair", name: "Dr. Priya Sharma", affiliation: "NIT Rourkela" },
  { role: "Publications Chair", name: "Dr. Meena Rao", affiliation: "VIT Vellore" },
  { role: "Operations Chair", name: "Dr. Rahul Verma", affiliation: "NIT Rourkela" },
];

const scientificCommittee = [
  { name: "Prof. Geoffrey Hinton", affiliation: "University of Toronto" },
  { name: "Dr. Fei-Fei Li", affiliation: "Stanford University" },
  { name: "Dr. Andrew Yao", affiliation: "Tsinghua University" },
  { name: "Prof. Manindra Agrawal", affiliation: "IIT Kanpur" },
  { name: "Dr. Krithi Ramamritham", affiliation: "IIT Bombay" },
];

const advisoryBoard = [
  { name: "Prof. C.R. Rao", affiliation: "Penn State University" },
  { name: "Dr. Raj Reddy", affiliation: "Carnegie Mellon University" },
  { name: "Prof. T.K. Srikanth", affiliation: "Microsoft Research India" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-navy-900 text-white section-padding">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-3">About ICRACE 2026</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            The International Conference on Research and Advanced Computing (ICRACE) is an annual conference dedicated to advancing research in computing and related fields.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">Conference Overview</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            ICRACE 2026 is organized by the Department of Computer Science and Engineering at the National Institute of Technology, Rourkela. The conference aims to bring together leading researchers, academicians, and industry professionals to exchange ideas, present research findings, and discuss future directions in computing. With a strong emphasis on quality and innovation, ICRACE provides a rigorous peer-review process and a platform for meaningful academic discourse.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-6 w-6 text-teal-500" />
            <h2 className="text-2xl font-bold text-navy-800">Objectives and Scope</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 max-w-4xl">
            {objectives.map((obj, i) => (
              <Card key={i}>
                <CardBody className="flex gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">{i + 1}</span>
                  <p className="text-sm text-gray-600 pt-0.5">{obj}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-6 w-6 text-teal-500" />
            <h2 className="text-2xl font-bold text-navy-800">Organising Institution</h2>
          </div>
          <Card>
            <CardBody className="flex gap-4">
              <GraduationCap className="h-12 w-12 text-navy-700 flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-navy-800">National Institute of Technology, Rourkela</p>
                <p className="text-sm text-gray-500">Department of Computer Science & Engineering</p>
                <p className="text-sm text-gray-400 mt-2">
                  NIT Rourkela is one of India's premier technical institutions, established in 1961. The Department of CSE is known for its excellence in research and education, with strong industry collaborations and a vibrant research community.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-teal-500" />
            <h2 className="text-2xl font-bold text-navy-800">Organising Committee</h2>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr><th className="table-header">Role</th><th className="table-header">Name</th><th className="table-header">Affiliation</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {organisingCommittee.map((m) => (
                    <tr key={m.role}>
                      <td className="table-cell font-medium text-navy-800">{m.role}</td>
                      <td className="table-cell">{m.name}</td>
                      <td className="table-cell text-gray-500">{m.affiliation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-6 w-6 text-teal-500" />
            <h2 className="text-2xl font-bold text-navy-800">Scientific Committee</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scientificCommittee.map((m) => (
              <Card key={m.name} hover>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center font-bold text-navy-700">
                      {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-navy-800 text-sm">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.affiliation}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Advisory Board</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {advisoryBoard.map((m) => (
              <Card key={m.name}>
                <CardBody className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700">
                    {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <p className="font-medium text-navy-800 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.affiliation}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
