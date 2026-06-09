export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  period: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  maxEmployees: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface CartItem {
  plan: Plan;
  quantity: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  employees: string;
  message: string;
}
