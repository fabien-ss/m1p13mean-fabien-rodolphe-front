import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-widget',
  template: `
    <div
      class="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
    >
      <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">
        Akoor admin dashboard
      </h3>
       <p class="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        <strong> Who we are?</strong>
      </p>
      <p class="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        RAKOTO-HARISOA Rodolphe Yoann
        <br>
        RAKOTOMANANA Andriniaina Fabien
      </p>
      <p class="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Carrefuly read the documentation
      </p>
     
      <a
        href="https://docs.google.com/document/d/1L5qlSYZcSuBEyW3nSOg2dsT0k9lu-WP6mWbUrscsKM8/edit?usp=sharing"
        target="_blank"
        rel="nofollow"
        class="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Documentation
      </a>
    </div>
  `
})
export class SidebarWidgetComponent {} 