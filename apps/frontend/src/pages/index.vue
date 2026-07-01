<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated style="background: #6777ef">
      <!-- menu -->
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- title -->
        <q-toolbar-title> AI Assistant Study </q-toolbar-title>

        <!-- icon -->
        <q-btn flat round dense icon="search" />
        <q-btn flat round dense icon="notifications" @click="notify = true"
          ><q-badge color="red" floating transparent> 4 </q-badge></q-btn
        >
        <!-- separator -->
        <q-separator vertical inset class="q-mx-md" color="white" />

        <!-- profile -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar size="32px">
              <img src="/icons/picture.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ authStore.user?.name }}</q-item-label>
          </q-item-section>

          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width: 220px">
              <!-- ข้อมูลผู้ใช้ -->
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="40px">
                    <img src="/icons/picture.jpg" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">
                    {{ authStore.user?.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ authStore.user?.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- โปรไฟล์ -->
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>

                <q-item-section> Profile </q-item-section>
              </q-item>

              <!-- Logout -->
              <q-item clickable v-close-popup @click="authStore.logout()">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>

                <q-item-section class="text-negative"> Logout </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- notification dialog  -->
        <q-dialog v-model="notify">
          <q-card>
            <q-card-section>
              <div class="text-h6">All Notifications</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              This is a notification message. In the future, you can implement a
              notification system to display real-time updates or alerts to the
              user.
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.label"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EssentialLink, {
  type EssentialLinkProps
} from "@/components/EssentialLink.vue";
import { useAuthStore } from "@/stores/authStore";

const notify = ref(false);
const authStore = useAuthStore();
const linksList: EssentialLinkProps[] = [
  {
    label: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev"
  },
  {
    label: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework"
  },
  {
    label: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev"
  },
  {
    label: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev"
  },
  {
    label: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev"
  },
  {
    label: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev"
  },
  {
    label: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev"
  }
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
