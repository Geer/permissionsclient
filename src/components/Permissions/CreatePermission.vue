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
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                   v-model="dateStr"
                    @blur="permission.date = parseDate(dateStr)"
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
                  :locale="'es'"
                  @input="dateChange($event)"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Clean form
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
import moment from 'moment'

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
      loadComplete: false,
      snackbar: false,
      snackbarText: '',
      dateStr: '',

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
    filters: {
      moment: function(date) {
        return moment(date).format("DD/MM/YYYY");
      }
    },
    methods: {
      dateChange() {
        this.dateStr = this.formatDate(this.permission.date);
        this.menu = false;
      },
      formatDate(date) {
        if (!date) return null;

        return moment(this.permission.date).format("DD/MM/YYYY");
      },
      parseDate(date) {
        if (!date) return null;
        var dateSplit = date.split("/");
        if (dateSplit.length != 3 || dateSplit[2].length != 4) {
          return null;
        }

        const [day, month, year] = dateSplit;
        const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
        if (isNaN(Date.parse(formattedDate))) {
          return null;
        }

        if (parseInt(dateSplit[2]) < 1000) {
          return null;
        }
        return formattedDate;
      },
      reset () {
        this.$refs.form.reset()
      },
      submit(){
        console.log(this.permission)
        this.$refs.form.validate()
        if (this.$route.params.id === undefined) {
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
            self.dateStr = this.formatDate(self.permission.date);
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