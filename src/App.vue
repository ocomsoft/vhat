<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>VHAT - </span>
        <span class="font-weight-light">Vue Chat</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>

    <v-content>
      <v-alert v-if="connected"
      :value="true"
      type="success"
    >
      Connection Open
    </v-alert>

      <v-alert v-if="!connected"
      :value="true"
      type="warning"
    >
      Connection Closed
        <v-btn @click="logout">Login</v-btn>
    </v-alert>
      <v-alert v-if="error"
      :value="true"
      type="error"
    >
      Connection Error
    </v-alert>

      <v-layout v-if="!token">
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline mb-0">Login</h3>
            </v-card-title>
            <v-card-text>
              <v-flex xs12>
                 <v-text-field type="text" v-model="handle"
                              label="Handle" required
                ></v-text-field>

                <v-btn v-on:click="login">Login</v-btn>
              </v-flex>

            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout v-if="token">
          <v-layout row wrap>
            <v-flex xs12 mb-2 v-for="msg in messages" :key="msg.id">
              <v-card v-bind:class="{'text-xs-right':msg.title==handle}" :color="(msg.title==handle) ? 'blue lighten-2' : 'orange lighten-2'">
                <v-card-title :color="(msg.title==handle) ? 'blue darken-2' : 'orange darken-2'" primary-title><strong>{{msg.title}}</strong></v-card-title>
                <v-card-text>{{msg.message}}</v-card-text>
              </v-card>
            </v-flex>

            <v-footer class="pa-3" v-if="connected" fixed dark height="60" app >
                  <v-text-field v-model="newMessage" name="newMessage" solo light
                          label="Message" hide-details
                  ></v-text-field>

                  <v-btn color="primary" dark @click="send" :disabled="!newMessage">Send</v-btn>
                  <v-btn @click="logout" flat>Logout</v-btn>
            </v-footer>
          </v-layout>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data () {
    return {
      url: 'http://localhost:8080/ws/',
      gotifyKey: (process.env.VUE_APP_GOTIFY_KEY || 'please change .env.local'),
      auth: {
        username: (process.env.VUE_APP_DEFAULT_USERNAME || 'admin'),
        password: (process.env.VUE_APP_DEFAULT_PASSWORD || 'admin')
      },
      handle: '',
      messages: [],
      newMessage: 'Just work!!!',
      token: null,
      client_id: null,
      socket: null,
      connected: false,
      error: false
    }
  },
  sockets: {
    onopen () {
      this.error = false
      this.connected = true
    },
    onclose () {
      this.error = false
      this.connected = false
    },
    onerror (err) {
      this.connected = false
      this.error = true
      console.log(err)
    },
    onmessage (msg) {
      this.messages.push(JSON.parse(msg.data))
    }
  },
  methods: {
    login () {
      this.axios({
        url: this.url + 'client',
        method: 'POST',
        data: { 'name': this.handle + '-vhat' },
        // withCredentials: true,
        auth: this.auth
      }).then((resp) => {
        const token = resp.data.token

        this.token = token
        this.client_id = resp.data.id

        this.newMessage = 'Hi, I am ' + this.handle

        this.$connect('ws://localhost:8080/stream?token=' + token)

        this.axios({
          url: this.url + 'message',
          method: 'POST',
          data: { 'message': this.handle + ' Has joined the chat', 'title': 'system', 'priority': 2 },
          headers: {
            'X-Gotify-Key': this.gotifyKey
          }
        })
        // TODO Show Logged in
      }).catch((err) => {
        console.log(err)

        this.token = null
        // TODO Show not logged in
      })
    },
    logout () {
      // Tell gotify we are logged out - remove the client
      this.axios({
        url: this.url + 'client/' + this.client_id,
        method: 'DELETE',
        auth: this.auth
      }).finally(() => {
        this.token = null
        this.$disconnect()
        this.messages = []
      })
    },
    send () {
      this.axios({
        url: this.url + 'message',
        method: 'POST',
        data: { 'message': this.newMessage, 'title': this.handle, 'priority': 2 },
        headers: {
          'X-Gotify-Key': this.gotifyKey
        }
      }).then((resp) => {
        this.newMessage = ''
        // this.messages.push(resp.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  destroy () {
    this.$disconnect()
  }
}
</script>
