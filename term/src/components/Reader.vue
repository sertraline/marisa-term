<template>
    <div id="reader-popup" @keydown="scroll">
        <div id="reader" ref="reader">
            <ul id="reader-container" ref="readercontainer">
                <li class="reader-line"
                     tabindex="-1"
                     v-for="line in contents"
                     :key="line"
                     v-html="line">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Reader",
        //props: ['contents'],
        data() {
            return {
                contents: Array(343).fill('lorem ipsum dor amet')
            }
        },

        methods: {
            scroll(e) {
                if (e.key === 'j') {
                    let top = document.querySelector('div#reader').offsetTop;
                    this.$refs.reader.style.top = (top - 20)+'px';
                    console.log(this.$refs.reader.style.top);
                }
                else if (e.key === 'k') {
                    let top = document.querySelector('div#reader').offsetTop;
                    if (top > 0) {
                        top = 0;
                        this.$refs.reader.style.top = (top)+'px';
                    }
                    this.$refs.reader.style.top = (top + 20)+'px';
                }
            }
        },
    }
</script>

<style scoped>

</style>