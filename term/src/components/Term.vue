<template>
    <div id="screen" ref="screen" @keydown="trigger">
        <div id="stdout">
            <p class="inline-output" v-for="line in stdout" :key="line" v-html="line">
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
                input: '',
            }
        },

        computed: {
            ...mapGetters('termhistory', ['history']),
            ...mapGetters('stdout', ['stdout']),
            ...mapGetters('processor', ['commands']),
            ...mapGetters('fs', ['filesystem', 'path']),
            prompt_message: function() { return `[${this.path}] #:` }
        },

        methods: {
            ...mapActions('termhistory', ['push', 'pop', 'shift', 'unshift']),
            ...mapActions('processor', ['run']),
            ...mapActions('stdout', ['stdwrite', 'stdclear']),
            ...mapActions('fs', ['getfs']),

            get_key_press(e) {
                if (e.key !== 'Enter') { return }
                if (this.input.endsWith('\\')) { return }

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

                if (!this.input.trim()) {
                    e.target.style.height = '24px';
                    this.$refs.shell.style.height = '24px';
                }
            },

            trigger(e) {
                if(e.ctrlKey && e.shiftKey && e.key === 'C') {
                    this.stdwrite(`${this.prompt_message}${this.input}^C`);
                    this.input = '';
                    e.preventDefault();
                }

                if(e.key === 'ArrowUp') {
                    e.preventDefault();

                    let last_cmd = this.history[this.history.length - 1];
                    if (last_cmd) {
                        this.input = last_cmd;
                    }

                    this.unshift(last_cmd);
                } else if(e.key === 'ArrowDown') {
                    e.preventDefault();

                    let prev_cmd = this.history[1];
                    if (prev_cmd) {
                        this.input = prev_cmd;
                    }

                    let cb = {};
                    this.shift(cb).then(this.push(cb.out));
                }

                if(e.ctrlKey && e.key === 'l') {
                    e.preventDefault();
                    this.stdclear();
                }

            },

            checkForEsc(e) {
                if(e.key === 'Escape') {
                    e.preventDefault();
                    document.activeElement === this.$refs.shell
                        ? this.$refs.screen.focus()
                        : this.$refs.shell.focus();
                }

            }
        },

        mounted() {
            this.$refs.shell.focus();
            document.addEventListener("keydown", this.checkForEsc);

            this.getfs();
        }
    }
</script>

<style scoped>
  @import '../assets/main.css';
</style>