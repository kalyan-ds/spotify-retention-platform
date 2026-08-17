export interface CountryRevenue {
  country: string;
  code: string;
  revenue: number;
  percentage: number;
}

export interface TierDistribution {
  tier: string;
  percentage: number;
  color: string;
}

export interface DeviceDistribution {
  device: string;
  percentage: number;
  color: string;
}

export const overviewData = {
  revenueByCountry: [
    { country: 'United States', code: 'US', revenue: 142.4, percentage: 35 },
    { country: 'United Kingdom', code: 'UK', revenue: 38.7, percentage: 15 },
    { country: 'Germany', code: 'DE', revenue: 29.3, percentage: 12 },
    { country: 'Brazil', code: 'BR', revenue: 21.8, percentage: 8 },
    { country: 'India', code: 'IN', revenue: 18.2, percentage: 6 },
  ] as CountryRevenue[],
  premiumVsFree: [
    { tier: 'Premium', percentage: 45, color: '#1ed760' },
    { tier: 'Free', percentage: 32, color: '#3b82f6' },
    { tier: 'Student', percentage: 15, color: '#f59e0b' },
    { tier: 'Family', percentage: 8, color: '#eab308' },
  ] as TierDistribution[],
  topDevices: [
    { device: 'iOS', percentage: 38, color: '#1ed760' },
    { device: 'Android', percentage: 31, color: '#3b82f6' },
    { device: 'Web', percentage: 19, color: '#f59e0b' },
    { device: 'Desktop', percentage: 8, color: '#eab308' },
    { device: 'Smart TV', percentage: 4, color: '#a855f7' },
  ] as DeviceDistribution[],
  countryIntelligence: [
    { country: 'United States', code: 'UN', revenue: 142.4, retention: 89.2, premiumPct: 68, churn: 10.8, yoyGrowth: 12.4 },
    { country: 'United Kingdom', code: 'UK', revenue: 38.7, retention: 87.1, premiumPct: 61, churn: 12.9, yoyGrowth: 9.1 },
    { country: 'Germany', code: 'GE', revenue: 29.3, retention: 88.4, premiumPct: 63, churn: 11.6, yoyGrowth: 8.7 },
    { country: 'Brazil', code: 'BR', revenue: 21.8, retention: 79.6, premiumPct: 34, churn: 20.4, yoyGrowth: 18.2 },
    { country: 'India', code: 'IN', revenue: 18.2, retention: 91.4, premiumPct: 29, churn: 8.6, yoyGrowth: 34.7 },
  ]
};
