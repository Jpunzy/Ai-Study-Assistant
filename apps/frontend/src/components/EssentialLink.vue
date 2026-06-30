<template>
  <!-- ลิงก์ภายใน: ใช้ Vue Router -->
  <q-item v-if="isInternal" clickable :to="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>

  <!-- ลิงก์ภายนอก: เปิด tab ใหม่ -->
  <q-item v-else clickable tag="a" :href="link" target="_blank">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from "vue";

export interface EssentialLinkProps {
  label: string;
  caption?: string;
  link?: string;
  icon?: string;
}

const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: "",
  link: "#",
  icon: ""
});

// ลิงก์ที่ขึ้นต้นด้วย / คือ internal route
const isInternal = computed(() => props.link?.startsWith("/"));
</script>
