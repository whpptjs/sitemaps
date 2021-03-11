<template>
  <div class="whppt-dashboard__wrapper">
    <div class="whppt-dashboard__sitemap">
      <div class="whppt-filters-wrapper">
        <whppt-button v-if="!filtersVisible" class="whppt-filters-button" @click="filtersVisible = true">
          Show Filters
        </whppt-button>
      </div>
      <whppt-table
        :headers="headers"
        :items="items"
        dense
        :page.sync="page"
        :per-page.sync="size"
        :total="total"
        @update:page="fetchSitemap()"
        @update:perPage="fetchSitemap(true)"
      >
        <template v-slot:item.slug="{ item }">
          <a class="whppt-sitemap__slug" href="javascript:void(0);" @click="viewPage(item.slug)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              focusable="false"
              role="img"
              width="1rem"
              height="1rem"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
              style="transform: rotate(360deg)"
            >
              <path
                d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"
                fill="currentColor"
              ></path>
            </svg>
            {{ item.slug }}
          </a>
        </template>
        <template v-slot:item.published="{ item }">
          <component
            :is="item.published ? 'check-icon' : 'close-icon'"
            :style="`color: ${item.published ? 'green' : 'red'}`"
          />
        </template>
        <template v-slot:item.canPublish="{ item }">
          <component
            :is="item.canPublish ? 'check-icon' : 'close-icon'"
            :style="`color: ${item.canPublish ? 'green' : 'red'}`"
          />
        </template>
      </whppt-table>
    </div>
    <whppt-drawer :active="filtersVisible" position="right">
      <div class="whppt-sitemap__filters">
        <div class="whppt-filters-wrapper">
          <whppt-button class="whppt-filters-button" @click="filtersVisible = false">Hide Filters</whppt-button>
        </div>
        <whppt-input
          id="dashboard-filter-slug"
          v-model="filters.slug"
          class="whppt-dashboard__filter"
          label="Slug"
          placeholder="/about"
          clearable
          @input="fetchSitemap(true)"
        ></whppt-input>
        <whppt-select
          id="dashboard-filter-page-type"
          v-model="filters.pageType"
          class="whppt-dashboard__filter"
          :items="pageTypes"
          label="Page Type"
          placeholder="All Page Types"
          @input="fetchSitemap(true)"
        ></whppt-select>
        <whppt-select
          id="dashboard-filter-frequency"
          v-model="filters.frequency"
          class="whppt-dashboard__filter"
          label="Frequency"
          placeholder="All Frequencies"
          :items="frequencies"
          @change="fetchSitemap(true)"
        ></whppt-select>
        <whppt-input
          id="dashboard-filter-priority"
          v-model="filters.priority"
          class="whppt-dashboard__filter"
          label="Priority"
          placeholder="eg. 1"
          type="number"
          min="0"
          max="1"
          step="0.1"
          @input="fetchSitemap(true)"
        ></whppt-input>
        <whppt-select
          id="dashboard-filter-publishable"
          v-model="filters.publishableByYou"
          class="whppt-dashboard__filter"
          :items="publishableByYouOptions"
          label="Publishable By You"
          placeholder="Any"
          @input="fetchSitemap(true)"
        ></whppt-select>
        <div style="display: flex">
          <whppt-date-picker
            v-model="filters.lastModFrom"
            label="Last Modified From"
            placeholder="Select a date"
            :max-date="filters.lastModTo ? filters.lastModTo : undefined"
            @input="fetchSitemap(true)"
          ></whppt-date-picker>
          <whppt-spacer :width="1"></whppt-spacer>
          <whppt-date-picker
            v-model="filters.lastModTo"
            label="Last Modified To"
            placeholder="Select a date"
            :min-date="filters.lastModFrom ? filters.lastModFrom : undefined"
            @input="fetchSitemap(true)"
          ></whppt-date-picker>
        </div>
      </div>
    </whppt-drawer>
  </div>
</template>

<script>
/* eslint-disable import/no-unresolved */

import { map, filter, isNil } from 'lodash';
import WhpptTable from '@whppt/nuxt/lib/components/ui/components/Table.vue';
import WhpptButton from '@whppt/nuxt/lib/components/ui/components/Button.vue';
import WhpptInput from '@whppt/nuxt/lib/components/ui/components/Input.vue';
import WhpptNumberInput from '@whppt/nuxt/lib/components/ui/components/NumberInput.vue';
import WhpptSelect from '@whppt/nuxt/lib/components/ui/components/Select.vue';
import WhpptDrawer from '@whppt/nuxt/lib/components/ui/components/Drawer.vue';
import WhpptSpacer from '@whppt/nuxt/lib/components/ui/components/Spacer.vue';
import WhpptDatePicker from '@whppt/nuxt/lib/components/ui/components/Datepicker.vue';

import CheckIcon from './Icons/Check';
import CloseIcon from './Icons/Close';

export default {
  name: 'SitemapDashboard',
  components: {
    WhpptTable,
    WhpptButton,
    WhpptInput,
    WhpptNumberInput,
    WhpptSelect,
    WhpptDrawer,
    WhpptSpacer,
    WhpptDatePicker,
    CheckIcon,
    CloseIcon,
  },
  data: () => ({
    filtersVisible: false,
    sitemap: undefined,
    page: 1,
    size: 10,
    total: 0,
    filters: {
      frequency: undefined,
      slug: '',
      pageType: '',
      priority: undefined,
      lastModFrom: undefined,
      lastModTo: undefined,
      publishableByYou: undefined,
    },
    headers: [
      { text: 'Slug', align: 'start', value: 'slug' },
      { text: 'Page Type', align: 'start', value: 'pageType' },
      { text: 'Last Modified', align: 'start', value: 'lastmod' },
      { text: 'Last Published', align: 'start', value: 'lastpub' },
      { text: 'Currently Published', align: 'start', value: 'published' },
      { text: 'Publishable By You', align: 'start', value: 'canPublish' },
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

      return map(this.sitemap, page => ({
        slug: page.slug || '/',
        pageType: page.pageType,
        lastmod: page.updatedAt,
        lastpub: page.publishedAt || 'Not set',
        published: Boolean(page.published),
        canPublish: page.publishableByYou,
        changefreq: page.frequency || 'Not set',
        priority: page.priority || 'Not set',
      }));
    },
    pageTypes() {
      return filter(
        map(this.$whppt.plugins, plugin => plugin.pageType && plugin.pageType.name),
        p => !isNil(p)
      );
    },
    publishableByYouOptions() {
      return [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ];
    },
  },
  created() {
    this.fetchSitemap();
  },
  methods: {
    fetchSitemap(resetPage) {
      if (resetPage) this.page = 1;

      return this.$axios
        .$get(`/api/sitemap/filter`, {
          params: {
            page: this.page,
            size: this.size,
            freq: this.filters.frequency,
            slug: this.filters.slug || undefined,
            pageType: this.filters.pageType || undefined,
            priority: this.filters.priority || undefined,
            lastModTo: this.filters.lastModTo || undefined,
            lastModFrom: this.filters.lastModFrom || undefined,
            publishableByYou:
              typeof this.filters.publishableByYou !== 'boolean' ? undefined : this.filters.publishableByYou,
          },
        })
        .then(({ sitemap, total }) => {
          this.sitemap = sitemap;
          this.total = total;
        });
    },
    viewPage(slug) {
      this.$emit('closed');
      this.$router.push(slug.startsWith('/') ? slug : `/${slug}`);
    },
  },
};
</script>

<style lang="scss" scoped>
$primary-600: #5a67d8;

.whppt-dashboard__wrapper {
  display: flex;
}

.whppt-sitemap__filters {
  padding: 1rem;
}

.whppt-dashboard__sitemap {
  padding: 1rem;
  width: 100%;

  .whppt-dashboard__filter {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
}

.whppt-sitemap__slug {
  display: flex;

  svg {
    margin-right: 0.5rem;
  }

  &:hover,
  &:focus {
    color: $primary-600;
    text-decoration: underline;
  }
}

.whppt-filters-wrapper {
  min-height: 3rem;
  width: 100%;
}

.whppt-filters-button {
  margin-left: auto;
  margin-bottom: 0.5rem;
}
</style>
