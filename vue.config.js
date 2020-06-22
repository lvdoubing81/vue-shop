module.export = {

    chainWebpack: config=>{
        config.when(process.env.NODE_ENV === 'production',config=>{
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals',{
                axios: 'axios',
                lodash:'_',
                echarts: 'echarts',
                nprogress:'nprogress',
                'vue-equill-editor':'VueQuillEditor'
            })
        })

        config.when(process.env.NODE_ENV === 'development',config=>{
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }

}