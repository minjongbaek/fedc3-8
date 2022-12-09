<script setup>
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '../components/loadingSpinner.vue'
import { request } from '~/util/fetch'

const route = useRoute()
const keyword = computed(() => route.query.keyword)

const movies = ref([])
const page = ref(1)
const totalItemCount = ref(0)

const isNextPage = computed(() => movies.value.length < totalItemCount.value)
const isLoading = ref(false)


const $movieItems = ref([])
let observer = null

const fetchMovies = async () => {
  isLoading.value = true

  const res = await request(`s=${keyword.value}&page=${page.value}`)

  const { Search, totalResults, Response } = res
  if (Response === 'True') {
    const $lastItems = $movieItems.value[$movieItems.value.length - 1]
    if ($lastItems && observer) observer.unobserve($lastItems)

    movies.value.push(...Search)
    totalItemCount.value = totalResults
    page.value += 1
  } else {
    movies.value.splice(0)
    totalItemCount.value = 0
    page.value = 1
  }
  isLoading.value = false
}

const intersectionHandler = (entry) => {
  if (!entry.isIntersecting) return
  if (!isNextPage.value) return
  fetchMovies()
}

onMounted(() => {
  fetchMovies()
  try {
    observer = new IntersectionObserver((entries) => {
      intersectionHandler(entries[0])
    }, {
      root: null,
      threshold: 0.5
    })
    if (movies.value.length !== 0) observer.observe($movieItems.value[$movieItems.value.length - 1])
  } catch (error) {
    console.error(error)
  }
})

onUpdated(() => {
  if (!observer) return
  if (movies.value.length !== 0) observer.observe($movieItems.value[$movieItems.value.length - 1])
})

watch(() => route.query, () => {
  movies.value.splice(0)
  fetchMovies()
})

</script>


<template>
  <div v-if="(movies.length >= 1)">
    <ul class="movie__list">
      <li
        v-for="movie in movies"
        ref="$movieItems"
        :key="movie.imdbID"
        class="movie__item">
        <RouterLink :to="`/movie/${movie.imdbID}`">
          <div class="movie__item__image">
            <img :src="movie.Poster" />
          </div>
          <div class="movie__item__info">
            <span class="movie__item__info__title">
              {{ movie.Title }}
            </span>
            <span class="movie__item__info__type">{{ movie.Type }}, {{ movie.Year }}</span>
          </div>
        </RouterLink>
      </li>
    </ul>
    <LoadingSpinner v-show="true || isLoading" />
  </div>
  <div
    v-else
    class="no-result">
    <h1>No results were found with the {{ keyword }} keyword.</h1>
    <p>Try searching with a different keyword.</p>
  </div>
</template>


<style scoped lang="scss">
.movie__list {
  padding: 0 0 10px 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  .movie__item {
    width: calc(10% - 10px);
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 5px 0;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      opacity: 0.9;
    }

    &__image {
      border-radius: 5px;
      height: 300px;

      img {
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        width: 100%;
        height: 100%;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 5px;
      align-items: center;

      &__title {
        width: 100%;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      &__type {
        font-size: 0.85rem;
      }
    }
  }
}
.no-result {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
</style>
