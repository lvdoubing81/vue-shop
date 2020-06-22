<template>
    <div class="login-container">
        <div class="login-box">
<!--            登录头像区域-->
            <div class="avatar-box">
                <img src="../../../assets/logo.png" alt="">
            </div>
<!--            登录输入区域-->
            <div>
                <el-form ref="loginFormRef" :model="loginForm" :rules="formRules" class="login-form" label-width="0px">
<!--                    用户名-->
                    <el-form-item prop="username">
                        <el-input
                                v-model="loginForm.username"
                                prefix-icon="el-icon-user"
                                spellcheck="false"
                                placeholder="请输入用户名">
                        </el-input>
                    </el-form-item>
<!--                    密码-->
                    <el-form-item prop="password" >
                        <el-input prefix-icon="el-icon-lock"
                                  type="password"
                                  v-model="loginForm.password"
                                  placeholder="请输入密码">
                        </el-input>
                    </el-form-item>
<!--                    按钮-->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return{
                //这是登录表单绑定的数据
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                res:'',
                //这是表单验证的规则
                formRules:{
                    //验证用户名是否合法
                    username: [
                        { required:true,message:'请输入登录名称',trigger:'blur'},
                        { min: 3,max :10,message:'长度在3到10个字符',trigger:'blur'}
                    ],
                    password:[
                        { required:true,message:'请输入登录密码',trigger:'blur'},
                        { min: 6,max :15,message:'长度在6到15个字符',trigger:'blur'}
                    ]
                }
            }
        },
        methods:{
            resetLoginForm(){
                //重置文本框
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                //判断输入内容是否合法
                this.$refs.loginFormRef.validate(valid => {
                   if(!valid) return
                    //发送axios请求
                    console.log('登录')
                     this.$http.post("login",this.loginForm).then( res =>{
                         this.res = res.data
                         if(this.res.data){
                             //登录成功，绿色弹窗
                             this.$message.success(this.res.meta.msg)
                             //存储token到sessionStorage中
                             window.sessionStorage.setItem('token',this.res.data.token)
                             //跳转到主页
                             this.$router.push('/home')
                         }else {
                             //登录失败
                             this.$message.error(this.res.meta.msg)
                         }
                     }).catch(err =>{
                         console.log(err)
                     })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login-container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login-box{
        height: 300px;
        width: 450px;
        border-radius: 3px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
    .avatar-box{
        width: 120px;
        height: 120px;
        background-color: #ffffff;
        border-radius: 50%;
        border: 1px solid #eeeeee;
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .avatar-box img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login-form{
        position: absolute;
        width: 100%;
        bottom: 0;
        box-sizing: border-box;
        padding: 12px;
    }
</style>