// custom-tab-bar/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        list: [{
            icon: "createtask",
            activeIcon: "createtask_fill",
            text: "明细"
        }, {
            icon: "dynamic",
                activeIcon: "dynamic_fill",
            text: "图表"
        }, {
            icon: "brush",
            activeIcon: "brush_fill",
            text: "记一笔"
        }, {
            icon: "activity",
            activeIcon: "activity_fill",
            text: "账本"
        }, {
            icon: "setup",
            activeIcon: "setup_fill",
            text: "设置"
        }],
        color: "#A0D8EF",
        activeColor: "#6BC8F2",
        backgroundColor: "#ffffff",
        borderColor: "#A0D8EF",
        active:2
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})