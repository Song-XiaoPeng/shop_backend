<template>
    <div>
        <script id="editor" type="text/plain"></script>
    </div>
</template>
<script>
    export default {
        name: 'UE',
        data () {
            return {
                editor: null
            }
        },
        props: {
            defaultMsg: {
            },
            config: {
                type: Object
            }
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor('editor', this.config); // 初始化UE
        },
        methods: {
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            }
        },
        destroyed() {
            this.editor.destroy();
        },
        watch: {
            defaultMsg (newValue, oldValue) {
                if (Array.isArray(newValue)) {
                    return
                }

                this.editor.setContent(newValue || "  ");
            }
        },
    }
</script>