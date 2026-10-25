import { Card, CardBody } from "@/components/ui/Card";
import { FileText, Download, AlertCircle, CheckCircle2, FileCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Call for Papers — ICRACE 2026" };

export default function CallForPapersPage() {
  return (
    <div>
      <section className="bg-navy-900 text-white section-padding">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-3">Call for Papers</h1>
          <p className="text-lg text-gray-300 max-w-2xl">We invite original, unpublished research contributions across all tracks of the conference.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max max-w-4xl space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-teal-500" />
                <h2 className="text-lg font-bold text-navy-800">Submission Guidelines</h2>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  "Papers must be original and not previously published or under review elsewhere",
                  "Submissions are first made as abstracts (max 250 words)",
                  "Upon abstract acceptance, full papers must follow the LNCS format (max 8 pages)",
                  "All submissions undergo a double-blind peer review process",
                  "At least one author must register before the paper can be included in proceedings",
                  "Plagiarism check is mandatory — similarity index must be below 15%",
                ].map((g, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> {g}</li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-semibold text-navy-800 mb-3">Abstract Requirements</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> Maximum 250 words</li>
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> Must include: problem statement, methodology, key results, and conclusion</li>
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> Provide 3-5 keywords relevant to the submission track</li>
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> All co-authors must be listed with affiliations</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-semibold text-navy-800 mb-3">Paper Formatting Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> Format: Springer LNCS (2-column, single-spaced)</li>
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> Maximum length: 8 pages including references</li>
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> File format: PDF (maximum 10 MB)</li>
                <li className="flex gap-2"><FileCheck className="h-4 w-4 text-teal-500 flex-shrink-0 mt-0.5" /> Authors must be anonymized for double-blind review</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-teal-500" />
                <h3 className="font-semibold text-navy-800">Review Policy</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Each submission is reviewed by at least two expert reviewers in a double-blind process. Reviewers evaluate papers on relevance, originality, methodology, clarity, and technical quality. Based on reviewer recommendations, the scientific committee makes the final decision: Accept, Minor Revision, Major Revision, or Reject. Reviewer recommendations do not automatically determine the final decision.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-navy-50">
            <CardBody className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-navy-800">Download Guidelines</h3>
                <p className="text-sm text-gray-500 mt-1">LNCS template and submission guidelines (PDF, 2.1 MB)</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </CardBody>
          </Card>

          <div className="text-center pt-4">
            <Link href="/register"><Button variant="secondary">Register & Submit</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
