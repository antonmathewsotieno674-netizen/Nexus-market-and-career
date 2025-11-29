import React from 'react';

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUCTS',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  JOBS = 'JOBS',
  NEW_PRODUCT = 'NEW_PRODUCT',
  NEW_JOB = 'NEW_JOB',
  APPLICATIONS = 'APPLICATIONS',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  MESSAGES = 'MESSAGES'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  category: string;
  createdAt: number;
  seller?: Seller;
  rating?: number;
  reviewCount?: number;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  description: string;
  createdAt: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantName: string;
  email: string;
  coverLetter?: string;
  status: 'Pending' | 'Reviewed' | 'Interview' | 'Rejected';
  appliedAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  participants: User[]; // Array of users involved (usually 2)
  productId?: string; // Optional context
  productName?: string;
  messages: Message[];
  lastMessage?: Message;
  updatedAt: number;
}

export interface NavItem {
  label: string;
  view: ViewState;
  icon: React.ComponentType<any>;
}