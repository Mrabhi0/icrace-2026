"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Calendar, MapPin, Clock, ArrowRight, Users, Microscope,
  Brain, Shield, Cpu, Code, Cloud, Award, BookOpen,
  Building2, HelpCircle, Mail, Phone, Megaphone,
  CheckCircle2, FileText, CreditCard
} from "lucide-react";

const CONFERENCE_DATE = new Date("2026-03-05T09:00:00");

const tracks = [
  { icon: Brain, name: "AI & Machine Learning", desc: "Deep learning, NLP, computer vision, and AI applications" },
  { icon: Microscope, name: "Data Science & Big Data", desc: "Data mining, analytics, visualization, and scalable systems" },
  { icon: Shield, name: "Cybersecurity & Privacy", desc: "Network security, cryptography, intrusion detection" },
  { icon: Cpu, name: "IoT & Edge Computing", desc: "IoT architectures, edge intelligence, sensor networks" },
  { icon: Code, name: "Software Engineering", desc: "Architecture, DevOps, testing, distributed systems" },
  { icon: Cloud, name: "HPC & Cloud Computing", desc: "Parallel computing, GPU computing, cloud-native systems" },
];

const speakers = [
  { name: "Prof. Geoffrey Hinton", title: "Nobel Laureate, University of Toronto", topic: "The Future of Neural Networks" },
  { name: "Dr. Fei-Fei Li", title: "Stanford University", topic: "Human-Centered AI: From Vision to Action" },
  { name: "Dr. Andrew Yao", title: "Tsinghua University", topic: "Quantum Computing and Security" },
];

const fees = [
  { category: "Undergraduate Student", early: "₹1,500", standard: "₹2,500" },
  { category: "Postgraduate / Scholar", early: "₹3,000", standard: "₹4,000" },
  { category: "Faculty / Academician", early: "₹5,000", standard: "₹6,000" },
  { category: "Industry Professional", early: "₹8,000", standard: "₹10,000" },
  { category: "International", early: "$150", standard: "$200" },
  { category: "Virtual", early: "₹1,000", standard: "₹1,500" },
];

const faqs = [
  { q: "How do I register for the conference?", a: "Click on the Register Now button, create an account, and follow the registration workflow in your participant dashboard." },
  { q: "What is the abstract submission deadline?", a: "The abstract submission deadline is January 31, 2026. Please submit early to avoid last-minute issues." },
  { q: "Can I attend virtually?", a: "Yes, the conference supports virtual attendance. Select the Virtual option during registration." },
  { q: "Is there a student discount?", a: "Yes, undergraduate and postgraduate students have discounted registration fees. Early bird rates offer additional savings." },
  { q: "When will acceptance notifications be sent?", a: "Acceptance notifications will be sent by February 15, 2026 via email and your dashboard." },
];

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = target.getTime() - Date.now();
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);
  return time;
}

export default function HomePage() {
  const countdown = useCountdown(CONFERENCE_DATE);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-royal-900 opacity-90" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(20,184,166,0.1) 0%, transparent 50%)" }} />
        <div className="container-max relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-sm text-teal-300 mb-4">
              <Megaphone className="h-3.5 w-3.5" />
              Call for Papers Now Open
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              ICRACE 2026
            </h1>
            <p className="text-xl text-teal-400 font-medium mb-2">
              International Conference on Research and Advanced Computing
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Advancing Computing for a Sustainable Future
            </p>
            <div className="flex flex-wrap gap-4 mb-8 text-gray-300">
              <span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-teal-400" /> March 5–7, 2026</span>
              <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-teal-400" /> NIT Rourkela, India</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register"><Button variant="secondary" className="gap-2">Register Now <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/call-for-papers"><Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20"><FileText className="h-4 w-4" /> Submit Abstract</Button></Link>
              <Link href="/programme"><Button variant="ghost" className="text-gray-300 hover:bg-white/10"><Calendar className="h-4 w-4" /> View Programme</Button></Link>
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-12 grid grid-cols-4 gap-3 max-w-lg">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 text-center border border-white/10">
                <p className="text-2xl lg:text-3xl font-bold text-white tabular-nums">{item.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Conference Overview</h2>
            <p className="text-gray-600 leading-relaxed">
              ICRACE 2026 is a premier academic conference bringing together researchers, academicians, and industry professionals to discuss cutting-edge advances in computing and research. The conference provides a platform for sharing innovative ideas, fostering collaborations, and exploring solutions to contemporary challenges in computing.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Users, title: "500+ Participants", desc: "Researchers, faculty, and industry experts" },
              { icon: BookOpen, title: "100+ Papers", desc: "Peer-reviewed research presentations" },
              { icon: Award, title: "6 Tracks", desc: "Covering diverse computing domains" },
            ].map((stat) => (
              <Card key={stat.title} hover className="text-center">
                <CardBody className="pt-6">
                  <stat.icon className="h-8 w-8 text-teal-500 mx-auto mb-3" />
                  <p className="text-lg font-bold text-navy-800">{stat.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="bg-teal-50/50 section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Important Announcements</h2>
          <div className="space-y-3">
            {[
              { title: "Abstract Submission Deadline Extended", text: "The abstract submission deadline has been extended to January 31, 2026." },
              { title: "Early Bird Registration Now Open", text: "Avail discounted rates until January 15, 2026 for all registration categories." },
            ].map((ann) => (
              <Card key={ann.title}>
                <CardBody className="flex gap-3">
                  <Megaphone className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-navy-800">{ann.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{ann.text}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Keynote Speakers */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-2">Keynote Speakers</h2>
          <p className="text-gray-500 mb-6">Renowned experts from leading institutions</p>
          <div className="grid md:grid-cols-3 gap-4">
            {speakers.map((sp) => (
              <Card key={sp.name} hover>
                <CardBody className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-navy-100 flex items-center justify-center text-2xl font-bold text-navy-700">
                    {sp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <p className="font-semibold text-navy-800">{sp.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{sp.title}</p>
                  <p className="text-sm text-teal-600 mt-2 italic">"{sp.topic}"</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Research Tracks */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-2">Research Tracks</h2>
          <p className="text-gray-500 mb-6">Six diverse tracks covering the breadth of computing research</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track) => (
              <Card key={track.name} hover>
                <CardBody>
                  <track.icon className="h-7 w-7 text-teal-500 mb-3" />
                  <p className="font-semibold text-navy-800 mb-1">{track.name}</p>
                  <p className="text-sm text-gray-500">{track.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/tracks"><Button variant="outline">View All Tracks <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Important Dates</h2>
          <div className="space-y-3 max-w-2xl">
            {[
              { date: "Jan 15, 2026", event: "Early Bird Registration Ends", past: false },
              { date: "Jan 31, 2026", event: "Abstract Submission Deadline", past: false },
              { date: "Feb 15, 2026", event: "Acceptance Notification", past: false },
              { date: "Feb 20, 2026", event: "Standard Registration Ends", past: false },
              { date: "Feb 28, 2026", event: "Camera-Ready Submission", past: false },
              { date: "Mar 5-7, 2026", event: "Conference Dates", past: false },
            ].map((d) => (
              <div key={d.event} className="flex items-center gap-4 border-l-4 border-teal-500 pl-4 py-2">
                <Clock className="h-5 w-5 text-teal-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-navy-800">{d.event}</p>
                  <p className="text-sm text-gray-500">{d.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/important-dates"><Button variant="outline">View Full Schedule <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Fee Preview */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-2">Registration Fees</h2>
          <p className="text-gray-500 mb-6">Sample fee amounts — configurable through the admin panel</p>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="table-header">Category</th>
                    <th className="table-header">Early Bird</th>
                    <th className="table-header">Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {fees.map((f) => (
                    <tr key={f.category}>
                      <td className="table-cell font-medium text-navy-800">{f.category}</td>
                      <td className="table-cell text-teal-600 font-medium">{f.early}</td>
                      <td className="table-cell">{f.standard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <span className="badge bg-amber-100 text-amber-800">SAMPLE AMOUNTS</span>
            <span>Actual fees are configurable by administrators</span>
          </div>
          <div className="mt-4">
            <Link href="/registration"><Button variant="secondary">View Registration Details <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Call for Papers */}
      <section className="section-padding">
        <div className="container-max">
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-8">
                <FileText className="h-10 w-10 text-teal-500 mb-4" />
                <h2 className="text-2xl font-bold text-navy-800 mb-3">Call for Papers</h2>
                <p className="text-gray-600 mb-4">
                  We invite original research papers in all areas of computing and advanced research. Submissions should present novel contributions with theoretical, experimental, or practical significance.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Original research papers only", "Double-blind peer review process", "Abstract submission required first", "Maximum 8 pages (LNCS format)"].map((req) => (
                    <li key={req} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-teal-500" /> {req}
                    </li>
                  ))}
                </ul>
                <Link href="/call-for-papers"><Button variant="secondary">View Guidelines <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
              <div className="bg-navy-800 p-8 text-white">
                <p className="text-sm text-teal-400 mb-4 font-medium">SUBMISSION DEADLINE</p>
                <p className="text-3xl font-bold mb-2">January 31</p>
                <p className="text-gray-400 mb-6">2026, 23:59 IST</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-teal-400" /> Registration required before submission</div>
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-teal-400" /> Abstract (250 words max)</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-teal-400" /> Co-author management supported</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Venue */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Venue</h2>
          <Card>
            <CardBody className="flex gap-6 items-start">
              <Building2 className="h-12 w-12 text-teal-500 flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-navy-800">National Institute of Technology, Rourkela</p>
                <p className="text-gray-500 mt-1">Rourkela, Odisha, India</p>
                <p className="text-sm text-gray-400 mt-3">
                  The conference will be held at the NIT Rourkela campus, one of India's premier technical institutes. The campus offers state-of-the-art conference facilities, comfortable accommodation, and excellent connectivity.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Nearest Airport: Bhubaneswar (250 km) · Nearest Railway: Rourkela Junction (4 km)
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group card">
                <summary className="flex items-center justify-between cursor-pointer p-4 list-none">
                  <span className="font-medium text-navy-800 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-teal-500" />{faq.q}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 text-sm text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Get in Touch</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card><CardBody className="text-center">
              <Mail className="h-6 w-6 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-navy-800">Email</p>
              <p className="text-sm text-gray-500 mt-1">icrace2026@example.edu</p>
            </CardBody></Card>
            <Card><CardBody className="text-center">
              <Phone className="h-6 w-6 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-navy-800">Phone</p>
              <p className="text-sm text-gray-500 mt-1">+91 000 000 0000</p>
            </CardBody></Card>
            <Card><CardBody className="text-center">
              <MapPin className="h-6 w-6 text-teal-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-navy-800">Address</p>
              <p className="text-sm text-gray-500 mt-1">NIT Rourkela, Odisha</p>
            </CardBody></Card>
          </div>
          <div className="mt-6">
            <Link href="/contact"><Button variant="primary">Contact Us <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
