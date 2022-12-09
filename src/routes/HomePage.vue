<script setup>
import SearchForm from '../components/SearchForm.vue'

</script>


<template>
  <div class="home__page">
    <h1 class="home__page__title">
      <span class="text-primary">M</span>
      <span class="text-danger">o</span>
      <span class="text-warning">o</span>
      <span class="text-primary">g</span>
      <span class="text-success">l</span>
      <span class="text-primary">e</span>
    </h1>
    <p>Are you looking for a movie?</p>
    <p>I'll search for the movie you want.</p>
    <div class="search__form__wrap">
      <SearchForm />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home__page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  
  &__title {
    margin-top: 50px;
    font-size: 4rem;
  }

  .search__form__wrap {
    width: 600px;
    padding: 2px;
  }
}

</style>
