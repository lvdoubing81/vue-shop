<template>
  <div id="app">
<!--    路由占位符-->
    <router-view></router-view>
  </div>
</template>

<script>

  import login from "./components/common/login/login";
  import home from "./page/home/home";

export default {
  name: 'app',
  components:{
    login,
      home
  }
}
</script>

<style>
</style>
