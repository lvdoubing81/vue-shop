<template xmlns:el-col="http://www.w3.org/1999/html">
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <el-steps class="mar-bt"  :active="activeIndex" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px" label-position="top">
                <el-tabs class="mar-bt" v-model="activeIndex"
                         :tab-position="'left'" :before-leave="beforeLeave" @tab-click="tabClick">
                    <!--基本信息页面-->
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="4">
                                <span>商品分类</span>
                            </el-col>
                            <el-col :span="20">
                                <el-cascader
                                        v-model="addSelectedKeys"
                                        :options="cateList"
                                        :props="addProps"
                                        @change="handleChange"></el-cascader>
                            </el-col>
                        </el-row>


                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals" @change="checkChange">
                                <el-checkbox border :label="cb"
                                             v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                                :action="upLoadUrl"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                list-type="picture" :headers="headerObj" :on-success="onSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce">

                        </quill-editor>
                    </el-tab-pane>
                    <el-tab-pane label="完成" name="5">
                        <el-button type="primary" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

        </el-card>
        <el-dialog
                title="图片预览"
                :visible.sync="previewVisible"
                width="50%">
            <img :src="previewPath" alt="" />
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "add",
        data(){
            return{
                activeIndex: '0',
                addForm:{
                    goods_cat:'',
                    goods_name:'',
                    goods_price:'',
                    goods_weight:'',
                    goods_number:'',
                    goods_introduce:'',
                    pics:[],
                    attrs:[]
                },
                addFormRules:{
                    goods_cat:[{required: true, message: '请选择商品分类', trigger: 'blur'}],
                    goods_name:[{required: true, message: '请输入商品名称', trigger: 'blur'}],
                    goods_price:[{required: true, message: '请输入商品价格', trigger: 'blur'}],
                    goods_weight:[{required: true, message: '请输入商品重量', trigger: 'blur'}],
                    goods_number:[{required: true, message: '请输入商品数量', trigger: 'blur'}],
                },
                cateList:[],
                addSelectedKeys:[],
                addProps:{
                    value: 'cat_id',
                    label: 'cat_name',
                    children:'children'
                },
                manyTableData:[],
                onlyTableData:[],
                upLoadUrl:"http://47.115.124.102:8888/api/private/v1/upload",
                headerObj:{
                    Authorization: window.sessionStorage.getItem('token')
                },
                previewVisible:false,
                previewPath:''
            }
        },
        created() {
            this.getCateList()
        },
        methods:{
            getCateList(){
                this.$http.get(`categories`).then(res=>{
                    this.cateList = res.data.data
                })
            },
            handleChange(){
                if(this.addSelectedKeys.length !==3){
                    this.addSelectedKeys = []
                    this.$confirm('只允许选中三级分类', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    })
                }
                this.addForm.goods_cat = this.addSelectedKeys.join(',')
            },
            beforeLeave(activeName,oldActiveName){
                if(oldActiveName ==='0' && !this.addForm.goods_cat){
                    this.$message.error("请填写商品信息")
                    return false
                }
            },
            tabClick(){
                if(this.activeIndex === '1'){
                    this.$http.get(`categories/${this.addSelectedKeys[2]}/attributes`,
                        {params:{sel:'many'}}).then(res=>{
                            res.data.data.forEach(item=>{
                                item.attr_vals = item.attr_vals.length == '0' ? [] : item.attr_vals.split(' ')
                            })
                       this.manyTableData = res.data.data

                    })
                }
                if(this.activeIndex === '2'){
                    this.$http.get(`categories/${this.addSelectedKeys[2]}/attributes`,
                        {params:{sel:'only'}}).then(res=>{
                        res.data.data.forEach(item=>{
                            item.attr_vals = item.attr_vals.length == '0' ? [] : item.attr_vals.split(' ')
                        })
                        this.onlyTableData = res.data.data

                    })
                }
            },
            checkChange(){
                console.log(this.checkList)
            },
            handleRemove(file) {
                const filePath = file.response.data.tmp_path
                const i = this.addForm.pics.find(x=>{
                    x.pic = filePath
                })
                this.addForm.pics.splice(i,1)
                console.log(this.addForm)
            },
            handlePreview(file) {
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            onSuccess(response){
                const picsInfo ={ pic : response.data.tmp_path }
                this.addForm.pics.push(picsInfo)
            },
            add(){
                //验证表单
                this.$refs.addForm.validate(valid=>{
                    if (!valid)
                        return this.$message.error('请填写商品信息')
                })
                //表单数据处理

                this.manyTableData.forEach(item=>{
                    const newInfo = {attr_id:item.attr_id, attr_vals:item.attr_vals}
                    this.addForm.attrs.push(newInfo)

                })
                this.onlyTableData.forEach(item=>{
                    const newInfo = {attr_id:item.attr_id,
                        attr_vals: item.attr_vals}
                    this.addForm.attrs.push(newInfo)

                })

                this.$http.post('goods',this.addForm).then(res=>{
                    this.$message.success('添加商品成功！')
                    this.$router.push('/goods')
                })

        }
        }
    }
</script>

<style scoped>
    .el-dialog img{
        width: 100%;
    }
</style>