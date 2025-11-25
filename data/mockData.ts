import { Campaign, AudienceSegment, CampaignTemplate } from '../types';

// Initial Data
const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: "Q3 Product Launch",
    status: "Active",
    platform: "WhatsApp",
    goal: "Sales",
    audience: "High Value Customers",
    audienceId: "seg_1",
    startDate: "2024-07-01",
    description: "Primary outreach campaign for the new AI analytics module targeting enterprise tier customers with high LTV.",
    metrics: {
      sent: 12500,
      delivered: 12450,
      read: 9800,
      engagement: 24.5,
      clicks: 3200
    },
    automationSteps: ["Trigger: Tag Added 'Enterprise'", "Action: Send WhatsApp Template 'Launch_V1'", "Delay: 24 Hours", "Condition: If Read -> Send Follow-up"]
  },
  {
    id: '2',
    name: "Newsletter Signup Welcome",
    status: "Paused",
    platform: "Email",
    goal: "Retention",
    audience: "New Subscribers",
    audienceId: "seg_2",
    startDate: "2024-01-15",
    description: "Automated welcome sequence for users who subscribe via the website footer.",
    metrics: {
      sent: 5000,
      delivered: 4900,
      read: 2100,
      engagement: 18.2,
      clicks: 850
    },
    automationSteps: ["Trigger: Form Submission", "Action: Send Email 'Welcome'", "Delay: 3 Days", "Action: Send Email 'Resources'"]
  },
  {
    id: '3',
    name: "Black Friday Early Access",
    status: "Draft",
    platform: "Multi-Channel",
    goal: "Sales",
    audience: "All Users",
    audienceId: "seg_3",
    startDate: "2024-11-20",
    description: "Omnichannel blast to notify users of early access deals. Uses WhatsApp for VIPs and Email for general list.",
    metrics: {
      sent: 0,
      delivered: 0,
      read: 0,
      engagement: 0,
      clicks: 0
    },
    automationSteps: ["Trigger: Date Reached", "Split: VIP Tag", "True: Send WhatsApp", "False: Send Email"]
  },
];

export const mockAudiences: AudienceSegment[] = [
  { id: 'seg_1', name: 'High Value Customers', size: 1240, type: 'Dynamic', tags: ['vip', 'enterprise'] },
  { id: 'seg_2', name: 'New Subscribers', size: 450, type: 'Dynamic', tags: ['new', 'newsletter'] },
  { id: 'seg_3', name: 'All Users', size: 15400, type: 'Static', tags: ['all'] },
  { id: 'seg_4', name: 'Cart Abandoners (24h)', size: 85, type: 'Dynamic', tags: ['abandoned_cart'] },
  { id: 'seg_5', name: 'Inactive Users (90 days)', size: 3200, type: 'Static', tags: ['churn_risk'] },
];

export const mockTemplates: CampaignTemplate[] = [
  { id: 'tmpl_1', name: 'Product Launch V1', description: 'High energy announcement with image header.', platform: 'WhatsApp', contentPreview: '🚀 Introducing our latest feature...' },
  { id: 'tmpl_2', name: 'Welcome Series #1', description: 'Friendly introduction from the CEO.', platform: 'Email', contentPreview: 'Hi {{name}}, Welcome to MarketBridge...' },
  { id: 'tmpl_3', name: 'Discount Offer', description: 'Simple 20% off code for retention.', platform: 'SMS', contentPreview: 'Flash Sale: Use code SAVE20...' },
];

// Simple in-memory store class to handle data persistence during session
class CampaignStore {
  private campaigns: Campaign[];

  constructor() {
    this.campaigns = [...initialCampaigns];
  }

  getAll(): Campaign[] {
    return this.campaigns;
  }

  getById(id: string): Campaign | undefined {
    return this.campaigns.find(c => c.id === id);
  }

  add(campaign: Campaign): void {
    this.campaigns = [campaign, ...this.campaigns];
  }

  update(id: string, updates: Partial<Campaign>): void {
    this.campaigns = this.campaigns.map(c => c.id === id ? { ...c, ...updates } : c);
  }
  
  delete(id: string): void {
      this.campaigns = this.campaigns.filter(c => c.id !== id);
  }
}

export const campaignStore = new CampaignStore();

// Keep backward compatibility for existing imports if any, though we should migrate them
export const mockCampaigns = initialCampaigns; 
