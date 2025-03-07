// Type definitions for the portfolio component

export interface TechItem {
  name: string;
  icon: string;
}

export interface TechCategory {
  category: string;
  items: TechItem[];
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  href: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  demoUrl: string;
  detailsUrl: string;
}
