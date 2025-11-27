import React from 'react';

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUCTS',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  JOBS = 'JOBS',
  NEW_PRODUCT = 'NEW_PRODUCT',
  NEW_JOB = 'NEW_JOB',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrls: string[];
  category: string;
  createdAt: number;
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

export interface NavItem {
  label: string;
  view: ViewState;
  icon: React.ComponentType<any>;
}