<template>
        <el-container class="home-container">
                <!--头部区域-->
            <el-header>
                <div class="header-left">
                    <img src="../../assets/image/home/headerImg.png" alt="">
                    <span>电商后台管理系统</span>
                </div>

                <el-button @click="logout">退出</el-button></el-header>
                <!--侧边栏-->
            <el-container>
                <el-aside :width="isCollapse ? '64px':'200px'">
                <!--折叠按钮-->
                    <div class="toggle-btn" @click="toggleBtnClick">|||</div>
                <!--一级菜单-->
                    <el-menu
                            class="el-menu-vertical-demo"
                            background-color="#333744"
                            text-color="#fff"
                            unique-opened
                            :collapse="isCollapse"
                            :collapse-transition="false"
                            router
                            :default-active="$route.path"
                            active-text-color="#409eff">
                        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                            <!--一级菜单模板区域-->
                            <template slot="title">
                                <!--图标-->
                                <i :class="iconList[item.id] + ''"></i>
                                <!--文本-->
                                <span>{{item.authName}}</span>
                            </template>

                            <!--二级菜单-->
                                <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
                                              :key="subItem.id">
                                    <template slot="title">
                                        <!--图标-->
                                        <i class="el-icon-menu"></i>
                                        <!--文本-->
                                        <span>{{subItem.authName}}</span>
                                    </template>
                                </el-menu-item>

                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>

<script>
    import welcome from "./welcome";

    export default {
        name: "home",
        data(){
            return{
                menuList:[],
                iconList:{
                    '125':'iconfont icon-user',
                    '103':'iconfont icon-tijikongjian',
                    '101':'iconfont icon-shangpin',
                    '102':'iconfont icon-danju',
                    '145':'iconfont icon-baobiao',
                },
                isCollapse: false
            }
        },
        components:{

        },
        mounted() {
            this.getMenuList()
        },
        methods:{
            logout(){
                window.sessionStorage.removeItem('token')
                this.$router.push('/login')
            },
            getMenuList(){
                this.$http.get('menus').then(res =>{
                    this.menuList = res.data.data
                })
            },
            toggleBtnClick(){
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container{
        height: 100%;
    }
    .el-container{
        height: 100%;
    }
    .el-header{
        background-color: #373d41;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        >div{
            display: flex;
            align-items: center;
        }
    }
    .el-header span{
        margin-left: 12px;
        font-size: 20px;
        font-weight: 500;

    }
    .el-aside{

        background-color: #333744;
    }
    .el-main{
        background-color: #eaedf1;
    }
    .toggle-btn{
        background-color: #4a5064;
        text-align: center;
        color: #ffffff;
        font-size: 10px;
        line-height: 24px;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .iconfont{
        margin-right: 9px;
    }
    .el-menu{
        border-right: none;
    }

</style>