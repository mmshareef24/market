import { Campaign, AudienceSegment, CampaignTemplate } from '../types';

const initialCampaigns: Campaign[] = [];

export const mockAudiences: AudienceSegment[] = [];

export const mockTemplates: CampaignTemplate[] = [];

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

export const mockCampaigns = initialCampaigns;
