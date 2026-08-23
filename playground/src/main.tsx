import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import { App } from './App';
import { BlogPage } from '@/blocks/blog-page';
import { BudgetingLandingPage } from '@/blocks/budgeting-landing-page';
import { PersonalWebsitePage } from '@/blocks/personal-website';
import './index.css';

const Page = window.location.pathname.startsWith('/budgeting')
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
