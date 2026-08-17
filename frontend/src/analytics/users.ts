export const usersData = {
  kpis: {
    activeUsers: { value: '248M', trend: { value: '+8.4%', direction: 'up' as const } },
    avgSession: { value: '32m', trend: { value: '+4.1%', direction: 'up' as const } },
    listeningHrs: { value: '2.7h', trend: { value: '+6.2%', direction: 'up' as const } },
    addictionScore: { value: '74.2', trend: { value: '+3.8%', direction: 'up' as const } },
    userValueScore: { value: '8.4', trend: { value: '+1.2%', direction: 'up' as const } },
    engagementScore: { value: '81.3', trend: { value: '+5.1%', direction: 'up' as const } },
  },
  ageDistribution: [
    { age: '13-17', count: 12 },
    { age: '18-24', count: 28 },
    { age: '25-34', count: 35 },
    { age: '35-44', count: 18 },
    { age: '45-54', count: 12 },
    { age: '55+', count: 8 },
  ],
  genderDistribution: [
    { gender: 'Male', percentage: 54, color: '#3b82f6' },
    { gender: 'Female', percentage: 41, color: '#ec4899' },
    { gender: 'Other', percentage: 5, color: '#eab308' },
  ]
};
