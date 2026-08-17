import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PageContainer>{children}</PageContainer>;
};
