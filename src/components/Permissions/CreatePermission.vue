<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-snackbar
        :timeout="-1"
        :value="true"
        absolute
        centered
        tile
        v-model="snackbar"
        color="red accent-2"
      >
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          X
        </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    <v-row row wrap v-if="loadComplete">
      <v-col d6 mr0>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col xl="6" lg="6" md="6" cols="12">
              <v-text-field
                v-model="permission.employeeFirstName"
                :counter="100"
                :rules="firstNameRules"
                label="First Name"
                required
              ></v-text-field>
            </v-col>
            <v-col xl="6" lg="6" md="6">
              <v-text-field
                v-model="permission.employeeLastName"
                :counter="100"
                :rules="lastNameRules"
                label="Last Name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        
          <v-row>
            <v-col xl="6" lg="6" md="6" cols="12">
              <v-autocomplete
                v-model="permission.permissionTypeId"
                :items="permissionTypes"
                item-text="name"
                item-value="id"
                :rules="permissionTypeRequired"
                dense
                label="Permission Type"
              ></v-autocomplete>
            </v-col>
            <v-col xl="6" lg="6" md="6" cols="12">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                reactive
                :return-value.sync="permission.date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="permission.date"
                    
                    label="Picker in menu"
                    prepend-icon="mdi-calendar"
                    readonly
                    required
                    :rules="dateRequired"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="permission.date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(permission.date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-col xl="6" lg="6" md="6" cols="12">
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="submit"
              >
                Save
              </v-btn>
              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
                Reset Form
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import axios from 'axios'

  export default {
    data: () => ({
      baseUrl: 'https://localhost:7058/api',
      permission: {
        id: 0,
        employeeFirstName: '',
        employeeLastName: '',
        permissionTypeId: '',
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },

      valid: true,
      menu: false,
      modal: false,
      menu2: false,
      loadComplete: false,
      snackbar: false,
      snackbarText: '',

      permissionTypes: [],

      permissionTypeRequired: [
        v => !!v || "Permission type is required"
      ],

      lastNameRules: [
         v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Last name must be less than 10 characters',
      ],

      firstNameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'First name must be less than 10 characters',
      ],
      dateRequired: [
        v => !!v || "Date is required"
      ]
      
    }),
    methods: {
      
      reset () {
        this.$refs.form.reset()
      },
      submit(){
        if (this.$route.params.id === undefined) {
          this.$refs.form.validate()
          axios.post(`${this.baseUrl}/permission`, this.permission)
          .then(res=>{
            console.log(res)
            this.$router.push({ name: 'List' });
          })
          .catch(ex => {
            this.showError(ex.errors)
            
          })
        }
        else {
          this.$refs.form.validate()
          axios.put(`${this.baseUrl}/permission/${this.permission.id}`, this.permission)
          .then(res=>{
            console.log(res)
            this.$router.push({ name: 'List' });
          })
          .catch(ex => {
            this.showError(ex.message)
          })
        }
      },
      showError(message) {
        if (message) {
          this.snackbarText = message;
        }
        else {
          this.snackbarText = "An unexpected error occurred"
        }
        this.snackbar = true
      },
    },
    created() {
      const self = this
      axios.get(`${this.baseUrl}/permissionTypes`)
        .then(res => {
          self.permissionTypes = res.data
        }).catch(ex => {
            this.showError(ex.message)
          });
        
      if (this.$route.params.id !== undefined) {
        const idParam = this.$route.params.id;
        const id = parseInt(idParam);
        if (!isNaN(id)) {
          const self = this
          axios.get(`${this.baseUrl}/permission/${id}`)
          .then(res => {
            self.permission = res.data
            console.log(self.permission)
          })
          .catch(ex => {
            self.showError(ex.message)
          })
          .finally(() => {
            self.loadComplete = true
          });
        }
      }
      else {
        this.loadComplete = true
      }

    },
  }
</script>