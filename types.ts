import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export type PlanTier = 'Starter' | 'Growth' | 'Enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: PlanTier;
  avatar?: string;
}

export interface DashboardContext {
  plan: PlanTier;
  setPlan: (plan: PlanTier) => void;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  read: number;
  engagement: number; // percentage
  clicks?: number;
}

export interface AudienceSegment {
  id: string;
  name: string;
  size: number;
  type: 'Dynamic' | 'Static';
  tags: string[];
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  platform: 'WhatsApp' | 'Email' | 'SMS';
  contentPreview: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Draft' | 'Completed' | 'Paused';
  platform: 'WhatsApp' | 'Facebook' | 'Email' | 'Instagram' | 'Multi-Channel';
  goal?: 'Sales' | 'Awareness' | 'Engagement' | 'Retention';
  audience: string; // name of the audience segment
  audienceId?: string;
  startDate: string;
  description?: string;
  metrics: CampaignMetrics;
  automationSteps?: string[];
}

export interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ComponentType<any>;
}

export interface Channel {
    id: string;
    icon: React.ComponentType<any>;
    color: string;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
