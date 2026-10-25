// Seed file for Conference Management Portal
// Creates demo data with clearly labelled test accounts
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Roles ───
  const roles = await Promise.all(
    [
      { name: "PARTICIPANT", description: "Conference participant / author" },
      { name: "REVIEWER", description: "Paper reviewer" },
      { name: "COMMITTEE_MEMBER", description: "Scientific committee member" },
      { name: "FINANCE_MANAGER", description: "Finance and registration manager" },
      { name: "OPERATIONS_MANAGER", description: "Conference operations manager" },
      { name: "SUPER_ADMIN", description: "Super administrator" },
    ].map((r) => prisma.role.create({ data: r }))
  );
  const roleMap = Object.fromEntries(roles.map((r) => [r.name, r]));

  // ─── Permissions ───
  const permissionNames = [
    "submissions.create", "submissions.view", "submissions.review",
    "finance.manage", "operations.manage", "admin.manage",
    "decisions.make", "fees.configure", "users.manage",
    "reports.export", "content.manage", "attendance.manage",
  ];
  const permissions = await Promise.all(
    permissionNames.map((n) => prisma.permission.create({ data: { name: n } }))
  );

  // Assign permissions to roles
  const rolePerms = {
    PARTICIPANT: ["submissions.create", "submissions.view"],
    REVIEWER: ["submissions.review", "submissions.view"],
    COMMITTEE_MEMBER: ["submissions.view", "decisions.make"],
    FINANCE_MANAGER: ["finance.manage", "fees.configure", "reports.export"],
    OPERATIONS_MANAGER: ["operations.manage", "attendance.manage"],
    SUPER_ADMIN: permissionNames,
  };

  for (const [roleName, perms] of Object.entries(rolePerms)) {
    const role = roleMap[roleName];
    for (const permName of perms) {
      const perm = permissions.find((p) => p.name === permName);
      if (perm) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  }

  // ─── Conference Settings ───
  const settings = {
    "conference.name": "ICRACE 2026",
    "conference.fullName": "International Conference on Research and Advanced Computing",
    "conference.theme": "Advancing Computing for a Sustainable Future",
    "conference.dates": "March 5–7, 2026",
    "conference.venue": "National Institute of Technology, Rourkela",
    "conference.organiser": "Department of Computer Science & Engineering, NIT Rourkela",
    "conference.contactEmail": "icrace2026@example.edu",
    "conference.contactPhone": "+91 000 000 0000",
    "conference.website": "https://icrace2026.example.edu",
    "conference.startDate": "2026-03-05",
    "conference.endDate": "2026-03-07",
    "conference.currency": "INR",
    "conference.taxRate": "18",
    "registration.open": "true",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.conferenceSetting.create({ data: { key, value } });
  }

  // ─── Fee Rules ───
  const feeRules = [
    { category: "UNDERGRADUATE", standardFee: 2500, earlyBirdFee: 1500, attendanceMode: "IN_PERSON" },
    { category: "POSTGRADUATE", standardFee: 4000, earlyBirdFee: 3000, attendanceMode: "IN_PERSON" },
    { category: "FACULTY", standardFee: 6000, earlyBirdFee: 5000, attendanceMode: "IN_PERSON" },
    { category: "INDUSTRY", standardFee: 10000, earlyBirdFee: 8000, attendanceMode: "IN_PERSON" },
    { category: "INTERNATIONAL", standardFee: 200, earlyBirdFee: 150, attendanceMode: "IN_PERSON" },
    { category: "VIRTUAL", standardFee: 1500, earlyBirdFee: 1000, attendanceMode: "VIRTUAL" },
    { category: "INVITED_SPEAKER", standardFee: 0, earlyBirdFee: 0, attendanceMode: "ALL" },
  ];
  for (const rule of feeRules) {
    await prisma.feeRule.create({
      data: {
        ...rule,
        earlyBirdEndDate: new Date("2026-01-15"),
        standardEndDate: new Date("2026-02-20"),
      },
    });
  }

  // ─── Tracks ───
  const tracks = [
    { name: "Artificial Intelligence & Machine Learning", description: "Deep learning, NLP, computer vision, and AI applications.", topics: "Deep Learning,Natural Language Processing,Computer Vision,Reinforcement Learning,AI Ethics", guidelines: "Papers should demonstrate novel AI/ML methodologies with experimental validation." },
    { name: "Data Science & Big Data Analytics", description: "Data mining, analytics, visualization, and scalable data systems.", topics: "Data Mining,Predictive Analytics,Data Visualization,Streaming Data,Graph Analytics", guidelines: "Submissions should include datasets, reproducible experiments, and performance benchmarks." },
    { name: "Cybersecurity & Privacy", description: "Network security, cryptography, intrusion detection, and privacy-preserving systems.", topics: "Cryptography,Network Security,Intrusion Detection,Privacy-Enhancing Tech,Blockchain Security", guidelines: "Papers must include threat models and security analysis." },
    { name: "Internet of Things & Edge Computing", description: "IoT architectures, edge intelligence, and sensor networks.", topics: "IoT Architecture,Edge Computing,Sensor Networks,Fog Computing,Smart Cities", guidelines: "Submissions should address scalability, energy efficiency, or real-world deployment." },
    { name: "Software Engineering & Systems", description: "Software architecture, DevOps, testing, and distributed systems.", topics: "Microservices,CI/CD,Software Testing,Distributed Systems,Container Orchestration", guidelines: "Papers should include empirical studies or case studies with measurable results." },
    { name: "High-Performance & Cloud Computing", description: "Parallel computing, GPU computing, cloud-native architectures.", topics: "Parallel Algorithms,GPU Computing,Cloud Native,Serverless,Quantum Computing", guidelines: "Submissions should demonstrate significant performance improvements or novel architectures." },
  ];
  const trackRecords = [];
  for (const track of tracks) {
    trackRecords.push(await prisma.track.create({ data: track }));
  }

  // ─── Demo Users ───
  const passwordHash = await bcrypt.hash("Demo@1234", 10);

  // Super Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@icrace2026.edu",
      passwordHash,
      firstName: "Arjun",
      lastName: "Mehta",
      phone: "+91 98765 43210",
      roles: { create: [{ roleId: roleMap.SUPER_ADMIN.id }] },
    },
  });

  // Finance Manager
  const finance = await prisma.user.create({
    data: {
      email: "finance@icrace2026.edu",
      passwordHash,
      firstName: "Priya",
      lastName: "Sharma",
      phone: "+91 98765 43211",
      roles: { create: [{ roleId: roleMap.FINANCE_MANAGER.id }] },
    },
  });

  // Operations Manager
  const operations = await prisma.user.create({
    data: {
      email: "operations@icrace2026.edu",
      passwordHash,
      firstName: "Rahul",
      lastName: "Verma",
      phone: "+91 98765 43212",
      roles: { create: [{ roleId: roleMap.OPERATIONS_MANAGER.id }] },
    },
  });

  // Reviewer
  const reviewer = await prisma.user.create({
    data: {
      email: "reviewer@icrace2026.edu",
      passwordHash,
      firstName: "Anjali",
      lastName: "Reddy",
      phone: "+91 98765 43213",
      roles: { create: [{ roleId: roleMap.REVIEWER.id }] },
    },
  });

  // Committee Member
  const committee = await prisma.user.create({
    data: {
      email: "committee@icrace2026.edu",
      passwordHash,
      firstName: "Vikram",
      lastName: "Nair",
      phone: "+91 98765 43214",
      roles: { create: [{ roleId: roleMap.COMMITTEE_MEMBER.id }] },
    },
  });

  // Second reviewer
  const reviewer2 = await prisma.user.create({
    data: {
      email: "reviewer2@icrace2026.edu",
      passwordHash,
      firstName: "Sneha",
      lastName: "Gupta",
      phone: "+91 98765 43215",
      roles: { create: [{ roleId: roleMap.REVIEWER.id }] },
    },
  });

  // Participant / Author
  const participantUser = await prisma.user.create({
    data: {
      email: "participant@icrace2026.edu",
      passwordHash,
      firstName: "Karthik",
      lastName: "Iyer",
      phone: "+91 98765 43216",
      roles: { create: [{ roleId: roleMap.PARTICIPANT.id }] },
      participant: {
        create: {
          institution: "Indian Institute of Technology, Madras",
          department: "Computer Science & Engineering",
          category: "POSTGRADUATE",
          attendanceMode: "IN_PERSON",
          designation: "PhD Scholar",
          city: "Chennai",
          country: "India",
          registrationId: "REG-2026-0001",
        },
      },
    },
    include: { participant: true },
  });
  const participant = participantUser;

  // Second participant (faculty)
  const participant2User = await prisma.user.create({
    data: {
      email: "participant2@icrace2026.edu",
      passwordHash,
      firstName: "Meena",
      lastName: "Rao",
      phone: "+91 98765 43217",
      roles: { create: [{ roleId: roleMap.PARTICIPANT.id }] },
      participant: {
        create: {
          institution: "Vellore Institute of Technology",
          department: "Information Technology",
          category: "FACULTY",
          attendanceMode: "VIRTUAL",
          designation: "Associate Professor",
          city: "Vellore",
          country: "India",
        },
      },
    },
    include: { participant: true },
  });
  const participant2 = participant2User;

  // ─── Registrations ───
  const reg1 = await prisma.registration.create({
    data: {
      participantId: participant.participant.id,
      userId: participant.id,
      registrationId: "REG-2026-0001",
      category: "POSTGRADUATE",
      attendanceMode: "IN_PERSON",
      feeAmount: 3000,
      discountAmount: 0,
      taxAmount: 540,
      totalAmount: 3540,
      status: "PAID",
    },
  });

  const reg2 = await prisma.registration.create({
    data: {
      participantId: participant2.participant.id,
      userId: participant2.id,
      registrationId: "REG-2026-0002",
      category: "FACULTY",
      attendanceMode: "VIRTUAL",
      feeAmount: 1000,
      discountAmount: 0,
      taxAmount: 180,
      totalAmount: 1180,
      status: "PENDING",
    },
  });

  // ─── Payments ───
  await prisma.payment.create({
    data: {
      registrationId: reg1.id,
      transactionRef: "TXN-DEMO-001",
      amount: 3540,
      status: "SUCCESS",
      method: "TEST_GATEWAY",
      isTestMode: true,
    },
  });

  await prisma.payment.create({
    data: {
      registrationId: reg2.id,
      transactionRef: "TXN-DEMO-002",
      amount: 1180,
      status: "PENDING",
      method: "TEST_GATEWAY",
      isTestMode: true,
    },
  });

  // ─── Submissions ───
  const sub1 = await prisma.submission.create({
    data: {
      title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
      abstractText: "This paper proposes a novel federated learning framework for healthcare data analytics that preserves patient privacy while enabling collaborative model training across hospitals. We introduce a differential privacy mechanism that achieves 95% model accuracy with epsilon=0.5, outperforming existing approaches by 12%.",
      keywords: "Federated Learning, Differential Privacy, Healthcare, Deep Learning",
      trackId: trackRecords[0].id,
      participantId: participant.participant.id,
      status: "UNDER_REVIEW",
      submittedAt: new Date("2026-01-20"),
      authors: {
        create: [
          { name: "Karthik Iyer", email: "participant@icrace2026.edu", affiliation: "IIT Madras", isCorresponding: true, order: 0, participantId: participant.participant.id },
          { name: "Rajesh Kumar", email: "rajesh@example.edu", affiliation: "IIT Madras", order: 1 },
        ],
      },
      files: {
        create: [
          { fileName: "federated_learning_healthcare.pdf", filePath: "/uploads/sub1_paper.pdf", fileType: "FULL_PAPER", fileSize: 2048000, mimeType: "application/pdf", version: 1 },
        ],
      },
    },
  });

  const sub2 = await prisma.submission.create({
    data: {
      title: "Edge-Cloud Collaborative Inference for Real-Time Object Detection in Autonomous Vehicles",
      abstractText: "We present an edge-cloud collaborative inference framework for real-time object detection in autonomous driving scenarios. Our approach dynamically partitions deep neural network layers between edge devices and cloud servers, reducing latency by 40% while maintaining 98% detection accuracy.",
      keywords: "Edge Computing, Object Detection, Autonomous Vehicles, Real-Time Systems",
      trackId: trackRecords[3].id,
      participantId: participant2.participant.id,
      status: "UNDER_REVIEW",
      submittedAt: new Date("2026-01-22"),
      authors: {
        create: [
          { name: "Meena Rao", email: "participant2@icrace2026.edu", affiliation: "VIT Vellore", isCorresponding: true, order: 0, participantId: participant2.participant.id },
        ],
      },
      files: {
        create: [
          { fileName: "edge_cloud_detection.pdf", filePath: "/uploads/sub2_paper.pdf", fileType: "FULL_PAPER", fileSize: 1536000, mimeType: "application/pdf", version: 1 },
        ],
      },
    },
  });

  const sub3 = await prisma.submission.create({
    data: {
      title: "A Lightweight Blockchain-Based Framework for Secure IoT Device Authentication",
      abstractText: "This paper introduces a lightweight blockchain framework for IoT device authentication that reduces computational overhead by 60% compared to traditional approaches while maintaining security guarantees. We implement and evaluate the framework on resource-constrained IoT devices.",
      keywords: "Blockchain, IoT, Authentication, Security, Lightweight Cryptography",
      trackId: trackRecords[2].id,
      participantId: participant.participant.id,
      status: "SUBMITTED",
      submittedAt: new Date("2026-01-25"),
      authors: {
        create: [
          { name: "Karthik Iyer", email: "participant@icrace2026.edu", affiliation: "IIT Madras", isCorresponding: true, order: 0, participantId: participant.participant.id },
          { name: "Divya Menon", email: "divya@example.edu", affiliation: "IIT Madras", order: 1 },
        ],
      },
    },
  });

  // ─── Reviewer Assignments ───
  const assign1 = await prisma.reviewerAssignment.create({
    data: {
      submissionId: sub1.id,
      userId: reviewer.id,
      status: "IN_PROGRESS",
      dueDate: new Date("2026-02-15"),
    },
  });

  const assign2 = await prisma.reviewerAssignment.create({
    data: {
      submissionId: sub1.id,
      userId: reviewer2.id,
      status: "ASSIGNED",
      dueDate: new Date("2026-02-15"),
    },
  });

  const assign3 = await prisma.reviewerAssignment.create({
    data: {
      submissionId: sub2.id,
      userId: reviewer.id,
      status: "ASSIGNED",
      dueDate: new Date("2026-02-20"),
    },
  });

  // ─── Sample Review (completed) ───
  await prisma.review.create({
    data: {
      assignmentId: assign1.id,
      submissionId: sub1.id,
      userId: reviewer.id,
      relevance: 9,
      originality: 8,
      methodology: 7,
      clarity: 8,
      technicalQuality: 8,
      overallScore: 8,
      strengths: "Well-structured paper with clear motivation and thorough experimental validation. The differential privacy mechanism is well-designed.",
      weaknesses: "Some related work could be expanded. The computational overhead analysis could include more diverse datasets.",
      requiredRevisions: "1) Expand related work section with 2025 publications. 2) Add experiments on additional healthcare datasets. 3) Clarify the epsilon selection criteria.",
      confidentialComments: "Strong submission. Recommend acceptance with minor revisions.",
      commentsForAuthor: "This is a well-written paper with significant contributions. Please address the minor issues mentioned above.",
      recommendation: "MINOR_REVISION",
      submittedAt: new Date("2026-02-01"),
    },
  });

  // Update assignment status to completed
  await prisma.reviewerAssignment.update({
    where: { id: assign1.id },
    data: { status: "COMPLETED" },
  });

  // ─── Editorial Decision (sample for sub1) ───
  await prisma.editorialDecision.create({
    data: {
      submissionId: sub1.id,
      decision: "REVISION_REQUESTED",
      decidedBy: committee.id,
      decidedByName: "Vikram Nair",
      comments: "Please address reviewer comments. Minor revisions required before acceptance.",
    },
  });

  // Update submission status
  await prisma.submission.update({
    where: { id: sub1.id },
    data: { status: "REVISION_REQUESTED" },
  });

  // ─── Sessions ───
  const session1 = await prisma.session.create({
    data: {
      day: 1,
      date: new Date("2026-03-05"),
      startTime: "09:00",
      endTime: "10:00",
      title: "Inaugural Keynote: The Future of AI-Driven Computing",
      description: "Keynote address on emerging trends in AI and computing research.",
      location: "Main Auditorium",
      type: "KEYNOTE",
      chairName: "Dr. S. Radhakrishnan",
    },
  });

  const session2 = await prisma.session.create({
    data: {
      day: 1,
      date: new Date("2026-03-05"),
      startTime: "10:30",
      endTime: "12:00",
      title: "Session 1A: AI & Machine Learning",
      description: "Technical paper presentations on AI and ML topics.",
      location: "Hall A",
      type: "TALK",
      chairName: "Dr. Vikram Nair",
    },
  });

  const session3 = await prisma.session.create({
    data: {
      day: 1,
      date: new Date("2026-03-05"),
      startTime: "13:30",
      endTime: "15:00",
      title: "Session 1B: IoT & Edge Computing",
      description: "Technical paper presentations on IoT and edge computing.",
      location: "Hall B",
      type: "TALK",
      chairName: "Dr. Anjali Reddy",
    },
  });

  const session4 = await prisma.session.create({
    data: {
      day: 2,
      date: new Date("2026-03-06"),
      startTime: "09:00",
      endTime: "10:00",
      title: "Keynote: Secure Computing in the Quantum Era",
      description: "Keynote on quantum computing and security implications.",
      location: "Main Auditorium",
      type: "KEYNOTE",
      chairName: "Dr. Priya Sharma",
    },
  });

  const session5 = await prisma.session.create({
    data: {
      day: 2,
      date: new Date("2026-03-06"),
      startTime: "10:30",
      endTime: "12:00",
      title: "Session 2A: Cybersecurity & Privacy",
      description: "Technical paper presentations on cybersecurity topics.",
      location: "Hall A",
      type: "TALK",
    },
  });

  const session6 = await prisma.session.create({
    data: {
      day: 3,
      date: new Date("2026-03-07"),
      startTime: "09:00",
      endTime: "11:00",
      title: "Poster Session",
      description: "Interactive poster presentations.",
      location: "Exhibition Hall",
      type: "POSTER",
    },
  });

  // ─── Certificates ───
  await prisma.certificate.create({
    data: {
      certificateId: "CERT-2026-0001",
      participantId: participant.participant.id,
      registrationId: reg1.id,
      type: "PARTICIPATION",
      status: "PENDING",
    },
  });

  // ─── Announcements ───
  await prisma.announcement.create({
    data: {
      title: "Abstract Submission Deadline Extended",
      content: "The abstract submission deadline has been extended to January 31, 2026. Please submit your abstracts at the earliest.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Early Bird Registration Now Open",
      content: "Early bird registration is now open until January 15, 2026. Avail discounted rates for all registration categories.",
      isPublished: true,
      publishedAt: new Date("2025-12-01"),
    },
  });

  // ─── Email Templates ───
  const templates = [
    { name: "REGISTRATION_CONFIRMATION", subject: "Registration Confirmed - {conferenceName}", body: "Dear {name},\n\nYour registration for {conferenceName} has been confirmed.\nRegistration ID: {registrationId}\nCategory: {category}\nTotal Amount: {amount}\n\nThank you for registering!", variables: "name,conferenceName,registrationId,category,amount" },
    { name: "PAYMENT_SUCCESS", subject: "Payment Successful - {conferenceName}", body: "Dear {name},\n\nYour payment of {amount} has been successfully processed.\nTransaction Ref: {transactionRef}\n\nYou can download your receipt from the participant dashboard.", variables: "name,conferenceName,amount,transactionRef" },
    { name: "ABSTRACT_SUBMITTED", subject: "Abstract Submitted - {conferenceName}", body: "Dear {name},\n\nYour abstract titled '{title}' has been submitted successfully.\nSubmission ID: {submissionId}\nStatus: Under Screening\n\nYou will be notified once the review process begins.", variables: "name,conferenceName,title,submissionId" },
    { name: "REVIEWER_ASSIGNED", subject: "New Review Assignment - {conferenceName}", body: "Dear {name},\n\nYou have been assigned to review the paper titled '{title}'.\nDue Date: {dueDate}\n\nPlease log in to your reviewer dashboard to begin.", variables: "name,conferenceName,title,dueDate" },
    { name: "ACCEPTANCE_NOTIFICATION", subject: "Paper Accepted - {conferenceName}", body: "Dear {name},\n\nCongratulations! Your paper titled '{title}' has been accepted for presentation at {conferenceName}.\n\nPlease prepare your camera-ready submission.", variables: "name,conferenceName,title" },
    { name: "REJECTION_NOTIFICATION", subject: "Paper Not Accepted - {conferenceName}", body: "Dear {name},\n\nThank you for submitting your paper titled '{title}' to {conferenceName}. After careful review, we regret to inform you that your paper was not accepted.", variables: "name,conferenceName,title" },
  ];
  for (const tmpl of templates) {
    await prisma.emailTemplate.create({ data: tmpl });
  }

  // ─── Notifications ───
  await prisma.notification.create({
    data: {
      userId: participant.id,
      title: "Registration Confirmed",
      message: "Your registration (REG-2026-0001) has been confirmed. Payment received successfully.",
      type: "SUCCESS",
    },
  });

  await prisma.notification.create({
    data: {
      userId: participant.id,
      title: "Review Update",
      message: "Your submission 'Federated Learning for Privacy-Preserving Healthcare Analytics' has received reviewer feedback. Revision requested.",
      type: "WARNING",
    },
  });

  await prisma.notification.create({
    data: {
      userId: reviewer.id,
      title: "New Review Assignment",
      message: "You have been assigned to review 'Edge-Cloud Collaborative Inference for Real-Time Object Detection'. Due: Feb 20, 2026.",
      type: "INFO",
    },
  });

  await prisma.notification.create({
    data: {
      userId: committee.id,
      title: "Pending Decision",
      message: "Submission 'Federated Learning for Privacy-Preserving Healthcare Analytics' has completed reviews and is awaiting your decision.",
      type: "WARNING",
    },
  });

  // ─── Volunteers ───
  await prisma.volunteer.create({
    data: {
      userId: operations.id,
      name: "Student Volunteer A",
      email: "volunteer1@icrace2026.edu",
      phone: "+91 98765 43220",
      role: "REGISTRATION_DESK",
      assignedDay: 1,
    },
  });

  await prisma.volunteer.create({
    data: {
      userId: operations.id,
      name: "Student Volunteer B",
      email: "volunteer2@icrace2026.edu",
      phone: "+91 98765 43221",
      role: "SESSION_COORDINATOR",
      assignedDay: 2,
    },
  });

  // ─── Contact Enquiries ───
  await prisma.contactEnquiry.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      subject: "Registration Query",
      message: "Is the early bird registration still available?",
    },
  });

  console.log("Seed completed successfully!");
  console.log("\n=== DEMO ACCOUNTS (Password: Demo@1234 for all) ===");
  console.log("Super Admin:     admin@icrace2026.edu");
  console.log("Finance:        finance@icrace2026.edu");
  console.log("Operations:     operations@icrace2026.edu");
  console.log("Reviewer:       reviewer@icrace2026.edu");
  console.log("Reviewer 2:     reviewer2@icrace2026.edu");
  console.log("Committee:      committee@icrace2026.edu");
  console.log("Participant:     participant@icrace2026.edu");
  console.log("Participant 2:   participant2@icrace2026.edu");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
