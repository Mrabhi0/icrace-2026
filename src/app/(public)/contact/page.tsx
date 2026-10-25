"use client";

import { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, HelpCircle, Send, CheckCircle2, ChevronDown } from "lucide-react";

const faqs = [
  { q: "How do I register for the conference?", a: "Click Register Now, create an account, and follow the registration workflow in your participant dashboard." },
  { q: "What is the abstract submission deadline?", a: "The abstract submission deadline is January 31, 2026. Please submit early to avoid last-minute issues." },
  { q: "Can I attend virtually?", a: "Yes, the conference supports virtual attendance. Select the Virtual option during registration." },
  { q: "Is there a student discount?", a: "Yes, undergraduate and postgraduate students have discounted registration fees. Early bird rates offer additional savings." },
  { q: "When will acceptance notifications be sent?", a: "Acceptance notifications will be sent by February 15, 2026 via email and your dashboard." },
  { q: "Can I get a refund if I cancel?", a: "Refund requests are handled by the finance team. Please submit a refund request through your dashboard." },
  { q: "Do I need to register before submitting a paper?", a: "Yes, at least one author must complete registration before the paper can be included in proceedings." },
  { q: "How do I get a certificate?", a: "Certificates are issued after the conference for eligible participants. Check your participant dashboard for eligibility status." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <section className="bg-navy-900 text-white section-padding">
        <div className="container-max">
          <h1 className="text-3xl font-bold mb-3">Contact & FAQs</h1>
          <p className="text-lg text-gray-300 max-w-2xl">Get in touch with the organising committee or find answers to common questions.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-4">Contact Information</h2>
              <div className="space-y-3 mb-6">
                <Card><CardBody className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-teal-500" />
                  <div><p className="text-sm font-medium text-navy-800">Email</p><p className="text-sm text-gray-500">icrace2026@example.edu</p></div>
                </CardBody></Card>
                <Card><CardBody className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-500" />
                  <div><p className="text-sm font-medium text-navy-800">Phone</p><p className="text-sm text-gray-500">+91 000 000 0000</p></div>
                </CardBody></Card>
                <Card><CardBody className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-teal-500" />
                  <div><p className="text-sm font-medium text-navy-800">Address</p><p className="text-sm text-gray-500">NIT Rourkela, Odisha, India</p></div>
                </CardBody></Card>
              </div>

              <h2 className="text-xl font-bold text-navy-800 mb-4">Send a Message</h2>
              <Card>
                <CardBody>
                  {status === "success" && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> Message sent successfully! We'll get back to you soon.
                    </div>
                  )}
                  {status === "error" && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                      Failed to send message. Please try again or email us directly.
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                    <Textarea label="Message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                    <Button type="submit" loading={status === "loading"} className="gap-2 w-full">
                      <Send className="h-4 w-4" /> Send Message
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <Card key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="flex items-center gap-2 font-medium text-navy-800">
                        <HelpCircle className="h-4 w-4 text-teal-500" /> {faq.q}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
