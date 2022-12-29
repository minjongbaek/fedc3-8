<script setup>
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { request } from '~/util/fetch'
import LoadingSpinner from '~/components/LoadingSpinner.vue'

const route = useRoute()

const movieItemsElement = ref([])
const lastMovieItemElement = computed(() => movieItemsElement.value[movieItemsElement.value.length - 1])

const movies = ref([])
const page = ref(1)
const totalItemCount = ref(0)
const isLoading = ref(false)
const isResult = ref(true)

const keyword = computed(() => route.query.keyword)
const isNextPage = computed(() => movies.value.length < totalItemCount.value)

let observer = null

const fetchMovies = async () => {
  isLoading.value = true
  const res = await request('search', { s: keyword.value, page: page.value })
  const { Search, totalResults, Response } = res
  if (Response === 'True') {
    unobserve()
    movies.value.push(...Search)
    totalItemCount.value = totalResults
    isResult.value = true
    page.value += 1
  } else {
    movies.value.splice(0)
    totalItemCount.value = 0
    isResult.value = false
    page.value = 1
  }
  isLoading.value = false
}

const observe = () => {
  if (!observer) return
  if (lastMovieItemElement.value) observer.observe(lastMovieItemElement.value)
}

const unobserve = () => {
  if (!observer) return
  if (lastMovieItemElement.value) observer.unobserve(lastMovieItemElement.value)
}

const intersectionHandler = (entry) => {
  if (!entry.isIntersecting) return
  if (!isNextPage.value) return
  fetchMovies()
}

watch(() => route.query, () => {
  movies.value.splice(0)
  fetchMovies()
})

onMounted(() => {
  fetchMovies()
  try {
    observer = new IntersectionObserver((entries) => {
      intersectionHandler(entries[0])
    }, {
      root: null,
      threshold: 0.5
    })
    observe()
  } catch (error) {
    console.error(error)
  }
})

onUpdated(() => {
  observe()
})
</script>

<template>
  <div v-if="isResult">
    <ul class="movie__list">
      <li
        v-for="movie in movies"
        ref="movieItemsElement"
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
    <LoadingSpinner v-show="isLoading" />
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
    width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 5px 0;
    border-radius: 5px;

    @media screen and (min-width:576px) {
      width: calc(50% - 10px);
    }

    @media screen and (min-width:768px) {
      width: calc(25% - 10px);
    }

    @media screen and (min-width:992px) {
      width: calc(20% - 10px);
    }

    @media screen and (min-width:1200px) {
      width: calc(10% - 10px);
    }

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
