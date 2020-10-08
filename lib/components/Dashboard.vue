<template>
  <div class="whppt-dashboard__sitemap">
    <div class="flex">
      <whppt-input
        id="dashboard-filter-slug"
        v-model="filters.slug"
        class="whppt-dashboard__filter"
        label="Slug"
        placeholder="/about"
        @input="fetchSitemap"
      ></whppt-input>
      <whppt-input
        id="dashboard-filter-page-type"
        v-model="filters.pageType"
        class="whppt-dashboard__filter"
        label="Page Type"
        placeholder="Generic"
        @input="fetchSitemap"
      ></whppt-input>
      <whppt-select
        id="dashboard-filter-frequency"
        v-model="filters.frequency"
        class="whppt-dashboard__filter"
        label="Frequency"
        placeholder="All"
        :items="frequencies"
        @change="fetchSitemap"
      ></whppt-select>
      <whppt-input
        id="dashboard-filter-lastmod"
        class="whppt-dashboard__filter"
        label="Last Modified"
        placeholder="eg. 11/11/2020"
      ></whppt-input>
      <whppt-input
        id="dashboard-filter-priority"
        class="whppt-dashboard__filter"
        label="Priority"
        placeholder="eg. 1"
      ></whppt-input>
    </div>
    <whppt-table
      :headers="headers"
      :items="items"
      dense
      :page.sync="page"
      :per-page.sync="size"
      :total="total"
      @update:page="fetchSitemap"
      @update:perPage="fetchSitemap"
    ></whppt-table>
  </div>
</template>

<script>
import WhpptTable from '@whppt/nuxt/lib/components/ui/Table.vue';
import WhpptButton from '@whppt/nuxt/lib/components/ui/Button.vue';
import WhpptInput from '@whppt/nuxt/lib/components/ui/Input.vue';
import WhpptSelect from '@whppt/nuxt/lib/components/ui/Select.vue';

export default {
  name: 'SitemapDashboard',
  components: {
    WhpptTable,
    WhpptButton,
    WhpptInput,
    WhpptSelect,
  },
  created() {
    this.fetchSitemap();
  },
  data: () => ({
    sitemap: undefined,
    page: 1,
    size: 10,
    total: 0,
    filters: {
      // non-existent
      editedSince: false,
      publishedSince: false,
      EditedBy: false,
      publishedBy: false,
      // existing
      frequency: undefined,
      slug: '',
      pageType: '',
    },
    headers: [
      { text: 'Slug', align: 'start', value: 'slug' },
      { text: 'Page Type', align: 'start', value: 'pageType' },
      { text: 'Last Modified', align: 'start', value: 'lastmod' },
      { text: 'Last Published', align: 'start', value: 'lastpub' },
      { text: 'Currently Published', align: 'start', value: 'published' },
      { text: 'Publishable by You', align: 'start', value: 'canPublish' },
      { text: 'Change Frequency', align: 'start', value: 'changefreq' },
      { text: 'Priority', align: 'start', value: 'priority' },
    ],
    frequencies: [
      { text: 'Never', value: 'never' },
      { text: 'Yearly', value: 'yearly' },
      { text: 'Monthly', value: 'monthly' },
      { text: 'Weekly', value: 'weekly' },
      { text: 'Daily', value: 'daily' },
      { text: 'Hourly', value: 'hourly' },
      { text: 'Always', value: 'always' },
    ],
  }),
  computed: {
    items() {
      if (!this.sitemap) return [];
      return this.sitemap.map(page => ({
        slug: page.slug || '/',
        pageType: page.pageType ? page.pageType.name : page.pageType,
        lastmod: page.updatedAt,
        lastpub: page.publishedAt || 'Not set',
        published: Boolean(page.published),
        canPublish: page.canAccess,
        changefreq: page.frequency || 'Not set',
        priority: page.priority || 'Not set',
      }));
    },
  },
  methods: {
    fetchSitemap() {
      return this.$axios
        .$get(`/api/sitemap/filter`, {
          params: {
            page: this.page,
            size: this.size,
            freq: this.filters.frequency,
            slug: this.filters.slug || undefined,
            pageType: this.filters.pageType || undefined,
          },
        })
        .then(({ sitemap, total }) => {
          this.sitemap = sitemap;
          this.total = total;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.whppt-dashboard__sitemap {
  padding: 1rem;

  .flex {
    display: flex;
    align-items: center;

    button {
      margin-left: 0.5rem;
    }
  }

  .whppt-dashboard__filter {
    margin-right: 0.5rem;
  }
}
</style>
