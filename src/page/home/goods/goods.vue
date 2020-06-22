<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片试图区域-->
        <el-card>
            <el-row>
                <el-col :span="6" class="mar-right">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryGood">
                        <el-button slot="append" icon="el-icon-search" @click="queryGood"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="toAddGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table  :data="goodList"
                       stripe
                       border
                       style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column  prop="goods_price" label="商品价格（元）" width="105px"></el-table-column>
                <el-table-column  prop="goods_weight" label="商品重量" width="70px"></el-table-column>
                <el-table-column   label="创建时间" width="150px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px"></el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "goods",
        data(){
            return{
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },
                goodList:[],
                total:''
            }
        },
        created() {
            this.getGoodList()
        },
        methods:{
            getGoodList(){
                this.$http.get('goods',{params:this.queryInfo}).then(res=>{
                    this.goodList = res.data.data.goods
                    this.total = res.data.data.total
                })
            },
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getGoodList()
            },
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getGoodList()
            },
            // 查找商品
            queryGood(){
                this.getGoodList()
            },
            // 添加商品跳转
            toAddGoods(){
                this.$router.push('/goods/add')
            }

        }
    }
</script>

<style scoped>

</style>