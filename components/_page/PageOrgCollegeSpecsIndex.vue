<template>
  <PageOrganization type="college">
    <PageOrganizationSpecs>
      <PageOrganizationSpec :level="{ title: 'Все специальности', slug: 'all' }" />
    </PageOrganizationSpecs>
  </PageOrganization>
</template>

<script setup>
import PageOrganization from '~/components/_page/PageOrganization.vue';
import PageOrganizationSpecs from '~/components/_page/PageOrganizationSpecs.vue';
import PageOrganizationSpec from '~/components/_page/PageOrganizationSpec.vue';
</script>