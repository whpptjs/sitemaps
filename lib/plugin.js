import Dashboard from './components/Dashboard';

export default async function ({}) {
  await $whppt.addPlugin({
    name: 'SitemapDashboard',
    dashboard: {
      name: 'sitemapDashboard',
      label: 'Sitemap',
      component: Dashboard,
    },
  });
}
