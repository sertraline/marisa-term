<template>
    <div id="wrapper">
        <Term />
    </div>
</template>

<script>
    import Term from './components/Term.vue';

    export default {
        name: "app",
        components: { Term },

        data() {
          return {
              boot: false,
          }
        },

        methods: {
            getCookie(name) {
                let matches = document.cookie.match(new RegExp(
                    "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/\+\^])/g, '\\$1') + "=([^;]*)"
                ));
                return matches ? decodeURIComponent(matches[1]) : undefined;
            },

            setCookie(name) {
                document.cookie = name;
            }
        },

        mounted() {
            if (this.getCookie('boot') === 'true') {
                this.boot = true;
            }
        }
    }
</script>

<style>
</style>
