# vhat

This project is a demonstration of using gotify with Vue for a simple chat app. This code is not maintained and will have (according to dependabot) A LOT of potential security issues. I would not use in production. This code is purlyfor education purposes.

# Using

When you login use the Username/password of a user in Gotify. You need to use the same username and password as the user who created the Application for the GOTIFY 
# Running
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

# Environment

Create a file .env.local in the project directory and add contents like this
```text
VUE_APP_GOTIFY_URL=someserver.com
VUE_APP_GOTIFY_KEY=<A Token listed in one of your apps>
VUE_APP_DEFAULT_USERNAME=admin
VUE_APP_DEFAULT_PASSWORD=admin
```
NOTE: Don't put protocol or trailing slash for the url.
The username + password above should match the User who created the application that the key is for.


