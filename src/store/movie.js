import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { request } from '~/util/fetch'

export const useMovieStore = defineStore('movie', () => {
  const movies = ref([])
  const keyword = ref('')
  const page = ref(1)
  const totalItemCount = ref(0)
  const isNextPage = computed(() => movies.value.length < totalItemCount.value)
  const slicedMovies = computed(() => movies.value.slice(0, 10))

  const fetchMovies = async () => {
    const res = await request(`s=${keyword.value}&page=${page.value}`)

    const { Search, totalResults, Response } = res
    if (Response === 'True') {
      movies.value.push(...Search)
      totalItemCount.value = totalResults
    } else {
      movies.value.splice(0)
      totalItemCount.value = 0
    }
  }

  const increasePage = () => {
    page.value += 1
  }

  const setKeyword = (value) => {
    keyword.value = value
  }

  const clearStore = () => {
    movies.value.splice(0)
    page.value = 1
    totalItemCount.value = 0
  }

  return { movies, keyword, page, totalItemCount, isNextPage, slicedMovies, fetchMovies, increasePage, setKeyword, clearStore }
})
