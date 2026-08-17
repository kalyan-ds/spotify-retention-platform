export const revenueData = {
  kpis: {
    totalRevenue: { value: '$442M', trend: { value: '+16.1%', direction: 'up' as const } },
    mrr: { value: '$6.8M', trend: { value: '+11.2%', direction: 'up' as const } },
    arr: { value: '$81.6M', trend: { value: '+11.2%', direction: 'up' as const } },
    premiumRevenue: { value: '$5.82M', trend: { value: '+14.7%', direction: 'up' as const } },
    arpu: { value: '$4.71', trend: { value: '+7.3%', direction: 'up' as const } },
    avgLtv: { value: '$158', trend: { value: '+4.7%', direction: 'up' as const } },
  },
  revenueTrend: [
    { month: 'Jan', mrr: 4.2, arr: 50 },
    { month: 'Feb', mrr: 4.5, arr: 54 },
    { month: 'Mar', mrr: 4.8, arr: 57 },
    { month: 'Apr', mrr: 5.1, arr: 61 },
    { month: 'May', mrr: 5.4, arr: 64 },
    { month: 'Jun', mrr: 5.8, arr: 69 },
    { month: 'Jul', mrr: 6.1, arr: 73 },
    { month: 'Aug', mrr: 6.4, arr: 76 },
    { month: 'Sep', mrr: 6.8, arr: 81.6 },
  ],
  revenueBySegment: [
    { segment: 'Premium', revenue: 6.8 },
    { segment: 'Student', revenue: 1.2 },
    { segment: 'Family', revenue: 2.1 },
    { segment: 'Free', revenue: 0.5 },
  ],
  revenueByDevice: [
    { device: 'iOS', revenue: 58.4, growth: '+12.1%' },
    { device: 'Android', revenue: 31.2, growth: '+18.4%' },
    { device: 'Web', revenue: 21.8, growth: '+6.7%' },
    { device: 'Desktop', revenue: 12.4, growth: '+4.2%' },
    { device: 'Smart TV', revenue: 8.1, growth: '+22.8%' },
  ]
};
