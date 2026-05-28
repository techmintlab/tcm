export const siteConfig = {
  name: "TechMintLab",
  description:
    "Premium software marketplace and digital product platform. Build Faster. Scale Smarter.",
  tagline: "Build Faster. Scale Smarter.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://techmintlab.com",
  ogImage: "/logo.png",
  logo: "/logo.png",
  links: {
    twitter: "https://twitter.com/techmintlab",
    github: "https://github.com/techmintlab",
    linkedin: "https://linkedin.com/company/techmintlab",
  },
  contact: {
    email: "hello@techmintlab.com",
    phone: "+91-XXXXXXXXXX",
    address: "Bengaluru, Karnataka, India",
  },
};

export const mainNavItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Services",
    href: "/services",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export const servicesList = [
  {
    title: "Web Development",
    slug: "web-development",
    description:
      "Custom web applications built with cutting-edge technologies for optimal performance and user experience.",
    icon: "Globe",
    features: [
      "React & Next.js Applications",
      "Progressive Web Apps",
      "E-commerce Platforms",
      "Enterprise Portals",
      "Real-time Applications",
    ],
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "PostgreSQL"],
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences.",
    icon: "Smartphone",
    features: [
      "iOS & Android Apps",
      "React Native Development",
      "Flutter Applications",
      "App Maintenance",
      "UI/UX Design",
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
  },
  {
    title: "SaaS Development",
    slug: "saas-development",
    description:
      "End-to-end SaaS platform development with multi-tenant architecture and subscription management.",
    icon: "Cloud",
    features: [
      "Multi-tenant Architecture",
      "Subscription Management",
      "Analytics Dashboard",
      "API Development",
      "Payment Integration",
    ],
    technologies: ["Next.js", "Node.js", "AWS", "Stripe", "Redis"],
  },
  {
    title: "CRM/ERP Development",
    slug: "crm-erp-development",
    description:
      "Custom CRM and ERP solutions to streamline your business operations and boost productivity.",
    icon: "LayoutDashboard",
    features: [
      "Custom CRM Systems",
      "ERP Solutions",
      "Inventory Management",
      "HR Management",
      "Reporting & Analytics",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "GraphQL"],
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description:
      "Beautiful, intuitive interfaces designed with user-centered design principles.",
    icon: "Palette",
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Visual Design",
      "Design Systems",
    ],
    technologies: ["Figma", "Adobe XD", "Sketch", "Framer", "Tailwind CSS"],
  },
  {
    title: "AI Solutions",
    slug: "ai-solutions",
    description:
      "Harness the power of artificial intelligence to transform your business.",
    icon: "Brain",
    features: [
      "Machine Learning Models",
      "Natural Language Processing",
      "Computer Vision",
      "AI Chatbots",
      "Predictive Analytics",
    ],
    technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI", "LangChain"],
  },
  {
    title: "DevOps",
    slug: "devops",
    description:
      "Streamline your development workflow with comprehensive DevOps solutions.",
    icon: "Server",
    features: [
      "CI/CD Pipeline Setup",
      "Cloud Infrastructure",
      "Container Orchestration",
      "Monitoring & Logging",
      "Security Automation",
    ],
    technologies: ["Docker", "Kubernetes", "AWS", "GitHub Actions", "Terraform"],
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Data-driven digital marketing strategies to grow your online presence.",
    icon: "TrendingUp",
    features: [
      "SEO Optimization",
      "Social Media Marketing",
      "Content Marketing",
      "Email Marketing",
      "Analytics & Reporting",
    ],
    technologies: ["Google Analytics", "SEMrush", "HubSpot", "Mailchimp", "WordPress"],
  },
  {
    title: "SEO Services",
    slug: "seo-services",
    description:
      "Comprehensive SEO services to improve your search rankings and organic traffic.",
    icon: "Search",
    features: [
      "Technical SEO",
      "On-page Optimization",
      "Content Strategy",
      "Link Building",
      "Local SEO",
    ],
    technologies: ["Ahrefs", "Moz", "Google Search Console", "Screaming Frog"],
  },
];

export const technologiesList = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "GraphQL", category: "API" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
  { name: "React Native", category: "Mobile" },
  { name: "Flutter", category: "Mobile" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Figma", category: "Design" },
  { name: "Redis", category: "Database" },
  { name: "TensorFlow", category: "AI" },
  { name: "OpenAI", category: "AI" },
];
