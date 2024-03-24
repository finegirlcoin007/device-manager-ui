exports.install = function (Vue) {
    // 把需要暴露出去的方法挂载到Vue原型上，避免了全局变量过多的问题
    Vue.prototype.refreshData = function () {

      console.log("刷新设备列表")
      const component = findComponentDownward(this, 'Device')
      console.log("component",component)
      if(component){
        component.getData()
      }
  
    }
  }
  
  /**
   * 由一个组件，向下找到最近的指定组件
   * @param {*} context 当前上下文，比如你要基于哪个组件来向上寻找，一般都是基于当前的组件，也就是传入 this
   * @param {*} componentName 要找的组件的 name
   */
  function findComponentDownward(context, componentName) {
    const childrens = context.$children
    let children = null
  
    if (childrens.length) {
      for (const child of childrens) {
        const name = child.$options.name
  
        if (name === componentName) {
          children = child
          break
        } else {
          children = findComponentDownward(child, componentName)
          if (children) break
        }
      }
    }
    return children
  }
  