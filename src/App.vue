<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>

    <v-main>
     <template>
      <div id="app">
        <v-container>
          <v-row no-gutters>
            <v-col xl="1" lg="1" md="1" cols="12">
              <router-link class="navbar-item" :to='{name: "List"}'>List</router-link>
            </v-col>
            <v-col xl="1" lg="1" md="1" cols="12">
              <router-link class="navbar-item" :to='{name: "New"}'>Create</router-link>
            </v-col>
          </v-row>
          <router-view/>
        </v-container>
      </div>
    </template>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
