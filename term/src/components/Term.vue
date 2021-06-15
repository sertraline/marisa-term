<template>
    <div id="screen" ref="screen">
        <Reader v-if="reader_mounted" @reader_mounted="readerMountManager" />

        <div id="stdout">
            <p class ="inline-output"
               v-for ="line in stdout"
               :key  ="line"
               v-html="line">
            </p>
        </div>

        <div id="input" v-if="!in_progress">
            <p id="prompt">{{ prompt_message }}</p>
            <textarea
                    @input="auto_grow"
                    @keydown="get_key_press"
                    v-model="input"
                    id="shell"
                    ref="shell"
                    rows="1"
            />
        </div>

        <div id="upload-form" v-if="in_progress">
            <p>Upload your file (Ctrl+Shift+C to exit):</p>
            <form
                    :id="intertype"
                    method="post"
                    enctype="multipart/form-data"
                    action="#"
                    @submit="callSubmit"
            >
                <div class="btn-wrapper">
                    <button class="btn">Browse</button>
                    <input type="file" name="file">
                </div>
                <div class="btn-wrapper">
                    <button class="btn">Upload</button>
                    <input type="submit" value="Upload">
                </div>
            </form>
        </div>

    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import Reader from "./Reader";

    export default {
        name: "Term",
        components: { Reader },
        data() {
            return {
                input: '',
                in_progress: false,
                intertype: '',
                reader_content: [],
                reader_mounted: false,
            }
        },

        computed: {
            ...mapGetters('termhistory', ['history']),
            ...mapGetters('stdout', ['stdout']),
            ...mapGetters('processor', ['commands']),
            ...mapGetters('filesystem', ['filesystem', 'path']),
            ...mapGetters('http', ['response']),
            prompt_message: function() { return `[${this.path}] #:  ` }
        },

        methods: {
            ...mapActions('termhistory', ['push', 'pop', 'shift', 'unshift']),
            ...mapActions('processor', ['run']),
            ...mapActions('stdout', ['stdwrite', 'stdclear']),
            ...mapActions('filesystem', ['getfs']),
            ...mapActions('http', ['callApi']),

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
                            this.$nextTick(function() {
                                window.scrollTo(0, this.$refs.screen.scrollHeight)
                            })
                        }

                    }.bind(this));
                }

                this.input = '';
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
                if(e.ctrlKey && e.key === 'C') {
                    this.stdwrite(`${this.prompt_message}${this.input}^C`);

                    this.input = '';
                    this.in_progress = false;
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
                    if (!('shell' in this.$refs)) { return }
                    document.activeElement === this.$refs.shell
                        ? this.$refs.screen.focus()
                        : this.$refs.shell.focus();
                }

            },

            callSubmit(e) {
                e.preventDefault();
                console.log(e);
            },

            readerMountManager(e) {
                try {
                    this.$refs.screen.focus();
                    // eslint-disable-next-line no-empty
                } catch(e) {}
                this.reader_mounted = e;
            }
        },

        mounted() {
            if ('shell' in this.$refs && !(this.reader_mounted)) {
                this.$refs.shell.focus();
            }
            document.addEventListener("keydown", this.checkForEsc);
            document.addEventListener("keydown", this.trigger);

            this.getfs();
        },

        unmounted() {
            document.removeEventListener("keydown", this.checkForEsc);
            document.removeEventListener("keydown", this.trigger);
        }
    }
</script>

<style scoped>
  @import '../assets/main.css';
</style>