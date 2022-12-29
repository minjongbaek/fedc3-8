<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { request } from '~/util/fetch'
import { debounce } from 'lodash-es'
import LoadingSpinner from '~/components/LoadingSpinner.vue'

const $input = ref('')

const router = useRouter()
const route = useRoute()

const movies = ref([])
const keyword = ref('')
const isFocusInput = ref(false)
const isLoading = ref(false)

const onKeydownHandler = debounce(($event) => {
  if ($event.key === 'Enter') return
  movies.value.splice(0)
  fetchMovies()
}, 300)

const fetchMovies = async () => {
  isLoading.value = true
  const res = await request('search', { s: keyword.value })
  const { Search, Response } = res
  if (Response === 'True') movies.value.push(...Search)
  isLoading.value = false
}

const onFocusHandler = ($event) => {
  const { type, relatedTarget } = $event

  // RouterLink 태그로 생성된 a 태그를 클릭했을 때 focusout 되면서 a 태그가 DOM TREE 에서 제거되어 페이지 이동이 안되는 이슈가 있음.
  // 이를 해결하기 위한 코드
  if (relatedTarget?.tagName === 'A') {
    const { pathname, search } = relatedTarget
    if (pathname.indexOf('/search') === 0) router.push(pathname + search)
    if (pathname.indexOf('/movie') === 0) router.push(pathname)
  }
  if (type === 'focusin') {
    isFocusInput.value = true
  } else {
    isFocusInput.value = false
  }
}

const onSubmit = () => {
  $input.value.blur()
  if (route.query.keyword === keyword.value) return
  router.push(`/search?keyword=${keyword.value}`)
}
</script>

<template>
  <div class="search__form border border-secondary">
    <form
      class="d-flex"
      @submit.prevent="onSubmit">
      <input
        ref="$input"
        v-model.trim="keyword"
        class="form-control shadow-none border-0"
        type="search"
        placeholder="Search"
        @focusin="onFocusHandler"
        @focusout="onFocusHandler"
        @keydown="onKeydownHandler" />
    </form>
    <div
      v-if="isFocusInput"
      class="search__preview">
      <LoadingSpinner
        v-show="isLoading"
        class="w-100" />
      <ul class="search__preview__list">
        <li
          v-for="movie in movies"
          :key="movie.imdbID"
          class="search__preview__item border border-secondary">
          <RouterLink :to="`/movie/${movie.imdbID}`">
            <div class="movie__poster">
              <img :src="movie.Poster" />
            </div>
            <div class="movie__info">
              <span class="movie__info__title">{{ movie.Title }}</span>
              <span class="movie__info__type">{{ movie.Type }}, {{ movie.Year }}</span>
            </div>
          </RouterLink>
        </li>
      </ul>
      <div class="w-100 text-center">
        <RouterLink :to="`/search?keyword=${keyword}`">
          More Search
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
input {
  padding: 0 0.65rem;
}

.search__form {
  width: 100%;
  border-radius: 12px;
  padding: 5px;
  box-shadow: 0px 0px 1px 0;
  background-color: white;
}

.search__preview {
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: baseline;
    gap: 10px;
    border-radius: 6px;
  }

  &__item {
    width: calc(50% - 10px);
    display: flex;
    gap: 10px;
    padding: 10px 0;
    border-radius: 10px;
    box-shadow: 1px 1px 3px 0;

    &:first-child {
      margin-top: 5px;
    }

    &:last-child {
      margin-bottom: 5px;
    }

    &:hover {
      cursor: pointer;
      opacity: calc(0.8);
    }

    a {
      display: flex;
      gap: 10px;
    }

    .movie__poster {
      width: 60px;
      height: 85px;
      margin-left: 10px;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .movie__info {
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: center;
      font-size: 0.85rem;

      &__type {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
