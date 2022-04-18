<template>
  <v-container fluid >
    <v-row no-gutters>
      <v-col>
      <v-snackbar
        :timeout="-1"
        :value="true"
        centered
        absolute
        tile
        v-model="snackbar"
        color="red accent-2"
      >
        {{ snackbarText }}
      </v-snackbar>
      </v-col>
    </v-row>
    <v-row>
      <div class="text-center">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Delete Permission
            </v-card-title>

            <v-card-text>
              Are you sure?
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="callDelete"
              >
                Yes
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="dialog=false"
              >
                No
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-row>
    <v-row no-gutters class="d-sm-block d-md-block d-lg-block d-xl-block" v-if="loadComplete">
      <template>
        <div class="text-center">
          <v-pagination
            v-model="resultObject.currentPage"
            @input="changePage()"
            :length="resultObject.totalCount > 0 ? (resultObject.totalCount/resultObject.size) : 0"
            :total-visible="0"
          ></v-pagination>
        </div>
      </template>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-">
                First Name
              </th>
              <th class="text-center">
                Last Name
              </th>
              <th class="text-">
                Permission Name
              </th>
              <th class="text-center">
                Permission Date
              </th>
              <th class="text-">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in resultObject.items" :key="item.id">
              <td>{{ item.employeeFirstName }}</td>
              <td>{{ item.employeeLastName }}</td>
              <td>{{ item.permissionTypeName }}</td>
              <td>{{ item.dateStr }}</td>
              <td>
                <v-icon
                  small
                  class="mr-2"
                  @click="editPermission(item.id)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="deletePermission(item.id)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
  </v-container>
</template>


<script>
import axios from 'axios'

export default {
  data () {
    return {
      baseUrl: 'https://localhost:7058/api/permission',
      dialog: false,
      resultObject: {
        totalCount: 0,
        size: 5,
        after: 0,
        before: 0,
        previousPage: 0,
        currentPage: 1,
        items: [],
      },
      permissionId: 0,
      snackbar: false,
      snackbarText: '',
      loadComplete: false
    }
  },
  methods: {
    changePage() {
      if (this.resultObject.currentPage > this.resultObject.previousPage) {
        //next
        this.reloadList(this.resultObject.after, null, this.resultObject.currentPage, this.resultObject.size)
      }
      else {
        //previous
        this.reloadList(null, this.resultObject.before, this.resultObject.currentPage, this.resultObject.size)
      }
    },
    editPermission(id) {
      this.$router.push({ name: "Edit", params: { id: id } })
    },
    deletePermission(id) {
      this.dialog = true
      this.permissionId = id;
      console.log(id)
     
    },
    callDelete() {
      this.dialog = false
      axios.delete(`${this.baseUrl}/${this.permissionId}`)
      .then(() => {
        this.reloadList(null, null, this.resultObject.page, this.resultObject.size)
      })
      .catch(ex => {
        this.snackbarText = ex.message
        this.snackbar = true
      })
    },
    reloadList(after, before, page, size) { //Sacar los undefined de la url
      const self = this;
      var pagingParams = '';

      if (after !== undefined && after !== null) {
        pagingParams = `after=${after}&`
      }
      else if (before !== undefined && before !== null) {
        pagingParams = `before=${before}&`
      }
      if (pagingParams !== '') {
        pagingParams = `${pagingParams}page=${page}&size=${size}`
      }
      else {
        pagingParams = `page=${page}&size=${size}`
      }
      axios.get(`${this.baseUrl}?${pagingParams}`)
      .then((result) => {
        self.resultObject.items = result.data.items
        self.resultObject.totalCount = result.data.totalCount,
        self.resultObject.after = result.data.after,
        self.resultObject.before = result.data.before,
        self.resultObject.currentPage = result.data.page,
        self.resultObject.previousPage = result.data.page,
        self.resultObject.size = result.data.size
      })
      .catch(ex => {
        self.snackbarText = ex.message
        self.snackbar = true
      })
      .finally(() => {
        self.loadComplete = true
      });
    }
  },
  created() {
    this.reloadList(null, null, this.resultObject.currentPage, this.resultObject.size)
  }
}
</script>