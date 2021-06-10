<template>
    <div id="screen" ref="screen">
        <div id="stdout">
            <p class="inline-output" v-for="line in stdout" :key="line">
                {{ line }}
            </p>
        </div>

        <div id="input">
            <p id="prompt">{{ prompt_message }}</p>
            <textarea
                    @input="auto_grow"
                    @keydown="get_key_press"
                    v-model="input"
                    id="shell"
                    ref="shell"
                    rows="1"></textarea>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: "Term",
        data() {
            return {
                prompt_message: '#: ',
                input: '',
            }
        },

        computed: {
            ...mapGetters(['history', 'stdout', 'commands']),
        },

        methods: {
            ...mapActions([
                'push', 'pop', 'run', 'stdwrite', 'stdclean'
            ]),

            get_key_press(e) {
                if (e.key !== 'Enter') { return }

                if (this.input.endsWith('\\')) {
                    return;
                }
                let com = this.input.trim();

                this.stdwrite(`${this.prompt_message}${com}`);

                if (com) {
                    // commit to history
                    this.push(com);

                    this.run(com).then(function(res) {
                        if ('response' in res) {
                            this.stdwrite(res['response']);
                        }

                    }.bind(this));
                }

                this.input = '';

                this.$nextTick(function() {
                    window.scrollTo(0, this.$refs.screen.scrollHeight)
                })

                e.preventDefault();
            },

            auto_grow(e) {
                e.target.style.height = "5px";
                e.target.style.height = (e.target.scrollHeight)+"px";

                console.log(this.input.split('\n'));
                if (!this.input.trim()) {
                    e.target.style.height = '24px';
                    this.$refs.shell.style.height = '24px';
                }
            },
        },

        mounted() {
            this.$refs.shell.focus();
        }
    }
</script>

<style scoped>
  @import '../assets/main.css';
</style>