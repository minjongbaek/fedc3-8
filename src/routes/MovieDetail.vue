<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { request } from '~/util/fetch'
import LoadingSpinner from '~/components/LoadingSpinner.vue'

const route = useRoute()

const movie = ref({})
const isLoading = ref(false)

const id = computed(() => route.params.id)
const posterUrl = computed(() => movie.value?.Poster?.replace('SX300', 'SX700'))

const fetchMovie = async () => {
  isLoading.value = true
  const res = await request('movie', { i: id.value, plot: 'full' })
  movie.value = { ...res }
  isLoading.value = false
}

const onLoadHandler = ($event) => {
  $event.target.src = posterUrl.value
}

watch(() => route.params, () => {
  fetchMovie()
})

onMounted(() => {
  fetchMovie()
})
</script>

<template>
  <div
    v-if="isLoading"
    class="loading__spinner__wrap">
    <LoadingSpinner />
  </div>
  <div
    v-else
    class="movie__detail__page">
    <div class="movie__poster">
      <img
        :src="movie.Poster"
        @load.once="onLoadHandler" />
    </div>
    <div class="movie__info">
      <h1>{{ movie.Title }}</h1>
      <div>{{ movie.Released }}, {{ movie.Country }}</div>
      <div>
        <div><b>Genre</b></div>
        <div>{{ movie.Genre }}</div>
      </div>
      <div>
        <div><b>Plot</b></div>
        <p>
          {{ movie.Plot }}
        </p>
      </div>
      <div>
        <div><b>Ratings</b></div>
        <div>
          <div
            v-for="rating in movie.Ratings"
            :key="rating.Source">
            {{ rating.Source }} : {{ rating.Value }}
          </div>
        </div>
      </div>
      <div>
        <div><b>Director</b></div>
        <div>{{ movie.Director }}</div>
      </div>
      <div>
        <div><b>Actors</b></div>
        <div>{{ movie.Actors }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading__spinner__wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(0, -50%);
}

.movie__detail__page {
  margin: 40px auto;
  width: 1200px;
  display: flex;
  gap: 40px;
}

.movie__poster {
  width: 500px;
  height: 750px;
  border-radius: 15px;
  flex-shrink: 0;

  img {
    border-radius: inherit;
    width: 100%;
  }
}

.movie__info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
