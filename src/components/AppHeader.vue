<script setup>
import SearchForm from '~/components/SearchForm.vue'

</script>


<template>
  <header>
    <nav class="navbar">
      <div class="container-fluid">
        <RouterLink
          class="nav__item navbar-brand"
          to="/">
          <span class="text-primary">M</span>
          <span class="text-danger">o</span>
          <span class="text-warning">o</span>
          <span class="text-primary">g</span>
          <span class="text-success">l</span>
          <span class="text-primary">e</span>
        </RouterLink>
        <div class="search__form__wrap">
          <SearchForm />
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
  .nav__item {
    font-size: 2rem;
  }
  .search__form__wrap {
    width: 480px;
    position: absolute;
    right: 1rem;
    top: 25%;
    z-index: 10;
  }
</style>
