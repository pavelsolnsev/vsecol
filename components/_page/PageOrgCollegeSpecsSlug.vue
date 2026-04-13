<template>
  <PageOrganization type="college">
    <PageOrganizationSpecs>
      <template #default="{ level }">
        <PageOrganizationSpec :level="level" />
      </template>
    </PageOrganizationSpecs>
  </PageOrganization>
</template>

<script setup>
import PageOrganization from '~/components/_page/PageOrganization.vue';
import PageOrganizationSpecs from '~/components/_page/PageOrganizationSpecs.vue';
import PageOrganizationSpec from '~/components/_page/PageOrganizationSpec.vue';
</script>