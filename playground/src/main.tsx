import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import { App } from './App';
import { BlogPage } from '@/blocks/blog-page';
import { BudgetingLandingPage } from '@/blocks/budgeting-landing-page';
import { BudgetingExplorationsPage } from '@/blocks/budgeting-explorations-page';
import { FileUploadStudiesPage } from '@/blocks/file-upload-studies-page';
import { FinanceBlocksPage } from '@/blocks/finance-blocks-page';
import { PersonalWebsitePage } from '@/blocks/personal-website';
import './index.css';

const Page = window.location.pathname.startsWith('/file-upload-studies')
  ? FileUploadStudiesPage
  : window.location.pathname.startsWith('/budgeting-explorations')
  ? BudgetingExplorationsPage
  : window.location.pathname.startsWith('/finance-blocks')
  ? FinanceBlocksPage
  : window.location.pathname.startsWith('/budgeting')
  ? BudgetingLandingPage
  : window.location.pathname.startsWith('/personal-website')
  ? PersonalWebsitePage
  : window.location.pathname.startsWith('/blog')
    ? BlogPage
    : App;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
