<script setup>
import AppHeader from './components/AppHeader'
import './scss/main.scss'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isHomePage = computed(() => route.path === '/')
</script>

<template>
  <AppHeader v-if="!isHomePage" />
  <RouterView />
</template>
