// 表单通用的保存和取消按钮，可以通过默认slot方式替换
<template>
    <el-form-item>
        <slot name="prepend"></slot>
        <slot>
            <el-button v-if="!noSaveBtn" type="primary" class="addclass"  @click='$emit("submit")' size='small' icon='el-icon-circle-check-outline'>保存</el-button>
            <el-button v-if="!noCancelBtn" @click="$router.go(-1)" size='small' icon='el-icon-circle-close-outline'>取消</el-button>
        </slot>
        <slot name="append"></slot>
    </el-form-item>
</template>

<script>
export default {
    props: {
        noSaveBtn: {
            type: Boolean,
            default: false,
        },
        noCancelBtn: {
            type: Boolean,
            default: false,
        },
    },
    methods: {},
    data() {
        return {};
    },
};
</script>



